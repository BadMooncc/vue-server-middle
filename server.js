'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const noDevelop = process.env.NODE_ENV !== 'develop';
const resolve  = file => path.resolve(__dirname, file);
const app = express();
const server = require('http').createServer(app);
const $http = require('axios');
const bodyParser = require('body-parser');
const { production, develop } = require('./src/config');
const proxy = require('http-proxy-middleware');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// const _ = require('lodash');

// const Config = require('config');
// const favicon = require('serve-favicon');
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
let origin;
let url;
// 根据当前环境变量判断是否为生产环境
if (!noDevelop) {
  //开发环境下，采用webpack热加载
  const setupDevServer = require('./build/dev-server');
  origin = develop.origin;
  setupDevServer(app, {
    templateUpdated: (template) => {
      tempHTML = template;
    }
  });
} else {
  // 生产环境，读取/dist/index.html渲染
  origin = production.origin;
  tempHTML = fs.readFileSync(resolve('./dist/index.html'), 'utf-8');
}
// console.log(origin);
app.use('/dist', express.static('./dist'))
// 配置静态资源路径
app.use('/static', express.static('./dist/static'));
// app.use('/', serve('./dist', true));
app.get('/', (req, res) => {
  res.send(tempHTML);
});
app.use('/abc', function(req, res){
  console.log(111111);
  res.json({name: '123'});
  res.end();
})
// 请求转发
app.use('/filter', (req, res, next) => {
  let method = req.method.toLocaleLowerCase();
  let data;
  method === 'post' ? data = req.body : data = req.query;
  url = origin + req.url;
  console.log('=================[proxy]===================');
  console.log(`===========${origin}${req.url}===========`);
  // console.log('query: ', req.query);
  // console.log('body:', req.body);
  console.log('=================[proxy]===================');
  
  (() => {
    if (method === 'get') return $http.get(url, data );
    else return $http.post(url, data);
  })().then((resp) => {
    // res.send(resp.data);
    res.json({name: '123'});
    res.end('1231312');
  }).catch((err) => {
    res.send(err.data);
    res.end('11111111');
  });
  // res.json({name: '123'});
});
// history模式下，防止刷新出现404，
// 注： 需放置在最底部，避免出现中间层报错，原因未知，如果有ngnix做映射，则可以注释
app.use((req, res, next) => {
  res.send(tempHTML);
  next();
});
const port = 8019;
server.listen(port, function(){
  console.log('listening on *:', port);
});
