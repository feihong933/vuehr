<template>
    <div>
        <el-form ref="loginForm" :rules="rules" :model="loginForm" class="loginContainer">
            <h2 class="loginTitle">系统登录</h2>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" auto-complete="off"
                          placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" auto-complete="off"
                          placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-checkbox class="loginRemembered" v-model="checked">记住我</el-checkbox>
            <el-button type="primary" style="width:100%" @click="loginSubmit">登录</el-button>
        </el-form>
    </div>
</template>

<script>
    import {postKeyValueRequest} from "../utils/api";///使用key-value形式发送登录请求

    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: '123'
                },
                checked: true,
                rules: {
                    username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
                    password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
                }
            }
        },
        methods: {
            loginSubmit() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.postKeyValueRequest("/doLogin",this.loginForm).then(resp=>{
                            if(resp){//若返回的response有值，说明登录成功
                                // 见api.js中axios.interceptors.response.use(success => {}
                                // alert(JSON.stringify(resp))
                                window.sessionStorage.setItem("user",JSON.stringify(resp.obj))//将登陆用户信息存到sessionStorage
                                this.$router.replace("/home")// 页面跳转：push和replace
                            }
                        })
                        // alert('submit!');
                    } else {
                        this.$message.error('请输入所有字段！');
                        return false;
                    }
                });
            }
        }

    }
</script>

<style>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: aliceblue;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .loginTitle {
        margin: 10px auto 20px auto;
        text-align: center;
        color: #505458;
    }

    .loginRemembered {
        text-align: left;
        margin: 0 0 20px 0;
        color: #505458;
    }
</style>