import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

const { registerImplementationProvider, executeImplementationProvider, reset } = Registry.create({
  name: 'Implementation',
  resultShape: {
    type: Types.Array,
    items: {
      type: Types.Object,
    },
  },
})

export { registerImplementationProvider, executeImplementationProvider, reset }
