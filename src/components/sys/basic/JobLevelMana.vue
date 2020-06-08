<template>
    <div>
        <div>
            <el-input size="small" style="width: 300px;margin-top: 8px"
                      placeholder="添加职称..."
                      prefix-icon="el-icon-plus"
                      @keydown.enter.native="addJobLevel"
                      v-model="jl.name">
            </el-input>
            <el-select v-model="jl.titleLevel" placeholder="职称等级"
                       style="margin-left: 8px"
                       size="small">
                <el-option
                        v-for="item in titleLevels"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button @click="addJobLevel" type="primary" round icon="el-icon-plus" size="small"
                       style="margin-left: 8px">添加
            </el-button>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    :data="jls"
                    border
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    size="small"
                    @selection-change="handleSelectionChange"
                    style="width: 80%">
                <el-table-column
                        align="center"
                        type="selection"
                        width="45">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="id"
                        label="编号"
                        width="60">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="name"
                        label="职称名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        width="180"
                        align="center"
                        prop="titleLevel"
                        label="职称级别">
                </el-table-column>
                <el-table-column
                        width="180"
                        align="center"
                        prop="createDate"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        width="100"
                        align="center"
                        label="是否启用">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="danger" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        width="180"
                        align="center"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click="deleteMany" type="danger" size="small" style="margin-top: 8px"
                       :disabled="multipleSelection.length===0">批量删除
            </el-button>
        </div>
        <el-dialog
                align="center"
                title="修改职称"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td><el-tag>职称</el-tag></td>
                        <td><el-input class="updateJlsInput" size="small" v-model="updateJl.name"></el-input></td>
                    </tr>
                    <tr>
                        <td><el-tag>职称级别</el-tag></td>
                        <td><el-select v-model="updateJl.titleLevel" :placeholder="updateJl.titleLevel"
                                       size="small">
                            <el-option
                                    v-for="item in titleLevels"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select></td>
                    </tr>
                    <tr>
                        <td><el-tag>是否启用</el-tag></td>
                        <td><el-switch
                                align="center"
                                style="display: block"
                                v-model="updateJl.enabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="启用"
                                inactive-text="禁用">
                        </el-switch></td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate" >确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "JobLevelMana",
        mounted() {
            this.initJls()
        },
        data() {
            return {
                jl: {
                    name: '',
                    titleLevel:''
                },
                jls:[],
                dialogVisible:false,
                updateJl:{
                    name:'',
                    titleLevel:'',
                    enabled:false
                },
                multipleSelection:[],
                titleLevels:[
                    '正高级',
                    '副高级',
                    '中级',
                    '初级',
                    '员级'
                ]
            }
        },
        methods:{
            //初始化职称数据
            initJls() {
                this.getRequest("/system/basic/joblevel/").then(resp => {
                    if (resp) {
                        this.jls = resp;
                    }
                })
            },
            //添加职称
            addJobLevel() {
                if (this.jl.name && this.jl.titleLevel) {
                    this.postRequest("/system/basic/joblevel/", this.jl).then(resp => {
                        if (resp) {
                            this.initJls();
                        }
                    });
                } else {
                    this.$message.error("添加字段不可以为空!");
                }
            },
            deleteHandler(data) {
                this.$confirm('此操作将永久删除【' + data.name + '】职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/joblevel/" + data.id).then(resp => {
                        if (resp) {
                            this.initJls();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //多选框选中项
            handleSelectionChange(val){
                this.multipleSelection=val;
            },
            deleteMany(){
                this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids="?";
                    this.multipleSelection.forEach(item=>{
                        ids+='ids='+item.id+'&';
                    })
                    this.deleteRequest("/system/basic/joblevel/"+ids).then(resp => {
                        if (resp) {
                            this.initJls();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //编辑
            showEditView(data){
                Object.assign(this.updateJl,data);//将当前职位信息做一个拷贝，显示在input框中
                this.dialogVisible=true;
            },
            doUpdate(){
                this.putRequest("/system/basic/joblevel/",this.updateJl).then(resp=>{
                    this.initJls();

                    this.dialogVisible = false;
                })
            }
        }
    }
</script>

<style scoped>

</style>