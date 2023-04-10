import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

const { registerTypeDefinitionProvider, executeTypeDefinitionProvider, reset } = Registry.create({
  name: 'TypeDefinition',
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

export { registerTypeDefinitionProvider, executeTypeDefinitionProvider, reset }
