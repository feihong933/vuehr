/*
封装网络请求响应*/

import axios from 'axios'
import {Message} from 'element-ui';

axios.interceptors.response.use(success => {
        //success.data.status中返回的是自己定义的Jason中的status
        if (success.status && success.status == 200 && success.data.status == 500) {//业务上的错误，即自己定义的错误
            Message.error({message: success.data.msg})
            return;
        }
        if(success.data.msg){
            Message.success({message:success.data.msg})
        }
        return success.data;
    },
    error => {
        if (error.response.status == 504 || error.response.data == 404) {
            Message.error({message: "服务器被吃了o(╯□╰)o"})
        } else if (error.response.status == 403) {
            Message.error({message: "权限不足，请联系管理员！"})
        } else if (error.response.status == 401) {
            Message.error({message: "尚未登录，请登录！"})
        } else {
            if (error.response.data.msg) {
                Message.error({message: error.response.data.msg})
            } else {
                Message.error({message: "未知错误！"})
            }
        }
        return;
    })

//封装
let base = ''//前缀，之后可更改

// 使用key-value形式发送登录请求
export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        //默认为json，需要进行转换
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {//将Jason装换为Key-Value
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret;
        }],
        //定义请求头
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}
//封装json格式的post请求
export const postRequest=(url,params)=>{
    return axios({
        method:'post',
        url: `${base}${url}`,
        data:params
    })
}

//封装json格式的put请求
export const putRequest=(url,params)=>{
    return axios({
        method:'put',
        url: `${base}${url}`,
        data:params
    })
}

//封装json格式的get请求
export const getRequest=(url,params)=>{
    return axios({
        method:'get',
        url: `${base}${url}`,
        data:params
    })
}

//封装json格式的delete请求
export const deleteRequest=(url,params)=>{
    return axios({
        method:'delete',
        url: `${base}${url}`,
        data:params
    })
}