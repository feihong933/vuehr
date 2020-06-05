import Vue from 'vue'
import Vuex from 'vuex'

//在store中存储菜单数据

Vue.use(Vuex)

export  default new Vuex.Store({
    state:{
        routes:[]
    },
    mutations:{
        initRoutes(state,data){
            state.routes=data;
        }
    },
    actions:{

    }
})