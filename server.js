'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const noDevelop = process.env.NODE_ENV !== 'develop';
const resolve  = file => path.resolve(__dirname, file);
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const { production, develop } = require('./src/config/origin');
const proxy = require('http-proxy-middleware');
const app = express();
let tempHTML;
let origin = !noDevelop ? develop.origin : production.origin;
let url;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 根据当前环境变量判断是否为生产环境
if (!noDevelop) {
  //开发环境下，采用webpack热加载
  const setupDevServer = require('./build/dev-server');
  setupDevServer(app, {
    templateUpdated: (template) => {
      tempHTML = template;
    }
  });
} else {
  // 生产环境，读取/dist/index.html渲染
  tempHTML = fs.readFileSync(resolve('./dist/index.html'), 'utf-8');
}
app.use('/dist', express.static('./dist'))
// 配置静态资源路径
app.use('/static', express.static('./dist/static'));
app.use('/api', proxy({
  target: origin,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/'
  }
}));
// history模式下，防止刷新出现404，
// 注： 需放置在最底部，避免出现中间层报错，原因未知，如果有ngnix做映射，则可以注释
app.get('*' ,(req, res, next) => {
  res.send(tempHTML);
  next();
});
const port = 8019;
server.listen(port, function(){
  console.log(`targetOrigin ========> ${origin}`)
  console.log('listening on *:', port);
});
