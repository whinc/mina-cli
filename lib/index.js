const gulp = require('gulp')
const {clean, compileAll, watchAll} = require('./gulpfile')

gulp.series(clean, compileAll, watchAll)()