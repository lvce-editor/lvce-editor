export class IpcError extends Error {
  constructor(message: any) {
    super(message)
    this.name = 'IpcError'
  }
}
