const headerSeparator = Buffer.from('\r\n\r\n')
let buffer = Buffer.alloc(0)
let rootUri = ''

/** @param {any} message */
const send = (message) => {
  const content = JSON.stringify(message)
  process.stdout.write(`Content-Length: ${Buffer.byteLength(content)}\r\n\r\n${content}`)
}

/** @param {string} uri @param {string} text */
const publishDiagnostics = (uri, text) => {
  const publishedUri = process.argv.includes('--uppercase-windows-uri')
    ? uri.replace(/^file:\/\/\/([a-z])(?::|%3A)/i, (_, driveLetter) => `file:///${driveLetter.toUpperCase()}:`)
    : uri
  const diagnostics =
    text === 'valid'
      ? []
      : [
          {
            message: `fixtureDiagnostic:${text}:${rootUri}`,
            range: {
              end: { character: 3, line: 0 },
              start: { character: 0, line: 0 },
            },
            severity: 2,
          },
        ]
  send({
    jsonrpc: '2.0',
    method: 'textDocument/publishDiagnostics',
    params: {
      diagnostics,
      uri: publishedUri,
    },
  })
}

/** @param {any} message */
const handleMessage = (message) => {
  if (message.method === 'initialize') {
    rootUri = message.params.rootUri
    send({ id: message.id, jsonrpc: '2.0', result: { capabilities: { textDocumentSync: 1 } } })
    return
  }
  if (message.method === 'textDocument/didOpen') {
    publishDiagnostics(message.params.textDocument.uri, message.params.textDocument.text)
    return
  }
  if (message.method === 'textDocument/didChange') {
    publishDiagnostics(message.params.textDocument.uri, message.params.contentChanges[0].text)
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
