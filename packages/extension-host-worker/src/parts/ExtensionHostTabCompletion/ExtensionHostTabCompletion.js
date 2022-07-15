import * as Registry from '../Registry/Registry.js'

const { registerTabCompletionProvider, executeTabCompletionProvider } =
  Registry.create({
    name: 'TabCompletion',
    resultShape: {
      type: 'object',
    },
  })

export { registerTabCompletionProvider, executeTabCompletionProvider }
