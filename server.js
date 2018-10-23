'use strict';

const path = require('path');
// const _ = require('lodash');
const fs = require('fs');
// const proxy = require('http-proxy-middleware');
// const Config = require('config');
const express = require('express');
// const favicon = require('serve-favicon');
const noDevelop = process.env.NODE_ENV !== 'develop';
const resolve  = file => path.resolve(__dirname, file);
const app = express();
const server = require('http').createServer(app);
const $http = require('axios');
// const serve = (_path, cache) => express.static(resolve(_path), {
//   maxAge: cache ? '30d' : 0,
//   setHeaders: (res, path) => {
//     const type = express.static.mime.lookup(path);
//     // 设置缓存策略
//     if (type === 'text/html') {
//       res.setHeader('Cache-Control', 'public, max-age=0');
//     } else if (type === 'image/png' || type === 'image/jpg') {
//       res.setHeader('Cache-Control', 'public, max-age=86400');
//     }
//   }
// });

let tempHTML;
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
// app.use('/', serve('./dist', true));

app.get('/', (req, res) => {
  res.send(tempHTML);
});
app.get('/abc', (req, res, next) => {
  // console.log('123', req.query);
  res.send({ name: 'liao' });
});
app.use('/filter', (req, res, next) => {
  let url = req.url;
  let method = req.method.toLocaleLowerCase();
  let data;
  method === 'post' ? data = req.body : data = req.query;
  url = 'http://localhost:8019/abc';
  (() => {
    if (method === 'get') return $http.get(url, { params: data });
    else return $http.post(url, data);
  })().then((resp) => {
    console.log(resp, '-----');
    res.send({ name: '123' });
  }).catch((err) => {
    res.json(err);
  });
});
// history模式下，防止刷新出现404，注： 需放置在最底部，避免出现中间层报错，原因未知，如果有ngnix做映射，则可以注释
app.use((req, res, next) => {
  res.send(tempHTML);
  next();
});
const port = 8019;
server.listen(port, function(){
  console.log('listening on *:', port);
});
