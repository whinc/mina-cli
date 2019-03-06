const gulp = require('gulp')
const {clean, compileAll, watchAll, test} = require('./gulpfile')

gulp.series(clean, compileAll, watchAll)()