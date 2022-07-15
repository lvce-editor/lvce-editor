import * as Registry from '../Registry/Registry.js'

const { registerTypeDefinitionProvider, executeTypeDefinitionProvider, reset } =
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

export { registerTypeDefinitionProvider, executeTypeDefinitionProvider, reset }
