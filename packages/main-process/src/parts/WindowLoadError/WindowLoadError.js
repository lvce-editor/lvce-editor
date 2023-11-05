import { VError } from '../VError/VError.js'

export class WindowLoadError extends VError {
  constructor(error, url) {
    super(error, `Failed to load url ${url}`)
    this.name = 'WindowLoadError'
  }
}
