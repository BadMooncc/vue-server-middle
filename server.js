'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const noDevelop = process.env.NODE_ENV !== 'develop';
const resolve  = file => path.resolve(__dirname, file);
const bodyParser = require('body-parser');
const { production, develop, port } = require('./src/config/origin');
const proxy = require('http-proxy-middleware');
const { createBundleRenderer } = require('vue-server-renderer');
const app = express();
let tempHTML;
let url;
let staticUrl;
let origin = !noDevelop ? develop.origin : production.origin;
let renderer;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 根据当前环境变量判断是否为生产环境
if (!noDevelop) {
  //开发环境下，采用webpack热加载
  const setupDevServer = require('./build/dev-server');
  staticUrl = './static';
  setupDevServer(app, {
    templateUpdated: (template) => {
      tempHTML = template;
    }
  });
} else {
  // 生产环境，读取/dist/index.html渲染
  staticUrl = './dist/static';
  // 生成服务端渲染函数
  renderer = createBundleRenderer(require('./dist/vue-ssr-server-bundle.json'), {
    // 推荐
    runInNewContext: false,
    //  读取服务端渲染模板文件
    template: fs.readFileSync(resolve('./index.template.html'), 'utf-8'),
    // client manifest
    clientManifest: require('./dist/vue-ssr-client-manifest.json')
  })
}
// 配置静态资源路径
app.use('/static', express.static(staticUrl));
// 代理请求转发
app.use('/api', proxy({
  target: origin,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/'
  }
}));
// history模式下，防止刷新出现404，
app.get('*' ,(req, res, next) => {
  if (!noDevelop) {
    res.send(tempHTML);
    next();
  } else {
    const context = { url: req.url }
    console.log(context, '------')
    renderer.renderToString(context,(err,html) => {
      res.send(html);
      next();
    })
  }
});
app.listen(port, function(){
  console.log(`targetOrigin ========> ${origin}`)
  console.log('listening on *:', port);
});
