const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'index.web.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Regex to match image files
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]', // Output path for images
            },
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.web.json'
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-flow'],
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
    },
    extensions: ['.ts', '.tsx', '.web.js', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: true,
  },
};
