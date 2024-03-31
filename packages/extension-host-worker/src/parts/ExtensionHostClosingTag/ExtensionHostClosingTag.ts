import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { registerClosingTagProvider, executeClosingTagProvider } = Registry.create({
  name: 'ClosingTag',
  returnUndefinedWhenNoProviderFound: true,
  resultShape: {
    type: Types.Object,
    allowUndefined: true,
  },
})

export { registerClosingTagProvider, executeClosingTagProvider }
