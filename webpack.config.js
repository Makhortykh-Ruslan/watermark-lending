// webpack.config.js
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    const isDev = (argv.mode || 'development') === 'development';

    return {
        mode: isDev ? 'development' : 'production',
        entry: {
            index: './js/dev/index.js',
            app: './js/dev/app.js',
            download: './js/dev/download.js'
        },
        output: {
            filename: 'js/[name].min.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '',
            clean: true,
        },
        devtool: isDev ? 'eval-cheap-module-source-map' : false,
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
            rules: [

            ],
        },
        devServer: {
            static: { directory: path.join(__dirname, 'dist') },
            port: 3000,
            open: true,
            hot: true,
            watchFiles: ['*.html', 'css/**/*.css', 'assets/**/*'],
        },
    };
};
