const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const babelConfig = require('./getBabelConfig')(false)

module.exports = {
  mode: 'development',
  entry: {
    'vue-component-preview': path.join(__dirname, '../site/index.js')<$ if (platform === 'h5') { $>,
    'vue-component-preview-mobile': path.join(__dirname, '../site/mobile.js')<$ } $>
  },
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/',
    chunkFilename: 'async_[name].js'
  },
  stats: {
    modules: false,
    children: false
  },
  devServer: {
    open: false,
    port: <$=port$>,
    historyApiFallback: {
      rewrites: [
        { from: /^\/mobile.html/, to: '/mobile.html' },
        { from: /./, to: '/index.html' },
      ],
    },
    host: '0.0.0.0'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.vue', '.css'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      components: path.join(__dirname, '../components')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          }
        ]
      },
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('autoprefixer')({
                  browsers: ['Android >= 4.0', 'iOS >= 7']
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('autoprefixer')({
                  browsers: ['Android >= 4.0', 'iOS >= 7']
                })
              ]
            }
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              paths: [path.resolve(__dirname, 'node_modules')]
            }
          }
        ]
      },
      {
        test: /\.md$/,
        use: [
          'vue-loader',
          {
            loader: 'vcp-markdown-loader',
            options: {
              platform: '<$=platform$>'
            }
          }
        ]
      },
      {
        test: /\.(ttf|svg)$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      chunks: ['vue-component-preview'],
      template: path.join(__dirname, '../site/index.tpl'),
      filename: 'index.html',
      inject: true
    })<$ if (platform === 'h5') { $>,
    new HtmlWebpackPlugin({
      chunks: ['vue-component-preview-mobile'],
      template: path.join(__dirname, '../site/index.tpl'),
      filename: 'mobile.html',
      inject: true
    })<$ } $>
  ]
}
