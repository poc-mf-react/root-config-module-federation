const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const outputPath = path.resolve(__dirname, "dist");

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "poc-mf-react";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object

    entry: "./src/index.ejs",
    cache: false,

    mode: "development",
    devtool: "source-map",

    optimization: {
      minimize: false,
    },

    output: {
      filename: "main.js",
      publicPath: "http://localhost:9000/",
    },

    resolve: {
      extensions: [".jsx", ".js", ".json", ".ts", ".tsx"],
    },

    devServer: {
      static: outputPath,
    },

    module: {
      rules: [
        {
          test: /\.ejs$/,
          use: [
            {
              loader: "ejs-webpack-loader",
            },
          ],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "root",
        library: { type: "var", name: "root" },
        filename: "remoteEntry.js",
        remotes: {
          "home-nav": "navigation",
        },
        exposes: {},
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
      }),
    ],
  });
};
