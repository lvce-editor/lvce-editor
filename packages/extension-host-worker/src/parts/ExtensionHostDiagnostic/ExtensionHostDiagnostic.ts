import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { registerDiagnosticProvider, executeDiagnosticProvider } = Registry.create({
  name: 'Diagnostic',
  resultShape: {
    type: Types.Array,
    items: {
      type: Types.Object,
    },
  },
})

export { executeDiagnosticProvider, registerDiagnosticProvider }
