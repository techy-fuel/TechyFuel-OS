#!/usr/bin/env node
// Compile all JSX screen files to plain JS (no imports, React.createElement).
const fs = require('fs');
const path = require('path');

// Load Babel standalone
const Babel = require('@babel/standalone');

const SRC_DIR = path.join(__dirname, 'project/ui_kits/techyfuel-os');
const OUT_DIR = path.join(__dirname, 'project/compiled');

const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.jsx'));

let ok = 0, fail = 0;
files.forEach(file => {
  const src = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
  try {
    const result = Babel.transform(src, {
      presets: [['react', { runtime: 'classic' }]],
      filename: file,
    });
    const outFile = file.replace('.jsx', '.js');
    fs.writeFileSync(path.join(OUT_DIR, outFile), result.code, 'utf8');
    console.log('✓', outFile);
    ok++;
  } catch (err) {
    console.error('✗', file, err.message);
    fail++;
  }
});

console.log(`\nDone: ${ok} compiled, ${fail} failed`);
if (fail > 0) process.exit(1);
