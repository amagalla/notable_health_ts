const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = (enviroVar) => {
  const { env } = enviroVar;
  const envConfig = require(`./webpack.${env}.js`);
  const config = merge(commonConfig, envConfig);
  return config;
};
