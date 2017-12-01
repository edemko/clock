const path = require('path')

module.exports = {
    entry: './src/blah.es6',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
