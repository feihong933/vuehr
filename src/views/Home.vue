<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">微人事管理系统</div>
                <el-dropdown class="userInfo" @command="commandHandler">
  <span class="el-dropdown-link"><img :src="user.userface" alt="">
    {{user.name}}  <i></i>
  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>

                        <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>

            <el-container>
                <el-aside width="200px">
                    <el-menu router>
                        <el-submenu index="1" v-for="(item,index) in this.$router.options.routes" v-if="!item.hidden"
                                    :key="index">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">
                                {{child.name}}
                            </el-menu-item>
                        </el-submenu>

                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>

        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem("user"))
            }
        },
        methods: {
            commandHandler(cmd) {
                if (cmd == "logout") {
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getRequest("/logout")
                        window.sessionStorage.removeItem("user")//注销成功删除用户信息
                        this.$router.replace("/")// 页面跳转：push和replace
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }
            }/*,
            menuClick(index){
                this.$router.push(index);
            }*/
        }
    }
</script>

<style>
    .homeHeader {
        background-color: #B3C0D1;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        box-sizing: border-box;
    }

    .title {
        font-size: 30px;
        font-weight: bold;
        font-family: "微软雅黑 Light";
        color: #333333;
    }

    .userInfo {
        cursor: pointer;
    }

    .el-dropdown-link img {
        width: 40px;
        height: 40px;
        border-radius: 40px;
        margin-right: 8px;
    }

    .el-dropdown-link {
        /*color: dodgerblue;*/
        font-weight: 500;
        font-size: 20px;
        /*font-family: "微软雅黑 Light";*/
        display: flex;
        align-items: center;
        margin-right: auto;
    }


    /*.el-aside {*/
    /*    background-color: #D3DCE6;*/
    /*    color: #333;*/
    /*    text-align: center;*/
    /*    line-height: 200px;*/
    /*}*/

    /*.el-main {*/
    /*    background-color: #E9EEF3;*/
    /*    color: #333;*/
    /*    text-align: center;*/
    /*    line-height: 660px;*/
    /*}*/

    /*body > .el-container {*/
    /*    margin-bottom: 40px;*/
    /*}*/

    /*.el-container:nth-child(5) .el-aside,*/
    /*.el-container:nth-child(6) .el-aside {*/
    /*    line-height: 260px;*/
    /*}*/

    /*.el-container:nth-child(7) .el-aside {*/
    /*    line-height: 320px;*/
    /*}*/

</style>