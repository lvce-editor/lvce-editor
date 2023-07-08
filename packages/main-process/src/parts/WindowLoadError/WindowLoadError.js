const { VError } = require('../VError/VError.js')

exports.WindowLoadError = class extends VError {
  constructor(error, url) {
    super(error, `Failed to load url ${url}`)
    this.name = 'WindowLoadError'
  }
}
