import * as Registry from '../Registry/Registry.js'

const { registerBraceCompletionProvider, executeBraceCompletionProvider } =
  Registry.create({
    name: 'BraceCompletion',
    resultShape: {
      type: 'boolean',
    },
  })

export { registerBraceCompletionProvider, executeBraceCompletionProvider }
