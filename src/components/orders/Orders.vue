<!--  -->
<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" class="el-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
			<el-row>
				<el-input 
					class="queryInput"
					v-model="queryInput" 
					placeholder="请输入内容"
					prefix-icon="el-icon-search"
					width="300">
					<el-button slot="append" icon="el-icon-search"></el-button>
				</el-input>
			</el-row>

			<!-- 订单列表区域 -->
			<el-table :data="ordersList" stripe style="width: 100%">
				<!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column width="220px" prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="is_send" label="是否付款" width="150px">
					<template v-slot='scope'>
						<el-tag type="success" v-if="!scope.row.is_send">已付款
						</el-tag>
						<el-tag type="danger" v-else>未付款
						</el-tag>
					</template>
				</el-table-column>
        <el-table-column prop="order_pay" label="是否发货">
					<template v-slot='scope'>
						<el-tag type="success" v-if="!scope.row.order_pay">是
						</el-tag>
						<el-tag type="danger" v-else>否
						</el-tag>
					</template>
				</el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180px"></el-table-column>
        <el-table-column prop="" label="操作" width="180px">
					<template v-slot="scope">
						<el-button 
							type="primary" 
							icon="el-icon-edit" 
							circle 
							@click="editOrderDialogChanged(scope.row.id)"></el-button>
            <el-button 
							type="danger" 
							icon="el-icon-location" 
							circle 
							@click="location(scope.row.id)"></el-button>
          </template>
				</el-table-column>
      </el-table>

			<!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.params.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
		</el-card>

		<!-- 编辑地址弹出的对话框 -->
    <el-dialog 
			title="修改信息" 
			:visible.sync="editDialogVisible" 
			width="480px"
			@close="editDialogclosed">
			<!-- 主体区域 -->
      <el-form 
				:model="addressForm"
				:rules="addressFormRules"
				label-width="100px"
				ref="editFormRef">
        <el-form-item label="省市区/县" prop="address2">
          <el-cascader :options="cityData" style="width: 100%" autocomplete="off" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input  autocomplete="off" v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
			<!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogclosed">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import { request } from "network/request.js";
import cityData from "./citydata.js"

export default {
	data () {
		return {
			addressForm:{
				address1: [],
				address2: '',
			},
			addressFormRules:{
				address1: [{ required: true, message: "请输入省市区/县", trigger: "blur" }],
				address2: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
			},
			// 查询订单输入框内容
			queryInput: '',
			// 订单列表
			ordersList: [],
			total: 0,
			// 获取订单列表的参数
      queryInfo: {
        url: "orders",
        params: {
          query: "",
          pagenum: 1,
          pagesize: 5,
        },
			},
			editDialogVisible: false,
			cityData
		}
	},
	created() {
		this.getOrdersList();
	},
	methods: {
		getOrdersList() {
			request(this.queryInfo).then(res => {
				console.log(res);
				this.ordersList = res.data.data.goods
				this.total = res.data.data.total
			}).catch(err => {
				console.log(err);
			})
		},
		editDialogclosed() {
			this.editDialogVisible = false;
			this.$refs.editFormRef.resetFields()
		},
		editOrderDialogChanged(i) {
			console.log(i);
			this.editDialogVisible = true
		},
		location(i) {
			console.log(i);
		},
		// 每页显示条数
		handleSizeChange(newSize) {
      this.queryInfo.params.pagesize = newSize;
      this.getOrdersList();
		},
		// 翻页功能
    handleCurrentChange(newPage) {
      this.queryInfo.params.pagenum = newPage;
      this.getOrdersList();
		},
	}
}
</script>

<style  scoped>
.queryInput {
  width: 500px;
}

</style>
