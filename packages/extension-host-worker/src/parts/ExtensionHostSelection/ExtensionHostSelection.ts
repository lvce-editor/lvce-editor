import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { registerSelectionProvider, executeSelectionProvider, reset } = Registry.create({
  name: 'Selection',
  resultShape: {
    allowUndefined: true,
    type: Types.Array,
    items: {
      type: 'number',
    },
  },
})

export { executeSelectionProvider, registerSelectionProvider, reset }
