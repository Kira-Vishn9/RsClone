const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EslingPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'inline-source-map' : undefined;
module.exports = {
    mode,
    target,
    devtool,
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 3000,
        // historyApiFallback: true,
        // contentBase: './src',
        compress: true,
        open: false,
        hot: true,
        client: {
            progress: true,
            overlay: {
                errors: true,
                warnings: false,
            },
        },
    },
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
        filename: '[name].js',
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'main.css',
        }),
        new EslingPlugin({
            overrideConfigFile: './.eslintrc.json',
            extensions: ['ts', 'js'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, './src/shared/Assets/icon'), to: './assets/icon/' },
                { from: path.resolve(__dirname, './src/shared/Assets/image'), to: './assets/image/' },
                { from: path.resolve(__dirname, './src/shared/Assets/svg'), to: './assets/svg/' },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    'postcss-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        'postcss-preset-env',
                                        {
                                            // Options
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    },
};
