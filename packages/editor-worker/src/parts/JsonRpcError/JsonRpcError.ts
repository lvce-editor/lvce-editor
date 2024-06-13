export class JsonRpcError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'JsonRpcError'
  }
}
