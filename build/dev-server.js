const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.dev.conf');
const DevMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
console.log(webpackConfig.entry)
module.exports = function setupDevServer(app, opts) {
  webpackConfig.entry.app = ['webpack-hot-middleware/client', webpackConfig.entry.app];
  webpackConfig.output.filename = '[name].js';
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );

  const compiler = webpack(webpackConfig);
  const devMiddleware = DevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true, chunks: false }
  });
  app.use(devMiddleware);
  compiler.plugin('done', () => {
    const fs = devMiddleware.fileSystem;
    const filePath = path.join(webpackConfig.output.path, 'index.html');
    if (fs.existsSync(filePath)) {
      const template = fs.readFileSync(filePath, 'utf-8');
      opts.templateUpdated(template);
    }
  });
  app.use(hotMiddleware(compiler));
};
