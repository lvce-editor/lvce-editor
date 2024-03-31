import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

const { registerReferenceProvider, executeReferenceProvider, executefileReferenceProvider, reset } = Registry.create({
  name: 'Reference',
  resultShape: {
    type: Types.Array,
    items: {
      type: Types.Object,
    },
  },
  additionalMethodNames: [
    // @ts-ignore
    {
      name: 'fileReference',
      methodName: 'provideFileReferences',
      resultShape: {
        type: Types.Array,
        items: {
          type: Types.Object,
        },
      },
    },
  ],
})

export { registerReferenceProvider, executeReferenceProvider, executefileReferenceProvider, reset }
