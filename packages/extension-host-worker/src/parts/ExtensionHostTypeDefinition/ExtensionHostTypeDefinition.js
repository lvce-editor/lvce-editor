import * as Registry from '../Registry/Registry.js'

export const createApi = ({ textDocumentRegistry }) => {
  return Registry.create({
    textDocumentRegistry,
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
}
