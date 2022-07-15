import * as Registry from '../Registry/Registry.js'

const { registerImplementationProvider, executeImplementationProvider, reset } =
  Registry.create({
    name: 'Implementation',
    resultShape: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
  })

export { registerImplementationProvider, executeImplementationProvider, reset }
