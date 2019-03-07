const gulp = require('gulp')
const path = require('path')
const {updateConfig, clean, compileAll, watchAll, test} = require('./gulpfile')

const config = updateConfig({
  srcDir: path.join(__dirname, '../example/src'),
  dstDir: path.join(__dirname, '../example/dist'),
  include: ['**/*'],
  exclude: ['**/*.md'],
  target: 'wx'
})

gulp.on('error', err => {
  console.error(err)
})

gulp.series(config, clean, compileAll)()