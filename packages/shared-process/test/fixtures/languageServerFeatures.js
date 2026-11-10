import { LanguageServerMessageParser } from '../../src/parts/LanguageServerMessageParser/LanguageServerMessageParser.ts'

const parser = new LanguageServerMessageParser()
const documents = new Map()
process.stdin.on('data', (chunk) => {
  for (const message of /** @type {any[]} */ (parser.push(Buffer.from(chunk)))) {
    let result
    if (message.method === 'initialize') {
      result = {
        capabilities: {
          hoverProvider: true,
          implementationProvider: true,
          renameProvider: { prepareProvider: true },
          signatureHelpProvider: {},
          typeDefinitionProvider: true,
        },
      }
    } else if (message.method === 'textDocument/didOpen' || message.method === 'textDocument/didChange') {
      documents.set(message.params.textDocument.uri, message.params.textDocument.text || message.params.contentChanges[0].text)
      continue
    } else if (message.method?.startsWith('textDocument/')) {
      result = { method: message.method, params: message.params, text: documents.get(message.params.textDocument.uri) }
    } else {
      continue
    }
    const body = JSON.stringify({ id: message.id, jsonrpc: '2.0', result })
    process.stdout.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`)
  }
})
