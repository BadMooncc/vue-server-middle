

> vue中间层静态脚手架

##  目录结构

```
├── README.md                       项目介绍
├── index.html                      入口页面
├── build                           构建脚本目录
│   ├── webpack.base.conf.js            webpack基础配置,开发环境,生产环境都依赖   
│   ├── webpack.dev.conf.js             webpack开发环境配置
│   ├── webpack.prod.conf.js            webpack生产环境配置
│   ├── build.js                        生产环境构建脚本               
│   ├── dev-server.js                   开发服务器热重载脚本，主要用来实现开发阶段的页面自动刷新
├── config                          项目配置
│   ├── dev.env.js                      开发环境变量
│   ├── index.js                        项目配置文件
│   ├── prod.env.js                     生产环境变量
├── src                             源码目录    
│   ├── main.js                         入口文件
│   ├── config                          相关配置文件目录
│   ├── app.vue                         根组件
│   ├── components                      公共组件目录
│   ├── styles                          样式资源目录
│   ├── service                         接口统一存放目录
│   ├── pages                           vue页面目录
│   ├── routes                          路由目录
│   │   └── index                         路由主文件
│   ├── store                           vuex存放目录
│   │   └── index.js                      vuex汇总文件
│   │   └── type.js                       类型汇总
│   │   └── actions.js                    actions
│   │   └── mutations.js                  mutations
│   │   └── getters.js                    getters
│   │   └── state.js                      默认状态
├── .eslintrc.js                        eslint规则配置
├── package.json 
```

## 项目启动说明
``` bash

# npm run build  打包项目

# npm run dev 开发环境启动

# npm run start 生产环境启动

# npm run production 生产环境打包后启动

```

## 脚手架使用注意事项

> node中间层开发与普通开发区别相差无几，主要在使用上，有以下几点需要注意：

- /src/config/axiosConfig.js  axios配置文件，默认为所有请求前都添加了/api，因为中间层需要通过/api来确定是否转发该请求，基于此，在浏览器控制台看到的请求，并非请求真正提供后台接口的服务器，而是请求的中间层服务。

- /src/config/origin.js  中间层转发域名配置文件，分为生产环境域名和测试/开发环境域名，例如当使用npm run dev时，是开发/测试环境，则会取origin文件中的测试环境域名作为转发目标域名。

- vue热加载功能开启，但要注意，当涉及到修改中间层配置文件时，则需要重启项目。

- 规范，尽量按照每个文件对应含义，存放文件。

- 接口统一存放在/src/service目录下，下边有对应的实例代码