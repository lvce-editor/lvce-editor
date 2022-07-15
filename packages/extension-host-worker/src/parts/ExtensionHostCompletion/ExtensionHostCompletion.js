import * as Registry from '../Registry/Registry.js'

const { registerCompletionProvider, executeCompletionProvider } =
  Registry.create({
    name: 'Completion',
    resultShape: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
  })

export { registerCompletionProvider, executeCompletionProvider }
