# Selector

一款自我实现的简易 selector 插件

![node](https://img.shields.io/badge/node-%3E%3D8.9.1-green.svg)

## 安装

```shell
$ npm i
```

或

```shell
$ yarn add
```

## 开发

```shell
$ npm start
```

或

```shell
$ yarn start
```

## 编译

```shell
$ npm run build
```

或

```shell
$ yarn build
```

## 测试

```shell
npm run test
```

或

```shell
yarn test
```

## 使用

编译后的 `dist` 文件夹中包含所有的代码和样式，直接在 `html` 文件中引用后即可使用

开发时运行命令后直接用浏览器打开根目录下的 `index.html`即可

可接受原生 select 或 input 组件作为 `element`

### 基本用法

```javascript
$('elementSelector').selector();
```

### 自定义数据源

```javascript
$('elementSelector').selector({
  data: [{
    value: 'apple',
    title: 'Apple',
    disables: true
  }, {
    value: 'pear',
    title: 'Pear'
  }]
})
```

### 异步加载数据源

```javascript
let $selector = $('elementSelector').selector();

$ajax.get('url').then((data) => {
  $selector.setOriginalData(data)
})
```
