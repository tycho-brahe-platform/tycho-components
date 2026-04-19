const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach((item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (
      item.endsWith('.scss') ||
      item.endsWith('.css') ||
      item.endsWith('.svg') ||
      item.endsWith('.png')
    ) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}
// Example: copy all SCSS/CSS from src/ to dist/
copyDir(path.join(__dirname, '../src'), path.join(__dirname, '../dist'));
