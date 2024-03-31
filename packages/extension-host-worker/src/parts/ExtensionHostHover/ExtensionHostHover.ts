import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

const { registerHoverProvider, executeHoverProvider, reset } = Registry.create({
  name: 'Hover',
  resultShape: {
    allowUndefined: true,
    type: Types.Object,
    properties: {},
  },
})

export { registerHoverProvider, executeHoverProvider, reset }
