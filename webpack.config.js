const webpack = require("webpack");
const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        login: "./src/index.html",
        welcome: "./src/welcome.html",
        resumeDisplay: "./src/resumeDisplay.html",
        data: './src/data.html'

    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: '/',
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
            title: "index.html",
            template: "./src/index.html", // Path to another HTML template
            filename: "index.html", // Output HTML file name
            inject: false,
        }),
        new htmlWebpackPlugin({
            title: "welcome.html",
            template: "./src/welcome.html", // Path to another HTML template
            filename: "welcome.html", // Output HTML file name
            inject: false,
        }),
        new htmlWebpackPlugin({
            title: "resumeDisplay.html",
            template: "./src/resumeDisplay.html", // Path to another HTML template
            filename: "resumeDisplay.html", // Output HTML file name
            inject: false,
        }),
        new htmlWebpackPlugin({
            title: "data.html",
            template: "./src/data.html", // Path to another HTML template
            filename: "data.html", // Output HTML file name
            inject: false,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
};