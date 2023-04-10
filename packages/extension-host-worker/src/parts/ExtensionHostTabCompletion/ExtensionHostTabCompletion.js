import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

const { registerTabCompletionProvider, executeTabCompletionProvider, reset } = Registry.create({
  name: 'TabCompletion',
  resultShape: {
    type: Types.Object,
    allowUndefined: true,
  },
})

export { registerTabCompletionProvider, executeTabCompletionProvider, reset }
