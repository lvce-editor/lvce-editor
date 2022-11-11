import * as Registry from '../Registry/Registry.js'

const { registerFormattingProvider, executeFormattingProvider, reset } =
  Registry.create({
    name: 'Formatting',
    executeKey: 'format',
    resultShape: {
      allowUndefined: true,
      type: 'array',
      items: {
        type: 'object',
        properties: {
          startOffset: {
            type: 'number',
          },
          endOffset: {
            type: 'number',
          },
          inserted: {
            type: 'string',
          },
        },
      },
    },
  })

export { registerFormattingProvider, executeFormattingProvider, reset }
