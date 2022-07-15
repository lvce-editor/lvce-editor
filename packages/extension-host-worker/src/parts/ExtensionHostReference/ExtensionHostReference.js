import * as Registry from '../Registry/Registry.js'

const { registerReferenceProvider, executeReferenceProvider, reset } =
  Registry.create({
    name: 'Reference',
    resultShape: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
  })

export { registerReferenceProvider, executeReferenceProvider, reset }
