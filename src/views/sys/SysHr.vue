<template>
    <div>
        <div style="margin-top: 10px;display: flex;justify-content: center">
            <el-input size="small" v-model="keyWords" placeholder="通过用户名搜索用户..." prefix-icon="el-icon-search"
                      style="width: 400px;margin-right: 10px" @keydown.enter.native="doSearch"></el-input>
            <el-button size="small" icon="el-icon-search" type="primary" @click="doSearch">搜索</el-button>
        </div>
        <div style="margin-top: 20px;display: flex;flex-wrap: wrap;justify-content: space-evenly">
            <el-card class="hr-card" v-for="(hr,index) in hrs" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{hr.name}}</span>
                    <el-button style="float: right; padding: 3px 0;color: red"
                               @click="deleteHr(hr)"
                               type="text" icon="el-icon-delete">删除
                                </el-button>
                </div>
                <div style="width: 100%;display: flex;justify-content: center ">
                    <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface-img">
                </div>
                <div class="userinfo-container">
                    <div>用户名：{{hr.name}}</div>
                    <div>手机号码：{{hr.phone}}</div>
                    <div>电话号码：{{hr.telephone}}</div>
                    <div>地址：{{hr.address}}</div>
                    <div style="align-items: center">用户状态：
                        <el-switch
                                style="vertical-align:bottom"
                                v-model="hr.enabled"
                                active-text="启用"
                                @change="enabledChange(hr)"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                inactive-text="禁用">
                        </el-switch>
                    </div>
                    <div>用户角色：
                        <el-tag type="success" style="margin-right: 5px" v-for="(role,indexj) in hr.roles"
                                :key="indexj">{{role.nameZh}}
                        </el-tag>
                        <el-popover
                                placement="right"
                                title="角色列表"
                                @show="showPop(hr)"
                                @hide="hidePop(hr)"
                                width="200"
                                trigger="click">
                            <el-select v-model="selectedRoles" multiple placeholder="请选择">
                                <el-option
                                        v-for="(r,indexk) in allroles"
                                        :key="indexk"
                                        :label="r.nameZh"
                                        :value="r.id">
                                </el-option>
                            </el-select>
                            <el-button slot="reference" icon="el-icon-more" type="text"></el-button>
                        </el-popover>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SysHr",
        data(){
            return{
                keyWords:'',
                hrs:[],
                allroles:[],
                selectedRoles: [],
            }
        },
        mounted() {
            this.initHrs();
        },
        methods:{
            deleteHr(hr){
                this.$confirm('此操作将永久删除【'+hr.name+'】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/hr/"+hr.id).then(resp=>{
                        if (resp) {
                            this.initHrs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doSearch() {
                this.initHrs();
            },
            hidePop(hr){
                let roles = [];
                Object.assign(roles, hr.roles);
                let flag = false;
                if (roles.length != this.selectedRoles.length) {
                    flag = true;
                } else {
                    for (let i = 0; i < roles.length; i++) {
                        let role = roles[i];
                        for (let j = 0; j < this.selectedRoles.length; j++) {
                            let sr = this.selectedRoles[j];
                            if (role.id == sr) {
                                roles.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                    if (roles.length != 0) {
                        flag = true;
                    }
                }
                if (flag) {
                    let url = '/system/hr/role?hrid=' + hr.id;
                    this.selectedRoles.forEach(sr => {
                        url += '&rids=' + sr;
                    });
                    this.putRequest(url).then(resp => {
                        if (resp) {
                            this.initHrs();
                        }
                    });
                }
            },
            showPop(hr){
                let roles=hr.roles;
                this.selectedRoles = [];
                roles.forEach(r => {
                    this.selectedRoles.push(r.id);
                })
                this.initAllRoles();
            },
            initAllRoles(){
               this.getRequest("/system/hr/roles").then(resp=>{
                   if(resp){
                       this.allroles=resp;
                   }
               })
            },
            initHrs(){
                this.getRequest("/system/hr/?keyWords="+this.keyWords).then(resp=>{
                    if(resp){
                        this.hrs=resp;
                    }
                })
            },
            //修改Hr可用状态
            enabledChange(hr) {
                delete hr.roles;
                this.putRequest("/system/hr/", hr).then(resp => {
                    if (resp) {
                        this.initHrs();
                    }
                })
            },
        }
    }
</script>

<style>
    .userinfo-container div {
        font-size: 16px;
        color: darkgrey;
        margin-top: 5px;
    }

    .userinfo-container {
        margin-top: 20px;
    }
    .userface-img {
        width: 72px;
        height: 72px;
        border-radius: 72px;
    }
    .hr-card {
        width: 350px;
        margin-bottom: 20px;
    }
</style>