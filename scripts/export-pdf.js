const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const dist = path.resolve(__dirname, '..', 'dist')
const decktape = path.resolve(__dirname, '..', 'node_modules', '.bin', 'decktape')

const arg = process.argv[2]

if (arg) {
  const resolved = path.resolve(arg)
  const stat = fs.statSync(resolved)

  if (stat.isDirectory()) {
    // Export all HTML files in the given directory
    const files = findHtmlFiles(resolved, '')
    if (files.length === 0) {
      console.error(`No HTML files found in ${arg}.`)
      process.exit(1)
    }
    for (const file of files) {
      exportPdf(path.join(resolved, file))
    }
  } else {
    // Export a single HTML file
    exportPdf(resolved)
  }
} else {
  // Export all HTML files in dist/
  const files = findHtmlFiles(dist, '')

  if (files.length === 0) {
    console.error('No HTML files found in dist/. Run "npm run build" first.')
    process.exit(1)
  }

  for (const file of files) {
    exportPdf(path.join(dist, file))
  }
}

function exportPdf (htmlPath) {
  const pdfPath = htmlPath.replace('.html', '.pdf')
  console.log(`Exporting ${path.relative(dist, htmlPath) || path.basename(htmlPath)} → ${path.basename(pdfPath)}`)
  execFileSync(decktape, ['reveal', htmlPath, pdfPath], { stdio: 'inherit' })
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
