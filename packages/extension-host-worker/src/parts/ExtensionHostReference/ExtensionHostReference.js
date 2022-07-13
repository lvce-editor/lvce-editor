import * as Registry from '../Registry/Registry.js'

export const createApi = ({ textDocumentRegistry }) => {
  return Registry.create({
    textDocumentRegistry,
    name: 'Reference',
    resultShape: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
  })
}
