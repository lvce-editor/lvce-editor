const headerSeparator = Buffer.from('\r\n\r\n')
let buffer = Buffer.alloc(0)
const documents = new Map()

/** @param {any} message */
const send = (message) => {
  const content = JSON.stringify(message)
  process.stdout.write(`Content-Length: ${Buffer.byteLength(content)}\r\n\r\n${content}`)
}

/** @param {any} message */
const handleMessage = (message) => {
  if (message.method === 'initialize') {
    send({ id: message.id, jsonrpc: '2.0', result: { capabilities: { completionProvider: {}, textDocumentSync: 1 } } })
    return
  }
  if (message.method === 'textDocument/didOpen') {
    documents.set(message.params.textDocument.uri, message.params.textDocument.text)
    return
  }
  if (message.method === 'textDocument/didChange') {
    documents.set(message.params.textDocument.uri, message.params.contentChanges[0].text)
    return
  }
  if (message.method === 'textDocument/completion') {
    const text = documents.get(message.params.textDocument.uri)
    send({
      id: message.id,
      jsonrpc: '2.0',
      result: {
        items: [{ insertText: 'fixtureCompletion', kind: 6, label: `fixtureCompletion:${text}` }],
      },
    })
  }
}

process.stdin.on('data', (chunk) => {
  const data = typeof chunk === 'string' ? Buffer.from(chunk) : chunk
  buffer = Buffer.concat([buffer, data])
  while (true) {
    const headerEnd = buffer.indexOf(headerSeparator)
    if (headerEnd === -1) {
      return
    }
    const header = buffer.subarray(0, headerEnd).toString('ascii')
    const match = /Content-Length:\s*(\d+)/i.exec(header)
    if (!match) {
      throw new Error('Missing Content-Length')
    }
    const contentLength = Number(match[1])
    const contentStart = headerEnd + headerSeparator.length
    const contentEnd = contentStart + contentLength
    if (buffer.length < contentEnd) {
      return
    }
    const message = JSON.parse(buffer.subarray(contentStart, contentEnd).toString('utf8'))
    buffer = buffer.subarray(contentEnd)
    handleMessage(message)
  }
})
