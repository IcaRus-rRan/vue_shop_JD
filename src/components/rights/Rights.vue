<!--  -->
<template>
	<div>
    <!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" class="el-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
		<el-card>  

      <!-- 权限列表区域 -->
			<el-table :data="rightsList" stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
					<template v-slot="scope">
						<el-tag type="success" v-if="scope.row.level == 1">二级</el-tag>
						<el-tag v-else-if="scope.row.level == 0">一级</el-tag>
						<el-tag type="warning" v-else>三级</el-tag>
					</template>
				</el-table-column>
      </el-table>
		</el-card>
	</div>
</template>

<script>
import { request } from "network/request.js";

export default {
	data () {
		return {
			rightsList: [],
		}
	},
	created() {
		this.getRightsList() ;
	},
	methods: {
		getRightsList() {
			request({
				url: `rights/list`,
				method: 'get'
			}).then(res => {
				console.log(res);
				this.rightsList = res.data.data;
				console.log(this.rightsList);
			}).catch(err => {
				console.log(err);
			})
		}
	}
}
</script>

<style  scoped>

</style>
