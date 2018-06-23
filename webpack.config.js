const webpack = require('webpack')
const path = require('path')
const fileSystem = require('fs')
const env = require('./utils/env')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
var Crx = require('crx-webpack-plugin')

// load the secrets
const alias = {}

const secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js')

const AVAILABLE_PLUGINS = fileSystem
  .readdirSync(path.join(__dirname, 'src', 'plugins'))
  .filter(fileName => fileName.endsWith('.js'))
  .map(fileName => fileName.replace('.js', ''))

const fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
]

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath
}

const options = {
  mode: env.NODE_ENV,
  devtool: env.NODE_ENV === 'development' && 'cheap-module-eval-source-map',
  entry: {
    popup: path.join(__dirname, 'src', 'popup.js'),
    options: path.join(__dirname, 'src', 'options.js'),
    eventPage: path.join(__dirname, 'src', 'eventPage.js'),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        exclude: /node_modules/,
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: 'file-loader?name=[name].[ext]',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./src'), 'node_modules'],
    extensions: fileExtensions
      .map(extension => '.' + extension)
      .concat(['.jsx', '.js', '.css']),
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(['build']),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      'process.env.AVAILABLE_PLUGINS': JSON.stringify(AVAILABLE_PLUGINS),
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
      'process.env.VERSION': JSON.stringify(process.env.npm_package_version),
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.json',
        transform: function(content, path) {
          let manifest = {
            description: process.env.npm_package_description,
            version: process.env.npm_package_version,
            ...JSON.parse(content.toString()),
            content_security_policy:
              env.NODE_ENV === 'development'
                ? "script-src 'self' 'unsafe-eval' https://cdn.ravenjs.com; object-src 'self'"
                : "script-src 'self' https://cdn.ravenjs.com; object-src 'self'",
          }
          if (process.env.EXT_ENV === 'crx') {
            manifest = {
              ...manifest,
              update_url: 'http://myhost.com/mytestextension/updates.xml',
            }
          }
          return Buffer.from(JSON.stringify(manifest))
        },
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'template.html.ejs'),
      title: 'Tabulous',
      env: env.NODE_ENV,
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'template.html.ejs'),
      title: 'Tabulous Options',
      env: env.NODE_ENV,
      filename: 'options.html',
      chunks: ['options'],
    }),
    new WriteFilePlugin(),
  ],
}

if (process.env.EXT_ENV === 'crx') {
  options.plugins.push(
    new Crx({
      keyFile: path.join(__dirname, 'tabulous.pem'),
      contentPath: 'build',
      outputPath: __dirname,
      name: 'tabulous',
    })
  )
}

module.exports = options
