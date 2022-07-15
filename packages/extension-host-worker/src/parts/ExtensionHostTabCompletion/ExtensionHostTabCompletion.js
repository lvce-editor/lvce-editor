import * as Registry from '../Registry/Registry.js'

const { registerTabCompletionProvider, executeTabCompletionProvider, reset } =
  Registry.create({
    name: 'TabCompletion',
    resultShape: {
      type: 'object',
    },
  })

export { registerTabCompletionProvider, executeTabCompletionProvider, reset }
