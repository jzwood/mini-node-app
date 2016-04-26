module.exports = {
  entry: [
    "./src/js/frontend/main.js",
  ],
  output: {
    path: __dirname,
    filename: "src/js/bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel' },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' }
    ]
  }
}
