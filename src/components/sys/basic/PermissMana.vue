<template>
    <div>
        <div class="permissManaTool">
            <el-input class="el-input" size="small" placeholder="请输入角色英文名" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input class="el-input" size="small" placeholder="请输入角色中文名" v-model="role.nameZh">
            </el-input>
            <el-button @click="doAddRole" type="primary" round icon="el-icon-plus" size="small"
                       style="margin-left: 8px">添加角色
            </el-button>
        </div>
        <div>
            <el-collapse
                    v-model="activeName"
                    class="permissManaMain" accordion @change="change">
                <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles" :key="index">
                    <div>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>可访问的资源</span>
                                <el-button
                                        @click="deleteRole(r)"
                                        style="float: right; padding: 4px 0;color:red;border-style: hidden"
                                        icon="el-icon-delete"></el-button>
                            </div>
                            <div>
                                <el-tree show-checkbox
                                         ref="tree"
                                         :key="index"
                                         node-key="id"
                                         :default-checked-keys="selectedMenus"
                                         :data="allMenus"
                                         :props="defaultProps"></el-tree>
                                <div style="display: flex;justify-content: flex-end">
                                    <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                                    <el-button size="mini" type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissMana",
        data() {
            return {
                role: {
                    name: '',
                    nameZh: ''
                },
                roles: [],
                allMenus: [],
                selectedMenus: [],
                activeName:-1,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        mounted() {
            this.initRoles();
        },
        methods: {
            change(rid) {
                if (rid) {
                    this.initAllMenus();
                    this.initSelectedMenus(rid);
                }
            },
            deleteRole(role){
                this.$confirm('此操作将永久删除【' + role.nameZh + '】角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/permiss/deleterole/" + role.id).then(resp => {
                        if (resp) {
                            this.initRoles();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doAddRole(){
                if (this.role.name && this.role.nameZh) {
                    this.globalLoading = true;
                    this.postRequest("/system/basic/permiss/addrole", this.role).then(resp => {
                        this.globalLoading = false;
                        if (resp) {
                            this.role.name = '';
                            this.role.nameZh = '';
                            this.initRoles();
                        }
                    })
                } else {
                    this.$message.error('数据不可以为空');
                }
            },
            doUpdate(rid,index) {
                let tree=this.$refs.tree[index];
                let selectedKeys = tree.getCheckedKeys(true);//只返回叶子节点的mid
                let url='/system/basic/permiss/?rid='+rid;
                selectedKeys.forEach(key=>{
                    url+='&mids='+key;
                })
                this.putRequest(url).then(resp=>{
                    this.activeName=-1;
                })
            },
            cancelUpdate() {
                this.activeName = -1;
            },
            //初始化所有被选中菜单项
            initSelectedMenus(rid) {
                this.getRequest("/system/basic/permiss/mids/" + rid).then(resp => {
                    if (resp) {
                        this.selectedMenus = resp;
                    }
                })
            },
            //初始化所有菜单项
            initAllMenus() {
                this.getRequest("/system/basic/permiss/menus").then(resp => {
                    if (resp) {
                        this.allMenus = resp;
                    }
                })
            },

            initRoles() {
                this.getRequest("/system/basic/permiss/").then(resp => {
                    if (resp) {
                        this.roles = resp;
                        this.activeName=-1;
                    }
                })
            }
        }
    }
</script>

<style>
    .permissManaTool {
        display: flex;
        justify-content: flex-start;
    }

    .permissManaTool .el-input {
        width: 300px;
        margin-right: 6px;
    }

    .permissManaMain {
        margin-top: 10px;
        width: 700px;
    }
</style>