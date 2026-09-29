const headerSeparator = Buffer.from('\r\n\r\n')
const contentLengthRegex = /(?:^|\r\n)Content-Length:\s*(\d+)/i

export class LanguageServerMessageParser {
  private buffer = Buffer.alloc(0)

  push(chunk: Buffer): readonly unknown[] {
    this.buffer = Buffer.concat([this.buffer, chunk])
    const messages: unknown[] = []
    while (true) {
      const headerEnd = this.buffer.indexOf(headerSeparator)
      if (headerEnd === -1) {
        break
      }
      const header = this.buffer.subarray(0, headerEnd).toString('ascii')
      const match = contentLengthRegex.exec(header)
      if (!match) {
        throw new Error('Language server message is missing Content-Length')
      }
      const contentLength = Number(match[1])
      const contentStart = headerEnd + headerSeparator.length
      const contentEnd = contentStart + contentLength
      if (this.buffer.length < contentEnd) {
        break
      }
      const content = this.buffer.subarray(contentStart, contentEnd).toString('utf8')
      this.buffer = this.buffer.subarray(contentEnd)
      messages.push(JSON.parse(content))
    }
    return messages
  }
}
