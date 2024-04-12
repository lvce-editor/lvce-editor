import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { registerRenameProvider, executeRenameProvider, executeprepareRenameProvider, reset } = Registry.create({
  name: 'Rename',
  resultShape: {
    type: Types.Object,
    allowUndefined: true,
  },
  additionalMethodNames: [
    // @ts-ignore
    {
      name: 'prepareRename',
      methodName: 'prepareRename',
      resultShape: {
        type: Types.Object,
        allowUndefined: true,
      },
    },
  ],
})

export { registerRenameProvider, executeRenameProvider, executeprepareRenameProvider, reset }
