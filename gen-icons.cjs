const fs = require('fs');

function makeSvg(size) {
  const r = Math.round(size * 0.25);
  const fontSize = Math.round(size * 0.5);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">`,
    `    <stop offset="0%" stop-color="#aa4527"/><stop offset="100%" stop-color="#87351d"/>`,
    `  </linearGradient></defs>`,
    `  <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>`,
    `  <text x="50%" y="54%" font-family="Georgia,serif" font-size="${fontSize}" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">K</text>`,
    `</svg>`
  ].join('\n');
}

function makeMaskable(size) {
  const fontSize = Math.round(size * 0.4);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `  <rect width="${size}" height="${size}" fill="#aa4527"/>`,
    `  <text x="50%" y="54%" font-family="Georgia,serif" font-size="${fontSize}" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">K</text>`,
    `</svg>`
  ].join('\n');
}

fs.writeFileSync('public/icons/icon-192.svg', makeSvg(192));
fs.writeFileSync('public/icons/icon-512.svg', makeSvg(512));
fs.writeFileSync('public/icons/icon-maskable-192.svg', makeMaskable(192));
fs.writeFileSync('public/icons/icon-maskable-512.svg', makeMaskable(512));
console.log('SVG icons created');
