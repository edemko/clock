const path = require("path")

module.exports = {
    mode: 'production',
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "site")
    },
    resolve: {
        modules: [ path.resolve("./src") ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"], // TODO load polyfills for the browser
                    },
                },
            }
        ],
    },
    devtool: "source-map",
}
