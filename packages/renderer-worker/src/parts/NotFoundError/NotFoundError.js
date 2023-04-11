export class NotFoundError extends Error {
  constructor(url) {
    super(`Failed to import ${url}: Not found (404)`)
    this.name = 'NotFoundError'
  }
}
