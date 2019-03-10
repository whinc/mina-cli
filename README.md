# mina-cli

mina-cli 是小程序原生开发脚手架。


使用单文件开发小程序页面，例如下面的 demo.mina 经过编译后
```html
<template>内容1</template>
<script>内容2</script>
<style>内容3</style>
<config>内容4</config>
```

输出下面 4 个文件：
```
// demo.wxml
内容1

// demo.js
内容2

// demo.wxss
内容3

// demo.json
内容4
```

## 特性

- [x] 支持单文件开发及热加载
- [ ] 支持预处理器，如 sass/less 等
- [ ] 支持 npm 管理依赖

预处理器支持情况

|syntax|lang|
|---|---|---|
|`<template>`|`html`|
|`<style>`|`css`|
|`<style lang="scss">`|`scss`|
|`<style lang="sass">`|`sass`|
|`<style lang="less">`|`less`|
|`<script>`|`js`|

## 使用

安装 mina
```
npm install -g mina
```

命令行参数配置
```bash
mina build --src <path_to_source> --dest <path_to_output>
```

或者通过`--config`指定配置文件
```
// mina.config.json
{
  "src": "example/src",
  "dest": "example/dist"
}

// 执行指令
mina --config mina.config.json
```

或者在`package.json`中通过`mina`字段指定配置
```
// package.json
{
  "mina": {
    "src": "example/src",
    "dest": "example/dist"
  }
}

// 执行指令
mina
```

## 配置语法高亮

**Virtual Studio Code**

1. 安装 Vetur 插件
2. 运行命令 "Preferences: Open Settings (JSON)"，添加下面配置
```json
  "files.associations": {
    "*.mina": "vue",
    // 微信小程序需要
    "*.wxs": "javascript",
    "*.wxss": "css",
    "*.wxml": "html",
    // 支付宝小程序需要
    "*.acss": "css",
    "*.axml": "html",
  },
```
3. 运行命令 "Vetur: Generate grammar from `vetur.grammar.customBlocks`"，添加下面配置
```json
  "vetur.grammar.customBlocks": {
    "config": "json"
  }
```
4. 运行命令 "Reload Window"

## 更新日志

[CHANGELOG](CHANGELOG.md)