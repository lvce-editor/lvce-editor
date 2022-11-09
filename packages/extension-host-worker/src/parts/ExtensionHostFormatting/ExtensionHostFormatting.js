import * as Registry from '../Registry/Registry.js'

const { registerFormattingProvider, executeFormattingProvider, reset } =
  Registry.create({
    name: 'Formatting',
    executeKey: 'format',
    resultShape: {
      allowUndefined: true,
      type: 'string',
    },
  })

export { registerFormattingProvider, executeFormattingProvider, reset }
