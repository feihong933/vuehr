<template>
    <div style="width:500px;margin-top: 8px ">
        <el-input
                size="small"
                prefix-icon="el-icon-search"
                placeholder="请输入部门名称进行搜索..."
                v-model="filterText">
        </el-input>

        <el-tree
                style="margin-top: 10px"
                :data="deps"
                :props="defaultProps"
                :expand-on-click-node="false"
                :render-content="renderContent"
                :filter-node-method="filterNode"
                ref="tree2">
        </el-tree>
        <el-dialog
                title="添加部门"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>上级部门</el-tag>
                        </td>
                        <td>{{pname}}</td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>部门名称</el-tag>
                        </td>
                        <td>
                            <el-input v-model="dep.name" placeholder="请输入部门名称..."></el-input>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddDep">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DepMana",
        data(){
            return {
                filterText:'',
                dep: {
                    name:'',
                    parentId:-1,
                },
                pname:'',
                deps:[],
                dialogVisible:false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        watch: {
            //当filterText变化时，触发此方法
            filterText(val) {
                this.$refs.tree2.filter(val);//filter过滤方法就是>>>>filter-node-method="filterNode"
            }
        },
        mounted() {
            this.initDeps();
        },
        methods: {
            filterNode(value, data) {//data就是当前点击部门的json对象
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            initDep() {
                this.dep = {
                    name: '',
                    parentId: -1
                }
                this.pname = '';
            },
            initDeps(){
                this.getRequest("system/basic/department/").then(resp=>{
                    if(resp){
                        this.deps=resp;
                    }
                })
            },
            addDep2Deps(deps, dep) {
                for (let i = 0; i < deps.length; i++) {
                    let d = deps[i];
                    if (d.id == dep.parentId) {
                        d.children = d.children.concat(dep);
                        if (d.children.length > 0) {
                            d.isParent = true;
                        }
                        return;
                    } else {
                        this.addDep2Deps(d.children, dep);
                    }
                }
            },
            doAddDep() {
                this.postRequest("/system/basic/department/", this.dep).then(resp => {
                    if (resp) {
                        this.addDep2Deps(this.deps, resp.obj);
                        this.dialogVisible = false;
                        //初始化变量
                        this.initDep();
                    }
                })
            },
            showAddDepView (data){
                this.pname=data.name;
                this.dep.parentId=data.id;
                this.dialogVisible=true;
            },
            //将删除的部门从部门树中动态移除
            removeDepFromDeps(p,deps, id) {
                for(let i=0;i<deps.length;i++){
                    let d = deps[i];
                    if (d.id == id) {
                        deps.splice(i, 1);
                        if (deps.length == 0) {
                            p.isParent = false;
                        }
                        return;
                    }else{
                        this.removeDepFromDeps(d,d.children, id);
                    }
                }
            },
            deleteDep(data){
                if (data.isParent) {
                    this.$message.error("当前部门还有子部门，不可以删除嗷~~");
                } else {
                    this.$confirm('此操作将永久删除【' + data.name + '】部门, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest("/system/basic/department/"+data.id).then(resp=>{
                            if (resp) {
                                this.removeDepFromDeps(null,this.deps,data.id);
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            renderContent(h, { node, data, store }) {
                return (
                    <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 10px; padding-right: 8px;">
                    <span>
                    <span>{node.label}</span>
                    </span>
                    <span>
                    <el-button size="mini" style="font-size: 10px;padding:4px" type="primary" on-click={ () => this.showAddDepView(data) }>添加</el-button>
                <el-button size="mini" style="font-size: 10px;padding:4px" type="danger" on-click={ () => this.deleteDep(data) }>删除</el-button>
                </span>
                </span>);
            }
        }
    }
</script>

<style>

</style>