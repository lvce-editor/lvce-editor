import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

const { registerReferenceProvider, executeReferenceProvider, reset } = Registry.create({
  name: 'Reference',
  resultShape: {
    type: Types.Array,
    items: {
      type: Types.Object,
    },
  },
})

export { registerReferenceProvider, executeReferenceProvider, reset }
