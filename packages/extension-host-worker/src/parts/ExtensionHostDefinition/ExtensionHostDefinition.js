import * as Registry from '../Registry/Registry.js'

const { registerDefinitionProvider, executeDefinitionProvider, reset } =
  Registry.create({
    name: 'Definition',
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

export { registerDefinitionProvider, executeDefinitionProvider, reset }
