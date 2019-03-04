var through = require('through2');
var gutil = require('gulp-util');
const {parse} = require('@vue/component-compiler-utils')
const compiler = require('vue-template-compiler')
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-mina'

function createFile (file, content, options = {}) {
  const _file = file.clone({content: false})
  _file.contents = Buffer.from(content)
  _file.basename = file.stem + '.' + options.extname
  return _file
}

module.exports = function gulpMina(options = {}) {
  const extnameMap = {
    'template': 'html',
    'script': 'js',
    'style': 'css',
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
        compiler: compiler
      })
      const templateFile = createFile(file, result.template.content, {extname: extnameMap.template})
      const scriptFile = createFile(file, result.script.content, {extname: extnameMap.script})
      const styleFile = createFile(file, result.styles.reduce((s, c) => s + c.content, ''), {extname: extnameMap.style})

      // 确保文件进入下一个 gulp 插件
      this.push(templateFile);
      this.push(scriptFile)
      this.push(styleFile)
    }


    // 告诉 stream 引擎，我们已经处理完了这个文件
    cb();
  });

  // 返回文件 stream
  return stream; 
}