const postcsspxtoviewport = require('./plugins/postcss-px-to-viewport/index.js')
const {resolve} = require('path')
module.exports = ()=> {
  return {
    plugins: [
      postcsspxtoviewport({
        unitToConvert: 'px', //  需要转换的单位，默认为"px"
        viewportWidth: 750, // 设计稿的视口宽度
        unitPrecision: 5, // 单位转换后保留的精度
        propList: ['*'], // 能转化为vw的属性列表
        viewportUnit: 'vw', // 希望使用的视口单位
        fontViewportUnit: 'vw', //字体使用的视口单位
        minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
        mediaQuery: false, //媒体查询里的单位是否需要转换单位
        replace: true, // 是否直接更换属性值，而不添加备用属性
        // exclude: /(\/|\\)(node_modules)(\/|\\)/, // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件, 如果传入的值是一个数组，那么数组里的值必须为正则
        customFn: ({file})=> {
          const viewportWidth = resolve(file).includes(resolve('node_modules', 'vant')) ? 375 : 750
          return viewportWidth
        }
      })
    ]
  }
}
