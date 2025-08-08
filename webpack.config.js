const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        index: './js/dev/index.js',
        app: './js/dev/app.js',
        download: './js/dev/download.js',
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'assets', to: 'assets' },
                { from: 'css', to: 'css' },
                { from: '*.html', to: '[name][ext]' },
            ],
        }),
    ],
    module: {
        rules: [],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 3000,
        open: true,
    }

};
