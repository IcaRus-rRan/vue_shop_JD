<!--  -->
<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" class="el-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
		<el-card>
			<el-row>
				<el-col>
            <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
				</el-col>
			</el-row>

			<!-- 角色列表区域 -->
			<el-table :data="rolesList" stripe style="width: 100%">
				<!-- 展开列 -->
        <el-table-column type="expand" label="">
					<template v-slot="scope">
						<el-row 
							v-for="(item1, index1) in scope.row.children" 
							:key='item1.id'
							:class="['bdbottom', index1 == 0 ? 'bdtop' : '', 'vcenter']">
						<!-- 渲染一级权限 -->
							<el-col :span='5'>
								<el-tag class="el-tag" closable
									@close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
						<!-- 渲染二级和三级权限 -->
							<el-col :span='19'>
								<el-row 
									:class="[index2 == 0 ? '' : 'bdtop', 'vcenter']"
									v-for="(item2, index2) in item1.children" 
									:key='item2.id'>
									<el-col :span='6'>
										<el-tag type="success" closable
											@close="removeRightById(scope.row, item2.id)"
											>{{ item2.authName }}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>

									<el-col :span='18'>
										<el-tag
											:class="[index3 == 0 ? '' : 'bdtop']"
											closable
											@close="removeRightById(scope.row, item3.id)"
											v-for="(item3, index3) in item2.children" 
											type="warning"
											:key='item3.id'>
											{{ item3.authName }}
											</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="" label="操作" width="180px">
					<template v-slot="scope">
						<el-button 
							type="primary" 
							icon="el-icon-edit" 
							circle 
							@click="editRolesDialogChanged(scope.row.id)"></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top-start"
              :enterable="false">
              <el-button 
								type="warning" 
								icon="el-icon-setting" 
								circle
								@click="showSetRightDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-button 
							type="danger" 
							icon="el-icon-delete" 
							circle 
							@click="removeRoles(scope.row.id)"></el-button>
          </template>
				</el-table-column>
      </el-table>
		</el-card>

		<!-- 添加角色弹出的对话框 -->
    <el-dialog 
			title="添加角色" 
			:visible.sync="addRolesDialogVisible" 
			width="480px"
			@close="addRolesDialogClosed">
			<!-- 主体区域 -->
      <el-form 
				:model="addRolesForm" 
				:rules="addRolesFormRules" 
				:label-width="formLabelWidth" 
				ref="addRolesFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
			<!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

		<!-- 编辑角色弹出的对话框 -->
		<el-dialog 
			title="编辑角色" 
			:visible.sync="editRolesDialogVisible" 
			width="480px"
			@close="editRolesDialogClosed">
			<!-- 主体区域 -->
      <el-form 
				:model="editRolesForm" 
				:rules="addRolesFormRules" 
				:label-width="formLabelWidth" 
				ref="editRolesFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName" autocomplete="off" disabled></el-input>
        </el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
			<!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>

		<!-- 分配权限弹出的对话框 -->
		<el-dialog 
			title="分配权限" 
			:visible.sync="setRightDialogVisible" 
			width="480px"
			modal-append-to-body
			@close="setRightsDialogClosed">
			<!-- 主体区域 -->
      <el-tree
				:data="rightsList"
				:props="treeProps"
				node-key="id"
				:default-checked-keys="defKeys"
				show-checkbox 
				default-expand-all
				ref="treeRef">
			</el-tree>
			<!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import { request } from "network/request.js";

