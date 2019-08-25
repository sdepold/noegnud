const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const isProduction = process.env.npm_lifecycle_event === "build";

module.exports = {
  entry: "./src",
  devtool: !isProduction && "source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader"
        }
      },
      // { test: /\.gif$/, use: ["file-loader"] },

      {
        test: /\.gif$/,
        use: 'base64-inline-loader?limit=10000&name=[name].[ext]'
    }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      minify: isProduction && {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      inlineSource: isProduction && "\.(js|css)$"
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new OptimizeCssAssetsPlugin({}),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ],
  devServer: {
    stats: "minimal",
    overlay: true
  }
};
