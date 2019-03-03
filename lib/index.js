const {parse} = require('@vue/component-compiler-utils')
const compiler = require('vue-template-compiler')
const path = require('path')
const f = require('fs')

// const source = `<div><p>{{ render }}</p></div>`
const source = f.readFileSync(path.resolve(__dirname, '../test/example.mina'), {encoding: 'utf-8'})

const result = parse({
  filename: 'example.vue',
  source,
  compiler: compiler
})
console.log(JSON.stringify(result, null, 4))