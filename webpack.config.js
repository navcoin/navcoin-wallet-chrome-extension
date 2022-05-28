const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

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
        contentBase: DIST,
        port: 9011,
        writeToDisk: true,
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
        ],
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        // for build scripts
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
    "node": { "fs": "empty" }
}