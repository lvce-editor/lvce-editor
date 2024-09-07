import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

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
