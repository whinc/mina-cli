const path = require('path')
const gulp = require('gulp')
const gulpIf = require('gulp-if')
const gulpMina = require('./gulp-mina.js')
const gulpDebug = require('gulp-debug')
const del = require('del')
const globby = require('globby');

const srcDir = path.resolve(__dirname, '../example/src')
const dstDir = path.resolve(__dirname, '../example/dist')
const sfExtName = '.mina'

const rootDir = path.resolve(__dirname, '..')
const extnameMap = {
  'template': '.wxml',
  'style': '.wxss'
}

function clean () {
  console.log('clean:', dstDir)
  return del(dstDir)
}

function compileFile (filePath) {
  console.log('compileFile:', filePath)
  return gulp.src(filePath, {base: srcDir})
    .pipe(gulpMina({extnameMap}))
    .pipe(gulpDebug())
    .pipe(gulp.dest(dstDir))
}

function test () {
  gulp.src('./lib/*', {base: './lib'})
  .pipe(gulpDebug())
  .pipe(gulp.dest('./lib'))
}

function compileAll () {
  console.log('compileAll:', srcDir)
  return globby(srcDir).then(paths => Promise.all(paths.map(path => compileFile(path))))
}

function watchAll () {
  const watcher = gulp.watch(srcDir, {
    ignoreInitial: true
  })

  watcher.on('add', (filePath) => {
    console.log('add file:', filePath)
    compileFile(filePath)
  })
  watcher.on('change', (filePath) => {
    console.log('change file:', filePath)
    compileFile(filePath)
  })

  console.log('watchAll:', srcDir)
}

exports.clean = clean
exports.compileAll = compileAll
exports.watchAll = watchAll
exports.test = test

