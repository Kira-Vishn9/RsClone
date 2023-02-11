const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EslingPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;
module.exports = {
	mode,
	target,
	devtool,
	devServer: {
		port: 3000,
		historyApiFallback: true,
		contentBase: "./src",
	},
    entry: path.resolve(__dirname, './src/index.ts'),
	output: {
		filename: '[name].js',
		publicPath: "/",
		path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[hash][ext][query]', // output dir for assets
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
        new CopyWebpackPlugin({
            patterns: [
              { from: path.resolve(__dirname, './src/shared/Assets/icon/'), to: './assets/' },
              { from: path.resolve(__dirname, './src/shared/Assets/image/'), to: './assets/' },
              { from: path.resolve(__dirname, './src/shared/Assets/svg/'), to: './assets/' },
            ]}),
		new MiniCssExtractPlugin({
			filename: 'main.css',
		}),
        new EslingPlugin({ extensions: 'ts' }), 
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