import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetSourceControlItemVirtualDom from '../GetSourceControlItemVirtualDom/GetSourceControlItemVirtualDom.js'
import * as GetSplitButtonVirtualDom from '../GetSplitButtonVirtualDom/GetSplitButtonVirtualDom.js'
import * as ViewletSourceControlStrings from '../ViewletSourceControl/ViewletSourceControlStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getSourceControlItemsVirtualDom = (items, splitButtonEnabled) => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.SourceControlHeader,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Input,
      className: ClassNames.InputBox,
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: ViewletSourceControlStrings.messageEnterToCommitOnMaster(),
      ariaLabel: ViewletSourceControlStrings.sourceControlInput(),
      childCount: 0,
      onInput: 'handleInput',
      onFocus: 'handleFocus',
    },
  )
  if (splitButtonEnabled) {
    const hasItems = items.length > 0
    dom.push(...GetSplitButtonVirtualDom.getSourceControlItemsVirtualDom(hasItems, 'Commit'))
  }
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.SourceControlItems,
      role: 'tree',
      childCount: items.length,
    },
    ...items.flatMap(GetSourceControlItemVirtualDom.getSourceControlItemVirtualDom),
  )
  return dom
}
