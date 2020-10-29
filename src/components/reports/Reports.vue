<!--  -->
<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" class="el-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

		<!-- 卡片视图区 -->
		<el-card>
			<!-- 为ECharts准备一个具备大小（宽高）的 Dom -->
    	<div id="main" style="width: 800px;height:500px;"></div>
    	<div id="main2" style="width: 800px;height:500px;"></div>
		</el-card>
	</div>
</template>

<script>
import { request } from "network/request.js";
import echarts from 'echarts'
import _ from 'lodash'

export default {
	data () {
		return {
			report: {},
			option: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
		}
	},
	created() {
		
	},
	mounted() {
		var myChart = echarts.init(document.getElementById('main'));
		var myChart2 = echarts.init(document.getElementById('main2'));
		request({
			url: 'reports/type/1'
		}).then(res => {
			// console.log(res);
			// Object.assign 传入第一个参数为空对象时 原对象不变
			// 用来解决 this.option 合并后对象值被修改问题
			const result1 = Object.assign({}, this.option, res.data.data)
			console.log(result1);
			myChart.setOption(result1)

			const result2 = _.merge(res.data.data, this.option)
			console.log(result2);
			myChart2.setOption(result2)
		}).catch(err => {
			console.log(err);
		})
	}
}
</script>

<style  scoped>

</style>
