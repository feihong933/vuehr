<template>
    <div>
        <div>
            <el-input size="small" style="width: 300px;margin-top: 8px"
                      placeholder="添加职位"
                      prefix-icon="el-icon-plus"
                      @keydown.enter.native="addPosition"
                      v-model="pos.name">
            </el-input>
            <el-button @click="addPosition" type="primary" round icon="el-icon-plus" size="small"
                       style="margin-left: 8px">添加
            </el-button>
        </div>
        <div style="margin-top: 18px">
            <el-table
                    :data="positions"
                    border
                    @selection-change="handleSelectionChange"
                    size="small"
                    stripe
                    style="width: 70%">
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
                        label="职位名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createDate"
                        width="220"
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
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="showEditView(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
                        <el-button @click="deleteMany" type="danger" size="small" style="margin-top: 8px"
                                   :disabled="multipleSelection.length===0">批量删除
                        </el-button>
        </div>
        <el-dialog
                align="center"
                title="修改职位"
                :visible.sync="dialogVisible"
                width="30%">
            <table>
                <tr>
                    <td><el-tag>职位名称</el-tag></td>
                    <td><el-input class="updatePosInput" size="small" v-model="updatePos.name"></el-input></td>
                </tr>
                <tr>
                    <td><el-tag>是否启用</el-tag></td>
                    <td><el-switch
                            align="center"
                            style="display: block"
                            v-model="updatePos.enabled"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="启用"
                            inactive-text="禁用">
                    </el-switch></td>
                </tr>
            </table>

            <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate" >确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PosMana",
        data() {
            return {
                pos: {
                    name: ''
                },
                positions: [],
                dialogVisible:false,
                updatePos:{
                    name:'',
                    enabled:false
                },
                multipleSelection:[]
            }
        },
        mounted() {//钩子函数--生命周期
            this.initPositions();
        },
        methods: {
            //批量删除
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
                    this.deleteRequest("/system/basic/pos/"+ids).then(resp => {
                        if (resp) {
                            this.initPositions();
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
            doUpdate(){
                this.putRequest("/system/basic/pos/",this.updatePos).then(resp=>{
                    this.initPositions();
                    this.updatePos='';
                    this.dialogVisible = false;
                })
            },
            addPosition() {
                if (this.pos.name) {
                    this.postRequest("/system/basic/pos/", this.pos).then(resp => {
                        this.initPositions();
                        this.pos.name = '';
                    })
                } else {
                    this.$message.error('职位名称不可以为空');
                }
            },
            handleDelete(index, data) {
                this.$confirm('此操作将永久删除【' + data.name + '】职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/pos/" + data.id).then(resp => {
                        if (resp) {
                            this.initPositions();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //显示修改框
            showEditView(index, data) {
                Object.assign(this.updatePos,data);//将当前职位信息做一个拷贝，显示在input框中
                this.dialogVisible=true;
            },
            initPositions() {
                this.getRequest("/system/basic/pos/").then(resp => {
                    if (resp) {
                        this.positions = resp;
                    }
                })
            }
        }
    }
</script>

<style>
    .updatePosInput{
        width: 280px;
        margin-left: 8px;
    }

</style>