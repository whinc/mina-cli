

const {parse} = require('@vue/component-compiler-utils')
const compiler = require('vue-template-compiler')
const path = require('path')
const gulp = require('gulp')
const gulpMina = require('./gulp-mina.js')
const del = require('del')

const extnameMap = {
  'template': 'wxml',
  'style': 'wxss'
}

const rootDir = path.resolve(__dirname, '..')

del.sync(path.resolve(__dirname, '../example/dist'))

function compile () {
  return gulp.src('example/src/**/*.mina', {
      cwd: rootDir,
      since: gulp.lastRun(compile)
    })
    .pipe(gulpMina({extnameMap}))
    .pipe(gulp.dest('example/dist', {cwd: rootDir}))
}

gulp.watch('example/src/**/*.mina', {
  cwd: rootDir,
  ignoreInitial: false
}, compile)

module.exports = () => {
  console.log('watch beging')
}
