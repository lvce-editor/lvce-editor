import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { registerTabCompletionProvider, executeTabCompletionProvider, reset } = Registry.create({
  name: 'TabCompletion',
  resultShape: {
    type: Types.Object,
    allowUndefined: true,
  },
})

export { registerTabCompletionProvider, executeTabCompletionProvider, reset }
