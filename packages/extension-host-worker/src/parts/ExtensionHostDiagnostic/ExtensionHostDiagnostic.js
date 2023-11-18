import * as Registry from '../Registry/Registry.js'
import * as Types from '../Types/Types.js'

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
