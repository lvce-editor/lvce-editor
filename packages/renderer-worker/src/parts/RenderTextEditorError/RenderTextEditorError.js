import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const renderTextEditorError = (error) => {
  // TODO
  // 1. render icon
  // 2. render error message
  // 3. render error actions
  const errorString = `${error}`
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet Error',
      childCount: 1,
    },
    text(errorString),
  ]
}
