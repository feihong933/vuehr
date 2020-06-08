import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {initMenu} from "./utils/menus";
//引入图标样式
import 'font-awesome/css/font-awesome.min.css'
/*
* 将putRequest这五个方法制作成vue插件，这样在使用时就不用导入了
* */
import {postKeyValueRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {putRequest} from "./utils/api";

Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;


Vue.use(ElementUI)
// 全局前置守卫>>>>>相当于过滤器
//当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 等待中。
router.beforeEach((to, from, next) => {
    if (to.path === '/') {
        next();
    } else {
        //不是登录页，判断用户是否登录
        if (window.sessionStorage.getItem("user")) {
            initMenu(router, store);//>>>>用户在刷新页面时，不会重新刷新菜单数据
            next();
        } else {
            // Message.error("Oops，没有登录！");
            // next('/');
            next('/?redirect='+to.path);//登录后跳转到之前要访问的页面
        }

    }
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
