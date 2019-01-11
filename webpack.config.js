const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  module: {
    rules: [
      { 
        test: /\.css$/,
        use: ["style-loader", "css-loader"] 
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /(node_modules|bower_components)/,
        use: ["babel-loader"]
      },
      { test: /\.tsx&$/, use: "ts-loader", exclude: /node_modules/ },
      {
        test: /\.svg$/,
        use: ["babel-loader", "svg-react-loader"]
      }
    ]
  },
  resolve: { extensions: [".tsx", ".ts", ".js", ".jsx", ".svg"] },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};
