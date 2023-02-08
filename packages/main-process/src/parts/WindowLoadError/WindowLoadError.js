const VError = require('verror')

exports.WindowLoadError = class extends VError {
  constructor(error, url) {
    super(error, `Failed to load url ${url}`)
    this.name = 'WindowLoadError'
  }
}
