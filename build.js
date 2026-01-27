const fs = require('fs');
const path = require('path');

function renderHtml(filePath, seen = new Set()) {
  if (seen.has(filePath)) return '';
  seen.add(filePath);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const includeRE = /<!--\s*@include\s+([^\s]+)\s*-->/g;
  
  content = content.replace(includeRE, (match, incPath) => {
    const rel = incPath.replace(/"/g, '');
    const incAbs = path.join(__dirname, rel);
    if (!fs.existsSync(incAbs)) return `<!-- missing include ${rel} -->`;
    return renderHtml(incAbs, seen);
  });
  
  return content;
}

// Build index.html
const output = renderHtml(path.join(__dirname, 'index.html'));
fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), output);

// Build china.html
const chinaOutput = renderHtml(path.join(__dirname, 'china.html'));
fs.writeFileSync(path.join(__dirname, 'dist', 'china.html'), chinaOutput);

// Build qatar.html
const qatarOutput = renderHtml(path.join(__dirname, 'qatar.html'));
fs.writeFileSync(path.join(__dirname, 'dist', 'qatar.html'), qatarOutput);

fs.copyFileSync(path.join(__dirname, 'styles.css'), path.join(__dirname, 'dist', 'styles.css'));
fs.copyFileSync(path.join(__dirname, 'script.js'), path.join(__dirname, 'dist', 'script.js'));

console.log('✓ Build complete: dist/index.html, dist/china.html, dist/qatar.html');
