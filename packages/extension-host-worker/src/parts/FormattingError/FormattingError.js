export class FormattingError extends Error {
  constructor(message, codeFrame) {
    super(message)
    this.codeFrame = codeFrame
    this.name = 'FormattingError'
  }
}
