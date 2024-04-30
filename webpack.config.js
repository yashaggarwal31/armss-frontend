const webpack = require("webpack");
const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        entry1: "./src/login.html",
        home: "./src/index.html",
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        allowedHosts: "all",
        static: {
            directory: path.resolve(__dirname, "./dist"), // Serve files from the 'dist' directory
        },
        port: 4000, // Specify a port number

        hot: false,
        liveReload: true,
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                // loader: "html-loader",
                use: ["html-loader"],
            },
            // {
            //   test: /\.(png|jpe?g|gif)$/i,
            //   use: [
            //     {
            //       loader: "file-loader",
            //     },
            //   ],
            // },
        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            title: "login",
            template: "./src/login.html", // Path to your HTML template
            filename: "login.html", // Output HTML file name
            inject: false,
        }),
        new htmlWebpackPlugin({
            title: "index.html",
            template: "./src/index.html", // Path to another HTML template
            filename: "index.html", // Output HTML file name
            inject: false,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
};