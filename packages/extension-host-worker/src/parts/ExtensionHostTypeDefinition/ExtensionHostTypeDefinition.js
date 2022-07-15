import * as Registry from '../Registry/Registry.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'

const { registerTypeDefinitionProvider, executeTypeDefinitionProvider } =
  Registry.create({
    name: 'TypeDefinition',
    resultShape: {
      type: 'object',
      properties: {
        uri: {
          type: 'string',
        },
        startOffset: {
          type: 'number',
        },
        endOffset: {
          type: 'number',
        },
      },
    },
  })

export { registerTypeDefinitionProvider, executeTypeDefinitionProvider }
