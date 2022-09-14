import VError from 'verror'

export class FileNotFoundError extends VError {
  constructor(path) {
    super(`File not found '${path}'`)
    this.name = 'FileNotFoundError'
  }
}
