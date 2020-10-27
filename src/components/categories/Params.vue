<!--  -->
<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" class="el-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

		<!-- 卡片视图区 -->
		<el-card>
			<el-row>
				<!-- 警告区域 -->
        <el-alert
					title="注意：只允许为第三级分类设置相关参数"
					type="warning"
					:closable="false"
					show-icon></el-alert>
				</el-row>
				<!-- 选择商品分类区域 -->
				<el-row class="cat_opt"> 
					<el-col>
						<span>选择商品分类：</span>
						<el-cascader
							v-model="selectedCateKeys"
							:options="cateList"
							:props="cateProps"
							@change="handleChange"></el-cascader>
					</el-col>
				</el-row>

				<!-- 参数列表区域 -->
				<el-tabs v-model="activeName" @tab-click="handleClick">

					<!-- 动态参数表格 -->
					<el-tab-pane label="动态参数" name="many">
						<el-button 
							type="primary" 
							:disabled="selectedCateKeys.length !== 3"
							@click="addParamsDialogVisible = true">
							添加参数
						</el-button>
						<el-table :data="manyTableData" stripe>
							<!-- 展开行 -->
							<el-table-column type="expand" label="">
								<template v-slot="scope">
									<el-tag 
										v-for="(item, index) in scope.row.attr_vals" 
										:key="item.attr_id" 
										closable
										@close="handleClose(index, scope.row)">
										{{ item }}
									</el-tag>
									<el-input
										class="input-new-tag"
										v-if="scope.row.inputVisible"
										v-model="scope.row.inputValue"
										ref="saveTagInput"
										size="small"
										@keyup.enter.native="handleInputConfirm(scope.row)"
										@blur="handleInputConfirm(scope.row)">
									</el-input>
									<el-button 
										v-else 
										class="button-new-tag" 
										size="small" 
										@click="showInput(scope.row)">+ New Tag</el-button>
								</template>
							</el-table-column>
							<!-- 索引列 -->
							<el-table-column type="index" label='#'></el-table-column>
							<el-table-column label="参数名称" prop="attr_name"></el-table-column>
							<el-table-column label="操作">
								<template v-slot="scope">
									<el-button 
										type="primary" 
										icon="el-icon-edit" 
										circle 
										@click="editDialogChanged(scope.row)"></el-button>
									<el-button 
										type="danger" 
										icon="el-icon-delete" 
										circle 
										@click="removeParams(scope.row.attr_id)"></el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>

					<!-- 静态属性表格 -->
					<el-tab-pane label="静态属性" name="only">
						<el-button 
								type="primary" 
								:disabled="selectedCateKeys.length !== 3"
								@click="addParamsDialogVisible = true">
							添加属性
						</el-button>
						<!-- 静态属性表格 -->
						<el-table :data="onlyTableData" stripe>
							<!-- 展开行 -->
							<el-table-column type="expand" label="">
								<template v-slot="scope">
									<el-tag 
										v-for="(item, index) in scope.row.attr_vals" 
										:key="item.attr_id" 
										closable
										@close="handleClose(index, scope.row)">
										{{ item }}
									</el-tag>
									<el-input
										class="input-new-tag"
										v-if="scope.row.inputVisible"
										v-model="scope.row.inputValue"
										ref="saveTagInput"
										size="small"
										@keyup.enter.native="handleInputConfirm(scope.row)"
										@blur="handleInputConfirm(scope.row)">
									</el-input>
									<el-button 
										v-else 
										class="button-new-tag" 
										size="small" 
										@click="showInput(scope.row)">+ New Tag</el-button>
								</template>
							</el-table-column>
							<!-- 索引列 -->
							<el-table-column type="index" label='#'></el-table-column>
							<el-table-column label="属性名称" prop="attr_name"></el-table-column>
							<el-table-column label="操作">
								<template v-slot="scope">
									<el-button 
										type="primary" 
										icon="el-icon-edit" 
										circle 
										@click="editDialogChanged(scope.row)"></el-button>
									<el-button 
										type="danger" 
										icon="el-icon-delete" 
										circle 
										@click="removeParams(scope.row.attr_id)"></el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
		</el-card>

		<!-- 添加参数对话框 -->
		<el-dialog
			:title="'添加' + titleText"
			:visible.sync="addParamsDialogVisible"
			width="480px"
			@closed="addDialogClosed">
			<!-- 添加参数的表单 -->
			<el-form 
				:model="addForm" 
				:rules="addFormRules" 
				ref="addFormRef" 
				label-width="100px" >
				<el-form-item :label="titleText" prop="attr_name">
					<el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addParamsDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addParams">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 编辑参数对话框 -->
		<el-dialog
			title="修改"
			:visible.sync="editDialogVisible"
			width="480px"
			@closed="editDialogClosed">
			<!-- 编辑参数的表单 -->
			<el-form 
				:model="editForm" 
				:rules="addFormRules" 
				ref="editFormRef" 	
				label-width="100px" >
				<el-form-item :label="titleText" prop="attr_name">
					<el-input v-model="editForm.attr_name" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editParams">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { request } from "network/request.js";

