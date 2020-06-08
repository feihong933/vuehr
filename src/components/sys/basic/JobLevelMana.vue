<template>
    <div>
        <div>
            <el-input size="small" style="width: 300px;margin-top: 8px"
                      placeholder="添加职称..."
                      prefix-icon="el-icon-plus"
                      @keydown.enter.native="addPosition"
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
            <el-button @click="addPosition" type="primary" round icon="el-icon-plus" size="small"
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
                        width="150">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="titleLevel"
                        label="职称级别">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createDate"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="是否启用">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="danger" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "JobLevelMana",
        data() {
            return {
                jl: {
                    name: '',
                    titleLevel:''
                },
                titleLevels:[
                    '正高级',
                    '副高级',
                    '中级',
                    '初级',
                    '员级'
                ]
            }
        }
    }
</script>

<style scoped>

</style>