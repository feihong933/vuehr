<template>
    <div>
        <el-tabs type="border-card">
            <el-tab-pane label="部门管理"><DepMana></DepMana></el-tab-pane>
            <el-tab-pane label="职位管理"><PosMana></PosMana></el-tab-pane>
            <el-tab-pane label="职称管理"><JobLevelMana></JobLevelMana></el-tab-pane>
            <el-tab-pane label="奖惩规划"><EcMana></EcMana></el-tab-pane>
            <el-tab-pane label="权限组"><PermissMana></PermissMana></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
// <!--    引入选项卡组件-->
    import DepMana from "../../components/sys/basic/DepMana";
    import PosMana from "../../components/sys/basic/PosMana";
    import JobLevelMana from "../../components/sys/basic/JobLevelMana";
    import PermissMana from "../../components/sys/basic/PermissMana";
    import EcMana from "../../components/sys/basic/EcMana";

    export default {
        name: "SysBasic",

        components:{
            'DepMana':DepMana,
            'PosMana':PosMana,
            'JobLevelMana':JobLevelMana,
            'PermissMana':PermissMana,
            'EcMana':EcMana
        }
    }
</script>

<style scoped>

</style>