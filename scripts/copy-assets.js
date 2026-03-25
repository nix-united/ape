const fs = require('fs')
const path = require('path')

const dist = path.resolve(__dirname, '..', 'dist')
const root = path.resolve(__dirname, '..')
const nm = path.join(root, 'node_modules')

function copyDir (src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isSymbolicLink()) {
      continue
    } else if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

fs.mkdirSync(dist, { recursive: true })

// Copy reveal.js from node_modules directly to dist/
const revealDest = path.join(dist, 'javascripts', 'reveal.js')
console.log('Copying reveal.js → dist/javascripts/reveal.js/')
copyDir(path.join(nm, 'reveal.js'), revealDest)

// Copy reveal.js plugins directly into dist/
const plugins = {
  menu: path.join(nm, 'reveal.js-menu'),
  copycode: path.join(nm, 'reveal.js-copycode', 'plugin', 'copycode'),
  mermaid: path.join(nm, 'reveal.js-mermaid-plugin', 'plugin', 'mermaid')
}

for (const [name, src] of Object.entries(plugins)) {
  const dest = path.join(revealDest, 'plugin', name)
  console.log(`Copying plugin ${name} → dist/javascripts/reveal.js/plugin/${name}/`)
  copyDir(src, dest)
}

// Copy static assets
for (const dir of ['stylesheets', 'images', 'common']) {
  const src = path.join(root, dir)
  if (fs.existsSync(src)) {
    const dest = path.join(dist, dir)
    console.log(`Copying ${dir}/ → dist/${dir}/`)
    copyDir(src, dest)
  }
}

// Copy presentation-specific images (e.g. example/images/)
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.isDirectory() && !['node_modules', 'dist', '.git', '.idea', 'scripts', 'common', 'javascripts', 'stylesheets', 'images'].includes(entry.name)) {
    const imagesDir = path.join(root, entry.name, 'images')
    if (fs.existsSync(imagesDir)) {
      const dest = path.join(dist, entry.name, 'images')
      console.log(`Copying ${entry.name}/images/ → dist/${entry.name}/images/`)
      copyDir(imagesDir, dest)
    }
  }
}