import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

const { registerSelectionProvider, executeSelectionProvider, reset } = Registry.create({
  name: 'Selection',
  resultShape: {
    allowUndefined: true,
    type: Types.Array,
    properties: {},
  },
})

export { executeSelectionProvider, registerSelectionProvider, reset }
