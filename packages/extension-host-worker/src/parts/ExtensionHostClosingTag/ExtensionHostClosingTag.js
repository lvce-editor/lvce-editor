import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

const { registerClosingTagProvider, executeClosingTagProvider } = Registry.create({
  name: 'ClosingTag',
  resultShape: {
    type: Types.Object,
    allowUndefined: true,
  },
})

export { registerClosingTagProvider, executeClosingTagProvider }
