import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

const { registerCompletionProvider, executeCompletionProvider, executeresolveCompletionItemProvider } = Registry.create({
  name: 'Completion',
  resultShape: {
    type: Types.Array,
    items: {
      type: Types.Object,
    },
  },
  additionalMethodNames: [
    // @ts-ignore
    {
      name: 'resolveCompletionItem',
      methodName: 'resolveCompletionItem',
      resultShape: {
        type: Types.Object,
        allowUndefined: true,
      },
    },
  ],
})

export { registerCompletionProvider, executeCompletionProvider, executeresolveCompletionItemProvider }
