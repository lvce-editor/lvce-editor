import * as Registry from '../Registry/Registry.js'

export const createApi = ({ textDocumentRegistry }) => {
  return Registry.create({
    textDocumentRegistry,
    name: 'BraceCompletion',
    resultShape: {
      type: 'boolean',
    },
  })
}
