const {parse} = require('@vue/component-compiler-utils')
const compiler = require('vue-template-compiler')
const path = require('path')
const f = require('fs')
const gulp = require('gulp')
const gulpMina = require('./gulp-mina.js')
const del = require('del')

del.sync(path.resolve(__dirname, '../out'))

const extnameMap = {
  'template': 'wxml',
  'style': 'wxss'
}
const srcFiles = path.resolve(__dirname, '../test/**/*.mina')
const dstFiles = path.resolve(__dirname, '../out')


gulp.src(srcFiles, {base: path.resolve(__dirname, '../test')})
  .pipe(gulpMina({extnameMap}))
  .pipe(gulp.dest(dstFiles))

const watcher = gulp.watch(srcFiles)
watcher.on('change', (_path, stats) => {
  console.log('file change: ', _path)
  // const relativePath = path.relative(path.resolve(__dirname, '../test'), _path)
  // console.log('relativePath:', relativePath)
  // const dstDir = path.resolve(__dirname, '../out', relativePath, '..')
  // console.log('dstDir', dstDir)
  gulp.src(_path, {base: path.resolve(__dirname, '../test')})
    .pipe(gulpMina({extnameMap}))
    .pipe(gulp.dest(dstFiles))
})
// const source = `<div><p>{{ render }}</p></div>`
// const source = f.readFileSync(path.resolve(__dirname, '../test/example.mina'), {encoding: 'utf-8'})

// const result = parse({
//   filename: 'example.vue',
//   source,
//   compiler: compiler
// })
// console.log(JSON.stringify(result, null, 4))