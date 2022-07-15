import * as Registry from '../Registry/Registry.js'

const { registerReferenceProvider, executeReferenceProvider } = Registry.create(
  {
    name: 'Reference',
    resultShape: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
  }
)

export { registerReferenceProvider, executeReferenceProvider }
