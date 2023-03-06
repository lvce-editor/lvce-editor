import * as Registry from '../Registry/Registry.js'

const { registerClosingTagProvider, executeClosingTagProvider } = Registry.create({
  name: 'ClosingTag',
  resultShape: {
    type: 'object',
    allowUndefined: true,
  },
})

export { registerClosingTagProvider, executeClosingTagProvider }
