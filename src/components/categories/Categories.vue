<!--  -->
<template>
	<div>
			<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" class="el-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
		<el-card>
			<el-row>
				<el-col>
            <el-button type="primary" @click="addCateDialogVisible = true">添加分类</el-button>
				</el-col>
			</el-row>

		<!-- 表格区域 -->
			<!-- <el-table :data="categoriesList" stripe style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column 
					prop="cat_name" 
					label="分类名称" 
					row-key="cat_id"
					:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
					</el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" > 
					<template v-slot="scope">
						<div v-if="scope.row.cat_deleted">
							<i icon="el-icon-circle-check">1</i>
						</div>
						<div v-else>
							<i icon="el-icon-circle-close">2</i>
						</div>
					</template>
				</el-table-column>
        <el-table-column prop="cat_level" label="排序">
					<template v-slot="scope">
						<el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
						<el-tag type="success" v-else-if="scope.row.cat_level.cat_level == 1">二级</el-tag>
						<el-tag type="warning" v-else>三级</el-tag>
					</template>
				</el-table-column>
        <el-table-column prop="" label="操作" >
          <template v-slot="scope">
            <el-button 
							type="primary" 
							icon="el-icon-edit" 
							circle 
							@click="editDialogChanged(scope.row.id)"></el-button>
            <el-button 
							type="danger" 
							icon="el-icon-delete" 
							circle 
							@click="removeUser(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table> -->
			<tree-table 
				class="treeTable"
				:data="categoriesList"
				:columns="columns"
				:show-index="props.showIndex"
				index-text="#"
				:border="props.border"
				:tree-type="props.treeType"
				:is-fold="props.isFold"
				:selection-type="props.selectionType"
				:expand-type="props.expandType">
				<template v-slot:isok="scope">
					<i class="el-icon-check" v-if="!scope.row.cat_deleted"></i>
					<i class="el-icon-close" v-else></i>
				</template>
				<template v-slot:sort="scope">
					<el-tag v-if="scope.row.cat_level == 0" size="medium">一级</el-tag>
					<el-tag type="success" v-else-if="scope.row.cat_level == 1" size="medium">二级</el-tag>
					<el-tag type="warning" v-else size="medium">三级</el-tag>
				</template>
				<template v-slot:operation >
					<el-button 
						type="primary" 
						icon="el-icon-edit"
						size="mini"
						@click="showSetRolesDialog(scope.row)">编辑</el-button>
					<el-button 
						type="danger" 
						icon="el-icon-delete" 
						size="mini"
						@click="removeUser(scope.row.id)">删除</el-button>
				</template>
			</tree-table>

			<!-- 分页区域 -->
			<el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="queryCateInfo.params.pagenum"
        :page-size="queryCateInfo.params.pagesize"
        :page-sizes="[3, 5, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
		</el-card>

		<!-- 添加分类弹出的对话框 -->
    <el-dialog 
			title="添加分类" 
			:visible.sync="addCateDialogVisible" 
			width="480px"
			@close="addDialogClosed">
			<!-- 主体区域 -->
      <el-form 
				:model="addCateForm" 
				:rules="addCateFormRules"
				:label-width="formLabelWidth" 
				ref="addCateFormRef">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
				<el-form-item label="父级分类：">
          <el-input v-model="addCateForm.cat_pid" autocomplete="off" placeholder="请选择"></el-input>
        </el-form-item>
      </el-form>
			<!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import { request } from "network/request.js";

export default {
	data () {
		return {
			// 查询商品分类列表的参数
			queryCateInfo: {
				url: 'categories',
				params: {
					type: 3,
					pagenum: 1,
					pagesize: 5,
				}
			},
			// 添加分类的显示隐藏属性
			addCateDialogVisible: false,
			// 分类表单的数据
			addCateForm: {
				cat_pid: 0,
				cat_name: '',
				cat_level: 0
			},
			// 商品分类列表
			categoriesList: [],
			total: 0,
			formLabelWidth: '100px',
			// 表格属性
			props: {
        stripe: false,
        border: false,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: true,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: false,
			},
			columns: [{
				label: '分类名称',
				prop: 'cat_name',
			},{
				label: '是否有效',
				prop: 'cat_deleted',
				type: 'template',
				template: 'isok'
			},{
				label: '排序',
				prop: 'cat_level',
				type: 'template',
				template: 'sort'
			},{
				label: '操作',
				prop: 'cat_level',
				type: 'template',
				template: 'operation'
			}],
			addCateFormRules: {
				cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3~10个字符", trigger: "blur" },
				]
			},
		}
	},
	created() {
		this.getCategoriesList();
	},
	methods: {
		// 
		addDialogClosed() {

		},
		// 获取商品分类列表 并渲染
		getCategoriesList() {
			request(this.queryCateInfo).then(res => {
				console.log(res.data.data.result);
				this.categoriesList = res.data.data.result;
				this.total = res.data.data.total;
			}).catch(err => {
				console.log(err);
			})
		},
		// 点击页数翻页
		handleCurrentChange(newPage) {
			this.queryCateInfo.params.pagenum = newPage;
      this.getCategoriesList();
		},
		// 设置每页显示条数
		handleSizeChange(newSize) {
			this.queryCateInfo.params.pagesize = newSize;
      this.getCategoriesList();
		},
		addCate() {

		}
	}
}
</script>

<style  scoped>
.treeTable {
	margin-top: 15px;
}
</style>
