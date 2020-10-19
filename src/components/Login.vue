<!--  -->
<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 登录头部 -->
      <div class="avatar_box">
        <img src="~assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        label-width="80px"
        class="login_form"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名:" prop="username">
          <el-input
            prefix-icon="el-icon-user"
            placeholder="请输入用户名"
            v-model="loginForm.username"
          >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码:" prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            v-model="loginForm.password"
            type="password"
          >
          </el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { request } from "network/request.js";

export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 8,
            message: "长度在 3 到 8 个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 8,
            message: "长度在 6 到 8 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
			const loginInfo = this.loginForm;
			const config = {
          method: "post",
          url: "login",
          data: loginInfo,
				}
      this.$refs.loginFormRef.validate()
        .then(result=> {
          request(config).then(res => {
						console.log(res.data);
						let type = 'info';
						let msg = {
							message: res.data.meta.msg,
							type
						}
						if (res.data.meta.status == 200) {
							msg.type = 'success';
							this.$message(msg);
							window.sessionStorage.setItem('token', res.data.data.token);
							setTimeout(() => {
								this.$router.push('/home');
							},2500)
						} else {
							msg.type = 'error';
							this.$message(msg);
						}
					});
        }).catch(err=> {
          console.log(err);
        });
    },
  },
  created() {
    console.log("login组件已加载");
  },
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
}
.avatar_box {
  position: relative;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 5px solid #eee;
  background-color: #ddd;
  overflow: hidden;
  box-shadow: 1px -1px 8px #ddd;

  img {
    position: relative;
    top: 5%;

    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.btn {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px 0 0;
  box-sizing: border-box;
}
</style>
