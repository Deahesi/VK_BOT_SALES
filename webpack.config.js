const path = require('path');

module.exports = {
    entry: './src/index.js',
    target: 'node',
    resolve: {
        alias: {
            path: require.resolve("path-browserify")
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            { test: /\.cs$/, use: 'raw-loader' }, { test: /\.html$/, use: 'raw-loader' }
        ]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
