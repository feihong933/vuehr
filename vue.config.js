/*
因为开发时，前后端端口不同存在跨域，需要用node.js设置请求转发*/
let proxyObj={};
proxyObj['/']={//拦截所有http请求
    ws:false,//websocket
    target: 'http://localhost:8081',//转发地址，后端端口
    changeOrigin: true,
    pathRewrite:{//拦截后不修改原地址
        '^/': ''
    }
}
module.exports={
    devServer:{
        host:'localhost',
        port:8080,
        proxy:proxyObj
    }
}

