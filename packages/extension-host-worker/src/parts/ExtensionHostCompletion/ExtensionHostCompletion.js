import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

const { registerCompletionProvider, executeCompletionProvider } = Registry.create({
  name: 'Completion',
  resultShape: {
    type: Types.Array,
    items: {
      type: Types.Object,
    },
  },
})

export { registerCompletionProvider, executeCompletionProvider }
