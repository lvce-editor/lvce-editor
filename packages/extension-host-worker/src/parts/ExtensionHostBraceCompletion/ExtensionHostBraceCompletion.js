import * as Registry from '../Registry/Registry.js'

const {
  registerBraceCompletionProvider,
  executeBraceCompletionProvider,
  reset,
} = Registry.create({
  name: 'BraceCompletion',
  resultShape: {
    type: 'boolean',
  },
})

export {
  registerBraceCompletionProvider,
  executeBraceCompletionProvider,
  reset,
}
