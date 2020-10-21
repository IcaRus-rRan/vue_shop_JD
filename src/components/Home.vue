<!--  -->
<template>
	<el-container class="home-container">
		<!-- 头部区域 -->
		<el-header>
			<div>
				<img src="~assets/img/heima.png" alt="">
				<span class="header-title">电商后台管理系统</span>
			</div>
			<el-button type="info" @click="logout">exit</el-button>
		</el-header>
		<el-container>
		<!-- 侧边 -->
			<el-aside :width="isCollapse? '64px': '200px'">
				<div class="toggle-button"
						 @click="toggleCollapse" >|||</div>
				<el-menu
					background-color="#333744"
					text-color="#fff"
					active-text-color="#409eff"
					unique-opened
					router
					:collapse="isCollapse"
					:collapse-transition="false"
					:default-active="activePath">
					<!-- 一级菜单 -->
					<el-submenu 
						class="el-submenu"
						v-for="(item, index) in menuLists" 
						:index="index+''"
						:key="item.id">
						<template slot="title">
							<i :class="iconsObj[item.id]"></i>
							<span>{{ item.authName }}</span>
						</template>
						<!-- 二级菜单 -->
						<el-menu-item 
								v-for="i in item.children"
								:index="'/' + i.path" 
								:key="i.id">
							<template slot="title" >
								<i class="el-icon-menu"></i>
								<span>{{ i.authName }}</span>
							</template>
						</el-menu-item>
					</el-submenu>
    		</el-menu>
			</el-aside>
		<!-- 主体区域 -->
			<el-container>
				<el-main>
					<router-view></router-view>
				</el-main>
				<el-footer>Footer</el-footer>
			</el-container>
		</el-container>
	</el-container>
</template>

<script>
import { request } from "network/request.js";

export default {
	data() {
		return {
			menuLists: [],
			iconsObj: {
				'125': 'iconfont icon-user',
				'103': 'iconfont icon-tijikongjian',
				'101': 'iconfont icon-shangpin',
				'102': 'iconfont icon-danju',
				'145': 'iconfont icon-baobiao'
			},
			isCollapse: false,
			activePath: '/Welcome'
		}
	},
	methods: {
		logout() {
			window.sessionStorage.removeItem('token');
			this.$router.push('/login');
		},
		// 点击切换菜单的折叠与展开
		toggleCollapse() {
			// console.log(typeof this.isCollapse);
			this.isCollapse = ! this.isCollapse;
		}
	},
	created() {
		const config = {
        method: "get",
        url: "menus",
			}
		request(config).then(res => {
			this.menuLists = res.data.data;
		}).catch(err=> {
			console.log(err);
		});
	},
	updated() {
		// console.log(this.$route);
		this.activePath = this.$route.path
	}
}
</script>

<style lang="less" scoped>
.el-header {
	background-color: #373d41;
	display: flex;
	justify-content: space-between;
	align-items: center;
	> div {
		display: flex;
		align-items: center;
		span {
			margin-left: 15px;
		}
	}
}
.el-aside {
	background-color: #333744;
	.el-menu {
		border-right: none;
	}
}
.el-main {
	background-color: #eaedf1;
}
.el-footer {
	background-color: #373d41;
}
.el-button {
	font-size: 16px;
}
.home-container {
	height: 100%;
}
.header-title {
	font-size: 28px;	
	color: #fff;
}
.el-submenu {
	// width: 200px;
	.iconfont {
		margin-right: 8px;
	}
}
.toggle-button {
	background-color: #4a5064;
	color: #FFF;
	font-size: 10px;
	font-weight: 700;
	text-align: center;
	line-height: 20px;
	letter-spacing: 0.2em;
	cursor: pointer;
}
</style>
