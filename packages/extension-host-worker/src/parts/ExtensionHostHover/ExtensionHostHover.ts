import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { registerHoverProvider, executeHoverProvider, reset } = Registry.create({
  name: 'Hover',
  resultShape: {
    allowUndefined: true,
    type: Types.Object,
    properties: {},
  },
})

export { registerHoverProvider, executeHoverProvider, reset }
