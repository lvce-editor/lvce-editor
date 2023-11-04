const Platform = require('../Platform/Platform.cjs')
const Authority = require('../Authority/Authority.cjs')

exports.defaultUrl = `${Platform.scheme}://${Authority.authority}/`
