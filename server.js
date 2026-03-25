// Load Asciidoctor.js and the reveal.js converter
const asciidoctor = require('@asciidoctor/core')()
const asciidoctorRevealjs = require('@asciidoctor/reveal.js')
asciidoctorRevealjs.register()

const { execFileSync } = require('child_process')
const browserSync = require('browser-sync')
const bs = browserSync.create()

let adocFile = process.argv[2]

if (!adocFile) {
  adocFile = 'index.adoc'
}

if (!adocFile.endsWith('.adoc')) {
  console.error(
    'You must specify an asciidoctor file to be previewed! Example:\n',
    'node server.js README.adoc'
  )
  return
}

// Copy assets to dist/
execFileSync('node', ['scripts/copy-assets.js'], { stdio: 'inherit' })

convertFile(adocFile)

/**
 * Convert the document 'presentation.adoc'
 *   using the reveal.js converter
 * @param {string} file
 */
function convertFile (file) {
  console.log(`Convert file: '${file}'`)
  asciidoctor.convertFile(file, { safe: 'unsafe', backend: 'revealjs', to_dir: 'dist' })
}

/**
 * I'm watching you. 👀
 * @param {string} filename
 */
function watchCallback (filename) {
  // skip hidden files
  if (filename.startsWith('.')) {
    return
  }

  console.log(`File '${filename}' was changed`)
  convertFile(adocFile)
  if (adocFile !== filename && filename.endsWith('.adoc')) {
    convertFile(filename)
  }
  bs.reload()
}

bs.watch(
  '.',
  {
    ignored: ['**.html'],
    ignoreInitial: true,
  }
).on('change', watchCallback)

bs.init({
  server: 'dist',
  startPath: adocFile.replace('.adoc', '.html')
})
