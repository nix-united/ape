const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const root = path.resolve(__dirname, '..')
const dist = path.join(root, 'dist')
const skip = ['node_modules', 'dist', '.git', '.idea', 'scripts', 'common', 'javascripts', 'stylesheets', 'includes']

// Copy assets first
execFileSync('node', [path.join(__dirname, 'copy-assets.js')], { stdio: 'inherit' })

// Find all .adoc files (root + subdirectories)
function findAdocFiles (dir, relDir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const rel = path.join(relDir, entry.name)
    if (entry.isDirectory() && !skip.includes(entry.name)) {
      files.push(...findAdocFiles(path.join(dir, entry.name), rel))
    } else if (entry.isFile() && entry.name.endsWith('.adoc')) {
      files.push(rel)
    }
  }
  return files
}

const adocFiles = findAdocFiles(root, '')

if (adocFiles.length === 0) {
  console.error('No .adoc files found.')
  process.exit(1)
}

const cli = path.join(root, 'node_modules', '.bin', 'asciidoctor-revealjs')

for (const file of adocFiles) {
  const srcFile = path.join(root, file)
  const destDir = path.join(dist, path.dirname(file))
  fs.mkdirSync(destDir, { recursive: true })
  console.log(`Building ${file}`)
  execFileSync(cli, ['-D', destDir, srcFile], { stdio: 'inherit' })
}
