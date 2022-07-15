import * as Registry from '../Registry/Registry.js'

const { registerImplementationProvider, executeImplementationProvider } =
  Registry.create({
    name: 'Implementation',
    resultShape: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
  })

export { registerImplementationProvider, executeImplementationProvider }
