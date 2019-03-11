#!/usr/bin/env node

'use strict';
const yargs = require('yargs')
const gulp = require('gulp')
const path = require('path')
const {updateConfig, clean, compileAll, watchAll} = require('..')

const argv = yargs
  .usage('Usage: $0 <command> [options...]')
  .pkgConf("mina")
  .command('clean', 'clean output directory',
    yargs => yargs.options({
      'dest': {
        demandOption: true,
        describe: 'The directory will be clean'
      }
    }),
    argv => {
      gulp.series(updateConfig({
        dstDir: argv.dest
      }), clean)()
    })
  .command(['build', '$0'], 'compile source directory and output',
    yargs => yargs.options({
      'src': {
        type: 'string',
        demandOption: true,
        describe: 'source directory'
      },
      'dest': {
        type: 'string',
        default: './dist',
        describe: 'output directory'
      },
      'include': {
        type: 'array',
        default: ['**/*'],
        describe: 'these files should be included (glob pattern)'
      },
      'exclude': {
        type: 'array',
        default: [],
        describe: 'these files should be excluded (glob pattern)'
      },
      'target': {
        type: 'string',
        choices: ['wx', 'my'],
        describe: 'target platform, support: "wx"(weixin), "my"(alipay)',
        default: 'wx'
      },
      'watch': {
        alias: 'w',
        type: 'boolean',
        describe: 're-compile when any file in the src directory changed'
      }
    }),
    argv => {
      const config = {
        srcDir: path.resolve(process.cwd(), argv.src),
        dstDir: path.resolve(process.cwd(), argv.dest),
        include: argv.include,
        exclude: argv.exclude,
        target: argv.target
      }

      // mina --src ./example/src --dest ./example/dist --include '**/*' '*.a' --exclude '**/*.md' --target my
      console.log('config:', config)
      const tasks = [updateConfig(config), clean, compileAll]
      if (argv.watch) {
        tasks.push(watchAll)
      }
      gulp.series(tasks)()
    })
  .demandCommand()
  .version()
  .alias('v', 'version')
  .help()
  .alias('h', 'help')
  .showHelpOnFail(true)
  .argv


gulp.on('error', err => {
  console.error(err)
})
