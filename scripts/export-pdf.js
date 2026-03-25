const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const dist = path.resolve(__dirname, '..', 'dist')
const decktape = path.resolve(__dirname, '..', 'node_modules', '.bin', 'decktape')

const arg = process.argv[2]

if (arg) {
  const htmlPath = path.resolve(arg)
  const pdfPath = htmlPath.replace('.html', '.pdf')
  console.log(`Exporting ${arg} → ${arg.replace('.html', '.pdf')}`)
  execFileSync(decktape, ['reveal', htmlPath, pdfPath], { stdio: 'inherit' })
} else {
  const files = findHtmlFiles(dist, '')

  if (files.length === 0) {
    console.error('No HTML files found in dist/. Run "npm run build" first.')
    process.exit(1)
  }

  for (const file of files) {
    const htmlPath = path.join(dist, file)
    const pdfPath = path.join(dist, file.replace('.html', '.pdf'))
    console.log(`Exporting ${file} → ${file.replace('.html', '.pdf')}`)
    execFileSync(decktape, ['reveal', htmlPath, pdfPath], { stdio: 'inherit' })
  }
}

function findHtmlFiles (dir, relDir) {
  const skip = ['javascripts', 'stylesheets', 'images', 'common']
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(relDir, entry.name)
    if (entry.isDirectory() && !skip.includes(entry.name)) {
      files.push(...findHtmlFiles(path.join(dir, entry.name), rel))
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(rel)
    }
  }
  return files
}