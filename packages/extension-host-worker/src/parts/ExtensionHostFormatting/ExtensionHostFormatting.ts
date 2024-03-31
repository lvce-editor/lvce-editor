import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { registerFormattingProvider, executeFormattingProvider, reset } = Registry.create({
  name: 'Formatting',
  executeKey: 'format',
  resultShape: {
    allowUndefined: true,
    type: Types.Array,
    items: {
      type: Types.Object,
      properties: {
        startOffset: {
          type: Types.Number,
        },
        endOffset: {
          type: Types.Number,
        },
        inserted: {
          type: Types.String,
        },
      },
    },
  },
})

export { registerFormattingProvider, executeFormattingProvider, reset }
