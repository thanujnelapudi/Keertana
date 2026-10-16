-- Run in the Supabase SQL Editor after the migration. All fixture data rolls back.
begin;
do $$
declare role_name text; first_id uuid; again_id uuid; request_id uuid := gen_random_uuid(); rows jsonb; next_rows jsonb; i integer;
begin
  foreach role_name in array array['anon','authenticated'] loop
    assert not has_schema_privilege(role_name, 'keertana_private', 'usage'), 'Private schema accessible';
    assert not has_table_privilege(role_name, 'keertana_private.song_comments', 'select,insert,update,delete'), 'Private comments accessible';
    assert not has_function_privilege(role_name, 'public.keertana_submit_comment(uuid,text,text,text,text)', 'execute'), 'Direct submission allowed';
    assert not has_function_privilege(role_name, 'public.keertana_read_comments(text,timestamptz,uuid)', 'execute'), 'Direct RPC read allowed';
  end loop;
  assert (select relrowsecurity from pg_class where oid = 'keertana_private.song_comments'::regclass), 'RLS disabled';
  first_id := public.keertana_submit_comment(request_id, 'test-review-song', 'Test reader', 'A short pronunciation correction.', 'https://example.org/reference');
  again_id := public.keertana_submit_comment(request_id, 'test-review-song', 'Test reader', 'A short pronunciation correction.', 'https://example.org/reference');
  assert first_id = again_id, 'Retry created another entry';
  assert jsonb_array_length(public.keertana_read_comments('test-review-song')) = 0, 'Pending comment leaked';
  begin
    perform public.keertana_submit_comment(request_id, 'test-review-song', 'Test reader', 'Different draft contents.', '');
    raise exception 'Draft collision was accepted';
  exception when raise_exception then
    if sqlerrm <> 'COMMENT_DRAFT_CHANGED' then raise; end if;
  end;
  update keertana_private.song_comments set status = 'approved', moderation_note = 'PRIVATE TEST NOTE' where id = first_id;
  rows := public.keertana_read_comments('test-review-song');
  assert jsonb_array_length(rows) = 1 and rows->0->>'createdAt' is not null, 'Approval did not publish';
  assert not ((rows->0) ?| array['status','request_id','moderation_note','created_at']), 'Private fields leaked';
  update keertana_private.song_comments set status = 'rejected' where id = first_id;
  assert jsonb_array_length(public.keertana_read_comments('test-review-song')) = 0, 'Rejected comment leaked';
  for i in 1..12 loop
    insert into keertana_private.song_comments(request_id, song_slug, display_name, body, status)
      values (gen_random_uuid(), 'test-pagination-song', 'Test reader', 'Pagination test entry ' || i, 'approved');
  end loop;
  rows := public.keertana_read_comments('test-pagination-song');
  assert jsonb_array_length(rows) = 11, 'First-page limit failed';
  next_rows := public.keertana_read_comments('test-pagination-song', (rows->9->>'createdAt')::timestamptz, (rows->9->>'id')::uuid);
  assert jsonb_array_length(next_rows) = 2, 'Cursor pagination skipped/repeated entries';
  for i in 1..20 loop
    perform public.keertana_submit_comment(gen_random_uuid(), 'test-rate-song', 'Test reader', 'Rate test entry ' || i, '');
  end loop;
  begin
    perform public.keertana_submit_comment(gen_random_uuid(), 'test-rate-song', 'Test reader', 'One entry too many.', '');
    raise exception 'Rate limit was not enforced';
  exception when raise_exception then
    if sqlerrm <> 'COMMENT_RATE_LIMIT' then raise; end if;
  end;
  -- 1 rejected + 12 approved + 20 rate fixtures = 33 accepted in this transaction.
  for i in 1..67 loop
    perform public.keertana_submit_comment(gen_random_uuid(), 'test-global-' || (i % 5), 'Test reader', 'Global admission test ' || i, '');
  end loop;
  begin
    perform public.keertana_submit_comment(gen_random_uuid(), 'test-global-overflow', 'Test reader', 'One global entry too many.', '');
    raise exception 'Global limit was not enforced';
  exception when raise_exception then
    if sqlerrm <> 'COMMENT_RATE_LIMIT' then raise; end if;
  end;
end;
$$;
rollback;