export default {
	data () {
		return {
			// 所有权限
			rightsList: [],
			treeProps: {
				children: 'children',
				label: 'authName'
			},
			// 点击分配权限时 保存对应角色的ID 
			roleId: '',
			// 默认选中的节点id值数组
			defKeys: [],
			// 所有角色的列表
			rolesList: [],
			// 添加角色的表单对象
			addRolesForm: {},
			// 编辑角色的表单对象
			editRolesForm: {},
			// 添加角色对话框的显示隐藏 
			addRolesDialogVisible: false,
			// 编辑角色对话框的显示隐藏 
			editRolesDialogVisible: false,
			// 分配权限对话框的显示隐藏 
			setRightDialogVisible: false,
			// 添加角色对话框表单验证
			addRolesFormRules: {
				roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2~10个字符", trigger: "blur" },
				],
				roleDesc: [
          { required: true, message: "请输入描述", trigger: "blur" },
          { min: 3, max: 15, message: "长度在3~15个字符", trigger: "blur" },
				]
			},
			formLabelWidth: '80px'
		}
	},
	created() {
		this.getRolesList();
	},
	methods: {
		// 点击确定分配权限
		allotRights() {
			const keys = [
				...this.$refs.treeRef.getCheckedKeys(),
				...this.$refs.treeRef.getHalfCheckedKeys()
			];
			const idStr = keys.join(',');
			console.log(this.roleId);
			request({
				url: `roles/${this.roleId}/rights`,
				method: 'post',
				data: {rids: idStr}
			}).then(res => {
				console.log(res);
				if( res.data.meta.status !== 200) {
					return this.$message.error(res.data.meta.msg);
				}
				this.$message.success(res.data.meta.msg);
				this.setRightDialogVisible = false;
				this.getRolesList();
			}).catch(err => {
				console.log(err);
			})
		},
		// 关闭分配权限 清空 defKeys
		setRightsDialogClosed() {
			this.defKeys = [];
		},
		// 点击分配权限 获取角色对应的所有 已拥有权限 
		showSetRightDialog(role) {
			this.roleId = role.id;
			request({
				url: 'rights/tree',
			}).then(res => {
				this.rightsList = res.data.data;
				// console.log(this.rightsList);
				console.log(role);
				role.children.forEach(item1 =>{
					item1.children.forEach(item2 => {
						item2.children.forEach(item3 => {
							this.defKeys.push(item3.id);
						})
					})
				})
				// console.log(this.defKeys);
			}).catch(err => {
				console.log(err);
			})
			this.setRightDialogVisible = true;
		},
	  // 点击 删除tags权限 事件
		removeRightById(role, rightsId) {
			this.$confirm('确认要删除此权限吗？', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
			}).then(res => {
				// console.log(role);
				// console.log(rightsId);
				request({
					method: 'delete',
					url: `roles/${role.id}/rights/${rightsId}`
				}).then(res => {
					// console.log(res.data.data);
					// console.log(role.children);
					role.children = res.data.data
				}).catch(err => {
					console.log(err);
				})
			}).catch(err => {
				this.$message.info('取消删除')
			})
		},
		// 点击 删除角色 事件
		removeRoles(id) {
			this.$confirm('确认要删除此用户吗？', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
				})
				.then(res => {
					request({
						method: 'delete',
						url: `roles/${id}`
					}).then(res => {
						console.log(res);
						if( res.data.meta.status !== 200) {
							return this.$message.error(res.data.meta.msg);
						}
							this.$message.success(res.data.meta.msg);
							this.getRolesList();
					}).catch(err => {
						console.log(err);
						this.$message.error(res.data.meta.msg);
					})
			}).catch(err => {
				this.$message.info('已取消删除操作')
			})
		},
		// 获取所有角色列表
		getRolesList() {
			request({
				method: 'get',
				url: `roles`
			}).then(res => {
				// console.log(res);
				this.rolesList = res.data.data;
			}).catch(err => {
				console.log(err);
			})
		},
		// 点击编辑角色确定按钮 提交到后台
		editRole() {
			this.$refs.editRolesFormRef.validate(valid => {
				// console.log(valid);
				if(!valid) return;
				request({
					method: 'put',
					url: `roles/${this.editRolesForm.roleId}`,
					data: this.editRolesForm
				}).then(res => {
					console.log(res);
					let type = 'info';
					let msg = {
						message: '修改成功',
						type
					}
					if (res.data.meta.status == 200) {
						msg.type = 'success';
						this.$message(msg);
						this.editRolesDialogVisible = false;
						this.getRolesList();
					} else {
						msg.type = 'error';
						this.$message(msg);
					}
				}).catch( err => {
					console.log(err);
				})
			})
		},
		// 编辑角色对话框关闭 重置 editRolesForm
		editRolesDialogClosed() {
			this.editRolesForm = {
				username: '',
				password: '',
				email: '',
				mobile: ''
			};
			this.editRolesDialogVisible = false;
			this.$refs.editRolesFormRef.resetFields();
		},
		// 点击编辑角色 根据id获取数据 渲染在editRolesForm 表单中
		editRolesDialogChanged(id) {
			this.editRolesDialogVisible = true;
			request({
				url: `roles/${id}`
			}).then(res => {
				if (res.data.meta.status == 200) {
					this.editRolesForm = res.data.data;
					// console.log(this.editRolesForm);
					this.editRolesDialogVisible = true;
				} else {
					this.$message.error(res.data.meta.msg);
				}
			}).catch(err => {
				console.log(err);
			})
		},
		// 关闭添加角色 对话框 重置 表单 
		addRolesDialogClosed() {
			this.$refs.addRolesFormRef.resetFields();
		},
		// 添加角色按钮 
		addRole() {
			this.$refs.addRolesFormRef.validate(valid => {
				console.log(valid);
				if(!valid) return;
				request({
					method: 'post',
					url: 'roles',
					data: this.addRolesForm
				}).then(res => {
					console.log(res);
					let type = 'info';
					let msg = {
						message: res.data.meta.msg,
						type
					}
					if (res.data.meta.status == 201) {
						msg.type = 'success';
						this.$message(msg);
						this.addRolesDialogVisible = false;
						this.getRolesList();
					} else {
						msg.type = 'error';
						this.$message(msg);
					}
				}).catch( err => {
					console.log(err);
				})
			})
		}
	}
}
</script>

<style  scoped>
.bdtop {
	border-top: 1px solid #eee;
}
.bdbottom {
	border-bottom: 1px solid #eee;
}
.el-tag {
	margin: 10px 2px;
}
.vcenter {
	display: flex;
	align-items: center;
}
</style>
