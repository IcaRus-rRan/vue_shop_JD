<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="el-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
			<!-- 搜索、添加用户区域 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="queryInfo.params.query"
              clearable
              @clear="getUserList">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="queryUserList"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addDialogVisible = true">添加用户
						</el-button>
          </div>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话" width="150"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180">
          <template v-slot="scope">
            <el-button 
							type="primary" 
							icon="el-icon-edit" 
							circle 
							@click="editDialogChanged(scope.row.id)"></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false">
              <el-button 
							  type="warning" 
								icon="el-icon-setting" 
								circle
								@click="showSetRolesDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-button type="danger" icon="el-icon-delete" circle @click="removeUser(scope.row.id)"></el-button>
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

    <!-- 添加用户弹出的对话框 -->
    <el-dialog 
			title="添加用户" 
			:visible.sync="addDialogVisible" 
			width="480px"
			@close="addDialogClosed">
			<!-- 主体区域 -->
      <el-form :model="addForm" :rules="addUserFormRules" ref="addFormRef">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
				<el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
			<!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

		<!-- 编辑用户弹出的对话框 -->
    <el-dialog 
			title="修改信息" 
			:visible.sync="editDialogVisible" 
			width="480px">
			<!-- 主体区域 -->
      <el-form 
				:model="editForm" 
				:rules="addUserFormRules" 
				:label-width="formLabelWidth"
				ref="editFormRef">
        <el-form-item label="用户名" >
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
			<!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogclosed">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
		
		<!-- 分配角色弹出的对话框 -->
		<el-dialog 
			title="分配角色" 
			:visible.sync="setRolesDialogVisible" 
			width="480px"
			modal-append-to-body
			@close="setRolesDialogClosed">
			<!-- 主体区域 -->
				<div>
					<p>当前的用户：{{ userinfo.username }}</p>
					<p>当前的角色：{{ userinfo.role_name }}</p>
					<p>分配新角色：
						<el-select v-model="selectedRoleId" placeholder="请选择">
							<el-option
								v-for="item in rolesList"
								:key="item.id"
								:label="item.roleName"
								:value="item.id">
							</el-option>
						</el-select>
					</p>
				</div>
			<!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { request } from "network/request.js";

