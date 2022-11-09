import * as Registry from '../Registry/Registry.js'

const { registerFormattingProvider, executeFormattingProvider, reset } =
  Registry.create({
    name: 'Formatting',
    resultShape: {
      allowUndefined: true,
      type: 'string',
    },
  })

export { registerFormattingProvider, executeFormattingProvider, reset }
