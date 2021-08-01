const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource'
      }
    ],
  },
  devServer: {
    contentBase: './dist'
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
}