import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

const { registerDefinitionProvider, executeDefinitionProvider, reset } = Registry.create({
  name: 'Definition',
  resultShape: {
    allowUndefined: true,
    type: Types.Object,
    properties: {
      uri: {
        type: Types.String,
      },
      startOffset: {
        type: Types.Number,
      },
      endOffset: {
        type: Types.Number,
      },
    },
  },
})

export { registerDefinitionProvider, executeDefinitionProvider, reset }
