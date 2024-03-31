export class FormattingError extends Error {
  constructor(message, codeFrame) {
    super(message)
    // @ts-ignore
    this.codeFrame = codeFrame
    this.name = 'FormattingError'
  }
}
