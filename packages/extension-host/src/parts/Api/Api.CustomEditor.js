import { ow } from './_shared.js'

export const state = {
  customEditorProviders: Object.create(null),
}

export const registerCustomEditorProvider = (customEditorProvider) => {
  ow(
    customEditorProvider,
    ow.object.partialShape({
      id: ow.string,
    })
  )
  state.customEditorProviders[customEditorProvider.id] = customEditorProvider
}
