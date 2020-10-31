// 项目发布阶段用到的 babel-plugin
const prodPlugins = []
if(process.env.NODE_ENV === 'production') {
	// 'transform-remove-console' 移除所有console
	// 发布的时候将'transform-remove-console' push到 plgins数组中
	prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
	],
	'plugins': [
		...prodPlugins
	]
}
