var through = require('through2');
var gutil = require('gulp-util');
const {parse} = require('@vue/component-compiler-utils')
const compiler = require('vue-template-compiler')
const sass = require('node-sass');
const less = require('less')
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-mina'

function createFile (file, content, options = {}) {
  const _file = file.clone({content: false})
  _file.contents = Buffer.from(content)
  _file.basename = file.stem + options.extname
  return _file
}

module.exports = function gulpMina(options = {}) {
  const extnameMap = {
    'template': '.html',
    'script': '.js',
    'style': '.css',
    'config': '.json',
    ...(options.extnameMap || {})
  }

  // 创建一个 stream 通道，以让每个文件通过
  var stream = through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (file.isBuffer()) {
      // file.contents = Buffer.concat(file.contents]);
      const result = parse({
        filename: file.basename,
        source: file.contents.toString(),
        compiler: compiler,
        needMap: false
      })
      if (result.template) {
        const templateFile = createFile(file, result.template.content, {extname: extnameMap.template})
        this.push(templateFile);
      }
      const scriptFile = createFile(file, result.script.content, {extname: extnameMap.script})
      this.push(scriptFile)

      const configBlock = result.customBlocks.find(block => block.type === 'config')
      if (configBlock) {
        const configFile = createFile(file, configBlock.content, {extname: extnameMap.config})
        this.push(configFile)
      }

      const resultPromises = result.styles.map(style => {
        const input = style.content
        const lang = style.attrs.lang

        if (lang === 'sass' || lang === 'scss') {
          return new Promise ((resolve, reject) => {
            sass.render({ data: input }, (err, result) => {
              if (err) reject(err)

              resolve({
                css: result.css.toString()
              })
            })
          }) 
          output = result.css.toString()
        } else if (lang === 'less') {
          return less.render(input).then(result => ({
            css: result.css
          }))
        } else {
          return Promise.resolve({
            css: input
          })
        }
      })

      Promise.all(resultPromises).then(results => {
        const styleContent = results.reduce((content, cur) => content + cur.css, '')
        const styleFile = createFile(file, styleContent, {extname: extnameMap.style})
        this.push(styleFile)

        // 告诉 stream 引擎，我们已经处理完了这个文件
        cb()
      })
    }
  });

  // 返回文件 stream
  return stream; 
}