export default {
  data() {
		var checkMobile = (rule, value, callback) => {

			const regMobile = /^1[3|bai4|5|6|7|8|9][0-9]{9}$/;
			if(regMobile.test(value)) {
				return callback()
			}
			callback(new Error('请输入合法的手机号码'));
		}
    return {
			userinfo: {},
			// 获取用户列表的参数
      queryInfo: {
        url: "users",
        params: {
          query: "",
          pagenum: 1,
          pagesize: 5,
        },
			},
			// 用户列表区域内容
      userList: [],
			total: 0,
			// 所有角色列表
			rolesList: [],
			// 设置角色 选定的角色id
			selectedRoleId: [],
			// 控制 添加用户 弹框的显示隐藏
			addDialogVisible: false,
			// 控制 编辑用户 弹框的显示隐藏
			editDialogVisible: false,
			// 控制 编辑用户 弹框的显示隐藏
			setRolesDialogVisible: false,
			// 添加用户的表单数据
			addForm: {
				username: '',
				password: '',
				email: '',
				mobile: ''
			},
			// 编辑用户的表单数据
			editForm: {
				username: '',
				password: '',
				email: '',
				mobile: ''
			},
			// 控制添加用户弹框的输入框左侧文字距离
			formLabelWidth: "70px",
			// 控制添加用户弹框中表单验证规则
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3~10个字符", trigger: "blur" },
				],
				password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6~15个字符", trigger: "blur" },
				],
				email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: 'email', message: "请输入正确的邮箱地址", trigger: ["blur", "change"] },
				],
				mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
				],
			},
    };
  },
  created() {
		this.getUserList();
  },
  methods: {
		// 显示设置角色对话框
		showSetRolesDialog(userinfo) {
			this.userinfo = userinfo;
			request({
				url: 'roles',
			}).then(res => {
				this.rolesList = res.data.data;
			}).catch(err => {
				console.log(err);
			})
			this.setRolesDialogVisible = true;
		},
		// 设置角色 确定按钮
		saveRoleInfo() {
			if(!this.selectedRoleId) {
				return this.$message.error('请选择要分配的角色')
			}
			request({
				url: `users/${this.userinfo.id}/role`,
				method: 'put',
				data: {
					rid: this.selectedRoleId
				}
			}).then(res => {
				if(res.data.meta.status !== 200) {
					return this.$message.error(res.data.meta.msg);
				}
				this.$message.success(res.data.meta.msg);
				this.setRolesDialogVisible = false;
				this.getUserList();
			}).catch(err => {
				console.log(err);
			})
		},
		// 设置角色对话框 关闭 重置 roleId
		setRolesDialogClosed() {
			this.selectedRoleId = '';
			this.userinfo = {}
		},
		// 根据id 删除对应角色
		removeUser(id) {
			this.$confirm('确认要删除此用户吗？', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
					request({
						method: 'delete',
						url: `users/${id}`
					}).then(res => {
						if(res.data.meta.status !== 200) {
							return this.$message.error(res.data.meta.msg);
						}
						this.$message.success(res.data.meta.msg);
						this.queryInfo.params.pagenum = 1;
						this.getUserList();
					}).catch(err => {
						console.log(err);
						this.$message.error(res.data.meta.msg);
					})
			}).catch(err => {
				this.$message.info('已取消删除操作')
			})
		},
		// 点击 编辑用户对话框 的关闭 清空editForm
		editDialogclosed() {
			this.editForm = {
				username: '',
				password: '',
				email: '',
				mobile: ''
			};
			this.editDialogVisible = false;
			this.$refs.editFormRef.resetFields();
		},
		// 点击 编辑用户对话框的确定 预校验
		editUser() {
			this.$refs.editFormRef.validate(valid => {
				console.log(valid);
				if(!valid) return;
				request({
					method: 'put',
					url: `users/${this.editForm.id}`,
					data: this.editForm
				}).then(res => {
					console.log(res);
					let type = 'info';
					let msg = {
						message: res.data.meta.msg,
						type
					}
					if (res.data.meta.status == 200) {
						msg.type = 'success';
						this.$message(msg);
						this.editDialogVisible = false;
						this.getUserList();
					} else {
						msg.type = 'error';
						this.$message(msg);
					}
				}).catch( err => {
					console.log(err);
				})
			})
		},
		// 点击 编辑用户 弹出对话框
		editDialogChanged(id) {
			// console.log(id);
			const config = {
					url: `users/${id}`,
				}
			request(config).then(res => {
				console.log(res);
				if (res.data.meta.status == 200) {
					this.editForm = res.data.data;
					console.log(this.editForm);
					this.editDialogVisible = true;
				} else {
					this.$message.error(res.data.meta.msg);
				}
			}).catch(err => {
				console.log(err);
			})
		},
		// 获取用户列表数据 存到userList中  将获取到的总数存到total中
    getUserList() {
      request(this.queryInfo)
        .then((res) => {
          // console.log(res);
          this.userList = res.data.data.users;
          this.total = res.data.data.total;
          // console.log(this.userList);
          // console.log(this.total);
        })
        .catch((err) => {
          console.log(err);
        });
    },
		// 查询用户数据
		queryUserList() {
      this.queryInfo.params.pagenum = 1;
      this.getUserList();
    },
		// 每页显示条数
		handleSizeChange(newSize) {
      this.queryInfo.params.pagesize = newSize;
      this.getUserList();
    },
		// 翻页功能
    handleCurrentChange(newPage) {
      this.queryInfo.params.pagenum = newPage;
      this.getUserList();
		},
		// 修改用户状态
    userStateChanged(userinfo) {
      // console.log(userinfo);
      request({
        url: `users/${userinfo.id}/state/${userinfo.mg_state}`,
        method: "put",
      }).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          this.$message.error(res.data.meta.msg);
          userinfo.mg_state = !userinfo.mg_state;
          return;
        }
        this.$message.success(res.data.meta.msg);
      }).catch((err) => {
      	console.log(err);
     	});
		},
		// 关闭添加用户对话框时 对表单进行重置
		addDialogClosed() {
			this.$refs.addFormRef.resetFields();
		},
		// 添加用户操作
		addUser() {
			this.$refs.addFormRef.validate(valid => {
				console.log(valid);
				if(!valid) return;
				request({
					method: 'post',
					url: 'users',
					data: this.addForm
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
						this.addDialogVisible = false;
						this.getUserList();
					} else {
						msg.type = 'error';
						this.$message(msg);
					}
				}).catch( err => {
					console.log(err);
				})
			});
		}
  },
};
</script>

<style  scoped>
</style>
