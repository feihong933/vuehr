/*
从后端服务器获得菜单数据（根据登录角色）
 */
import {getRequest} from "./api";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest("/system/config/menu").then(data => {
        if (data) {
            let fmtRoutes = formatRoutes(data);
            router.addRoutes(fmtRoutes);
            store.commit('initRoutes',fmtRoutes);
        }
    })
}
export const formatRoutes = (routes) => {
    let fmRoutes = [];
    routes.forEach(router=>{
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        }=router;//批量变量定义
        if(children&&children instanceof Array){//将一级菜单的children格式化
            children=formatRoutes(children);
        }
        let fmRouter={
            path:path,
            name:name,
            meta:meta,
            iconCls:iconCls,
            children:children,
            component(resolve){
                //将后端返回的菜单结构中的component转换为组件名称
                if(component.startsWith("Emp")){
                    require(['../views/emp/'+component+'.vue'],resolve);
                }else if(component.startsWith("Per")){
                    require(['../views/per/'+component+'.vue'],resolve);
                }else if(component.startsWith("Sta")){
                    require(['../views/sta/'+component+'.vue'],resolve);
                }else if(component.startsWith("Sal")){
                    require(['../views/sal/'+component+'.vue'],resolve);
                }else if(component.startsWith("Sys")){
                    require(['../views/sys/'+component+'.vue'],resolve);
                }else{
                    require(['../views/'+component+'.vue'],resolve);
                }

            }
        }
        fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}