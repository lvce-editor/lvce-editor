import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getVirtualDom = () => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: 'DebugConsoleTop',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'DebugConsoleBottom',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Input,
      className: 'InputBox',
      onInput: 'handleInput',
      childCount: 0,
    },
  )
  return dom
}
