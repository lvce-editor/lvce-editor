import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

const { registerBraceCompletionProvider, executeBraceCompletionProvider, reset } = Registry.create({
  name: 'BraceCompletion',
  resultShape: {
    type: Types.Boolean,
  },
})

export { registerBraceCompletionProvider, executeBraceCompletionProvider, reset }