export default {
	data () {
		return {
			queryCateInfo: {
				url: 'categories',
				// params: {
				// 	type: 3,
				// 	pagenum: 1,
				// 	pagesize: 5,
				// }
			},
			total: 0,
			// 获取的商品列表
			cateList: [],
			// 级联选择框的配置对象
			cateProps: {
				value: 'cat_id',
				label: 'cat_name',
				children: 'children',
				expandTrigger: 'hover'
			},
			// 级联选择框 双向绑定的 数组
			selectedCateKeys: [],
			activeName: 'many',
			// 动态参数列表
			manyTableData: [],
			// 静态参数列表
			onlyTableData: [],
			// 添加参数对话框 显示隐藏
			addParamsDialogVisible: false,
			// 添加动态参数的表单 对象
			addForm: {},
			// 编辑参数的表单 对象
			editForm: {
				attr_name: '',
			},
			addFormRules: {
				attr_name: [
					{ required: true, message: "请输入参数名称", trigger: "blur" },
				]
			},
			// 控制 编辑对话框 的显示隐藏
			editDialogVisible: false,
			
		}
	},
	created() {
		this.getCateList()
	},
	computed: {
		// 当前选中的3级分类的ID
		cateId() {
			if(this.selectedCateKeys.length !== 3) {
				return null
			}
			return this.selectedCateKeys[this.selectedCateKeys.length - 1];
		},
		// 动态计算标题
		titleText() {
			if(this.activeName == 'many') {
				return '动态参数'
			}
			return '静态属性'
		}
	},
	methods: {
		addDialogClosed() {
			this.$refs.addFormRef.resetFields();
		},
		editDialogClosed() {
			this.$refs.editFormRef.resetFields();
		},
		// 修改参数对话框
		editDialogChanged(params) {
			// this.handleChange();
			this.getParamsData();
			this.editForm = params;
			this.editDialogVisible = true;
		},
		// 获取商品列表
		getCateList() {
			request(this.queryCateInfo).then(res => {
				// console.log(res);
				this.cateList = res.data.data;
			}).catch(err => {
				console.log(err);
			})
		},
		// 级联选择框变化 触发的函数
		handleChange() {
			console.log(this.cateId);
			this.getParamsData();
		},
		// 点击动态参数或静态属性 
		handleClick(tab, event) {
			// console.log(tab, event);
			console.log(this.activeName);
			this.getParamsData();
		},
		// 获取参数的列表数据
		getParamsData() {
			if (this.selectedCateKeys.length !== 3) {
				this.selectedCateKeys = [];
				this.manyTableData = [];
				this.onlyTableData = []
				return
			}
			
			request({
				url: `categories/${this.cateId}/attributes`,
				params: {
					sel: this.activeName
				}
			}).then(res => {
				console.log(res.data.data);
				res.data.data.forEach(item => {
					item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
					// 控制 New Tag 的文本框的显示隐藏
					item.inputVisible = false;
					// 控制 New Tag 的文本框的内容
					item.inputValue = '';
				})
				if(this.activeName == 'many') {
					this.manyTableData = res.data.data
					// JSON.stringify(JSON.parse(this.manyTableData))
				} else {
					this.onlyTableData = res.data.data
					// JSON.stringify(JSON.parse(this.onlyTableData))
				}
			}).catch(err => {
				console.log(err);
			})
		},
		// 添加参数
		addParams() {
			this.$refs.addFormRef.validate().then(res => {
				request({
					method: 'post',
					url: `categories/${this.cateId}/attributes`,
					data: {
						attr_name: this.addForm.attr_name,
						attr_sel: this.activeName
					}
				}).then(res => {
					console.log(res);
					if (res.data.meta.status == 201) {
						this.$message.success(res.data.meta.msg);
						this.addParamsDialogVisible = false;
						this.getParamsData();
					} else {
						this.$message.error(res.data.meta.msg);
					}
				}).catch(err => {
					console.log(err);
				})
			})
		},
		// 修改参数
		editParams() {
			console.log(this.editForm);
			this.$refs.editFormRef.validate().then(res => {
				request({
					url: `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
					method: 'put',
					data: {
						attr_name: this.editForm.attr_name,
						attr_sel: this.editForm.attr_sel,
						attr_vals: this.editForm.attr_vals
					}
				}).then(res => {
					console.log(res);
					if (res.data.meta.status == 200) {
						this.$message.success(res.data.meta.msg);
						this.editDialogVisible = false;
						this.getParamsData();
					} else {
						this.$message.error(res.data.meta.msg);
					}
				}).catch(err => {
					console.log(err);
				})
			}).catch(err => {
				console.log(err);
			})
		},
		// 删除参数
		removeParams(id) {
			// console.log(id);
			// console.log(this.cateId);
			this.$confirm('确认要删除此参数吗？', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
				}).then(res => {
					request({
						url: `categories/${this.cateId}/attributes/${id}`,
						method: 'delete',
					}).then(res => {
						if( res.data.meta.status !== 200) {
							return this.$message.error(res.data.meta.msg);
						}
							this.$message.success(res.data.meta.msg);
							this.getParamsData();
					}).catch(err => {
						console.log(err);
						this.$message.error(res.data.meta.msg);
					})
				}).catch(err => {
					console.log(err);
				})
		},
		// 添加tag操作
		handleInputConfirm(row) {
			console.log(row);
      if (!row.inputValue.trim()) {
				row.inputVisible = false;
				row.inputValue = '';
				return
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputVisible = false;
			row.inputValue = '';

			this.saveAttrVals(row)
		},
		// 保存attr_vals 到数据库中
		saveAttrVals(row) {
			request({
				url: `categories/${this.cateId}/attributes/${row.attr_id}`,
				method: 'put',
				data: {
					attr_name: row.attr_name,
					attr_sel: row.attr_sel,
					attr_vals: row.attr_vals.join(' ')
				}
			}).then(res => {
				console.log(res);
				if (res.data.meta.status == 200) {
					this.$message.success(res.data.meta.msg);
					this.editDialogVisible = false;
				}	else {
					this.$message.error(res.data.meta.msg);
				}
			}).catch(err => {
				console.log(err);
			})
		},
		// 点击 + New Tag 显示输入框
		showInput(row) {
			row.inputVisible = true;
			// $nextTick 就是当页面上元素被重新渲染之后
			// 才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
		},
  	// 删除tag 操作
		handleClose(index, row) {
			console.log(index);
			console.log(row);
			row.attr_vals.splice(index, 1);
			this.saveAttrVals(row);
		}
	}
}
</script>

<style  scoped>
.cat_opt {
	margin: 15px 0;
}
.el-tag {
	margin-left: 10px;
	margin-bottom: 10px;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
  /* vertical-align: bottom; */
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 28px; 
  padding-top: 0;
  padding-bottom: 0;
}
</style>
