import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

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
