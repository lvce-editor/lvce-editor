import * as HtmlInputType from '../HtmlInputType/HtmlInputType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getSimpleBrowserVirtualDom = (canGoBack, canGoForward, isLoading, value) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet SimpleBrowser',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SimpleBrowserHeader',
      childCount: 5,
    },
    {
      type: VirtualDomElements.Button,
      className: 'IconButton',
      childCount: 1,
      title: 'Back',
      onClick: 'handleClickBackward',
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconArrowLeft',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Button,
      className: 'IconButton',
      childCount: 1,
      title: 'Forward',
      onClick: 'handleClickForward',
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconArrowRight',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Button,
      className: 'IconButton',
      childCount: 1,
      title: 'Reload',
      onClick: 'handleClickReload',
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconRefresh',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Input,
      className: 'InputBox',
      inputType: HtmlInputType.Url,
      enterKeyHint: 'Go',
      onInput: 'handleInput',
      onFocus: 'handleFocus',
      onBlur: 'handleBlur',
      value,
    },
    {
      type: VirtualDomElements.Button,
      className: 'IconButton',
      title: 'Open External',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconLinkExternal',
      childCount: 0,
      onClick: 'handleClickOpenExternal',
    },
  ]
}
