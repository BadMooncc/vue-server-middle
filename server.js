'use strict';

const path = require('path');
// const _ = require('lodash');
const fs = require('fs');
// const proxy = require('http-proxy-middleware');
// const Config = require('config');
const express = require('express');
// const favicon = require('serve-favicon');
const noDevelop = process.env.NODE_ENV !== 'develop';
const resolve = file => path.resolve(__dirname, file);

const app = express();

const server = require('http').createServer(app);

const serve = (_path, cache) => express.static(resolve(_path), {
  maxAge: cache ? '30d' : 0,
  setHeaders: (res, path) => {
    const type = express.static.mime.lookup(path);
    // 设置缓存策略
    if (type === 'text/html') {
      res.setHeader('Cache-Control', 'public, max-age=0');
    } else if (type === 'image/png' || type === 'image/jpg') {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
});


let tempHTML;
if (!noDevelop) {
  const setupDevServer = require('./build/dev-server');
  setupDevServer(app, {
    templateUpdated: (template) => {
      tempHTML = template;
    }
  });
} else {
  tempHTML = fs.readFileSync(resolve('./dist/index.html'), 'utf-8');
}


// app.use(favicon(resolve('static/favicon.ico')));
app.use('/dist', express.static('./dist'))
app.use('/static', express.static('./static'));


// app.use(favicon(resolve('static/favicon.ico')));
// app.use('/', serve('./dist', true));

app.get('/', (req, res) => {
  // 协商缓存
  res.set('maxAge', 0);
  res.send(tempHTML);
});

const port = 8019;
server.listen(port, function(){
  console.log('listening on *:', port);
});
