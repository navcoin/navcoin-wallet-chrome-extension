const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const DIST = path.resolve(__dirname, 'dist')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        libraryTarget: 'umd',
        library:'umd',
        path: DIST,
        publicPath: DIST,
    },
    devServer: {
        compress: false,
        open: true,
        hot: true,
        inline: true,
        publicPath: '/',
        contentBase: DIST,
        port: 9011,
        writeToDisk: true,
        disableHostCheck: true,
        headers: {'Access-Control-Allow-Origin': '*'},
        watchOptions: {
            poll: 1000,
        },        
    },
    module: {
        rules: [
            {
              test: /\.vue$/,
              loader: 'vue-loader'
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
              }
            }
        ],
    },
    plugins: [
    new NodePolyfillPlugin(),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new CopyPlugin({
            patterns: [
                {
                    flatten: true,
                    from: './src/*',
                    globOptions: {
                        ignore: ['**/*.js'],
                    },
                },
                {
                    from: 'static/'
                }
            ],
        }),
    ],
    resolve: {
    fallback: {
        net: false,
            tls: false
        },
    }
}