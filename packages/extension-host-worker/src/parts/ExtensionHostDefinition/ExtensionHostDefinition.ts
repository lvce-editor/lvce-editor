import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

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
