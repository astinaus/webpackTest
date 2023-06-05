const path = require('path'); // 운영체제별로 상이한 경로 문법을 해결해 절대 경로로 변환하는 역할을 합니다.
const webpack = require('webpack');
const childProcess = require('child_process');
require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: {
    main: path.resolve('./src/app.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve('dist'),
  },
  module: {
    rules: [
      {
        // test: /\.js$/, // .js 확장자로 끝나는 모든 파일
        // use: [
        //   {
        //     loader: path.resolve('./myLoader.js'), // myLoader.js를 적용한다.
        //   },
        // ],
        test: /\.css$/, // .css 확장자로 끝나는 모든 파일
        use: ['style-loader', 'css-loader'],
      },
      {
        // 여기 추가합니다.
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024, // 4kb 미만 파일만 data url로 처리합니다.
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
    Commit version : ${childProcess.execSync('git rev-parse --short HEAD')}
    Committer : ${childProcess.execSync('git config user.name')}
    Commit Date : ${new Date().toLocaleString()}
`,
    }),
    new webpack.DefinePlugin({
      dev: JSON.stringify(process.env.DEV_API),
      pro: JSON.stringify(process.env.PRO_API),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html', // 목표 html 파일의 위치입니다.
    }),
    new CleanWebpackPlugin(),
  ],
};
