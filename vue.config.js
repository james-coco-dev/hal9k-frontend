const path = require("path");
const isProduction = process.env.NODE_ENV === "production";
const CompressionPlugin = require("compression-webpack-plugin");
module.exports = {
  productionSourceMap: isProduction ? false : true,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.join(__dirname, "./src"),
      },
    },
  },
  chainWebpack(config) {
    if (!isProduction) return;
    config.plugin("CompressionPlugin").use(CompressionPlugin);
  },
};
