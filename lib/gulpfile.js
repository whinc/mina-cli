const path = require('path')
const gulp = require('gulp')
const gulpIf = require('gulp-if')
const gulpMina = require('./gulp-mina.js')
const gulpDebug = require('gulp-debug')
const del = require('del')
const globby = require('globby');

const TargetType = Object.freeze({
  // 微信
  WX: 'wx',
  // 支付宝
  MY: 'my',
  // 自定义
  CUSTOM: 'custom'
})

const extnameMapObj = {
  [TargetType.WX]: {
    'script': '.js',
    'config': '.json',
    'template': '.wxml',
    'style': '.wxss'
  },
  [TargetType.MY]: {
    'script': '.js',
    'config': '.json',
    'template': '.axml',
    'style': '.acss'
  },
  [TargetType.CUSTOM]: {
    'script': '.js',
    'config': '.json',
    'template': '.html',
    'style': '.css'
  }
}

const EXTNAME = '.mina'

const _config = {
  srcDir: process.cwd(),
  dstDir: path.join(process.cwd(), 'dist'),
  // glob patter, relateive to 'srcDir'
  include: [`**/*${EXTNAME}`],
  // glob patter, relateive to 'srcDir'
  exclude: [],
  // 目标小程序类型
  target: 'wx',
  extnameMap: {
    'script': '.js',
    'config': '.json',
    'template': '.html',
    'style': '.css'
  }
}

const extnameMap = {
  'template': '.wxml',
  'style': '.wxss'
}

function updateConfig(config = {}) {
  _config.srcDir = config.srcDir || _config.srcDir
  _config.dstDir = config.dstDir || _config.dstDir
  _config.include = config.include || _config.include
  _config.exclude = config.exclude || _config.exclude
  _config.target = config.target || _config.target

  const extnameMap = extnameMapObj[_config.target]
  if (extnameMap) {
    _config.extnameMap = extnameMap
  } else {
    return () => Promise.reject(new Error('Invalid options: "target" is ' + config.target))
  }

  return () => Promise.resolve()
}

function clean () {
  console.log('clean:', _config.dstDir)
  return del(_config.dstDir)
}

function compileFile (filePath) {
  console.log('compileFile:', filePath)
  const isMinaFile = file => file.extname === EXTNAME
  return gulp.src(filePath, {base: _config.srcDir})
    .pipe(gulpIf(isMinaFile, gulpMina({extnameMap: _config.extnameMap})))
    .pipe(gulpDebug({title: 'mina-cli:'}))
    .pipe(gulp.dest(_config.dstDir))
}

function getSrcGlobPatterns () {
  const includePatterns = _config.include.map(part => path.join(_config.srcDir, part))
  const excludePatterns = _config.exclude.map(part => '!' + path.join(_config.srcDir, part))
  return [...includePatterns, ...excludePatterns]
}

function compileAll () {
  console.log('compileAll:', _config.srcDir)
  const patterns = getSrcGlobPatterns()
  return globby(patterns).then(paths => Promise.all(paths.map(path => compileFile(path))))
}

function watchAll () {
  const patterns = getSrcGlobPatterns()
  const watcher = gulp.watch(patterns, {
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

  console.log('watchAll:', _config.srcDir)
  return watcher
}

exports.updateConfig = updateConfig
exports.clean = clean
exports.compileAll = compileAll
exports.watchAll = watchAll

