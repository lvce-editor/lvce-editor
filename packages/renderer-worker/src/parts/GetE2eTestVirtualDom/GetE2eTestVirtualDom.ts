import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getE2eTestVirtualDom = (content: any) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet E2eTest',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'E2eTestPreview',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'E2eTestIframeWrapper',
      childCount: 0,
    },
  ]
}
