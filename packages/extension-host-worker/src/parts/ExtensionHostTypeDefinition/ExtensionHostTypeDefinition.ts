import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

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
