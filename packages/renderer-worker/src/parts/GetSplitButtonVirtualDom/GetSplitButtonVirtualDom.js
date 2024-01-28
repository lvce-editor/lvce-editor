import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getSourceControlItemsVirtualDom = (hasItems, buttonText) => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.SplitButton} ${hasItems ? '' : ClassNames.SplitButtonDisabled}`,
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.SplitButtonContent} ${hasItems ? '' : ClassNames.SplitButtonContentDisabled}`,
      childCount: 1,
      tabIndex: 0,
    },
    text(buttonText),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.SplitButtonSeparator,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.SplitButtonDropDown} ${hasItems ? '' : ClassNames.SplitButtonDropDownDisabled}`,
      childCount: 1,
      tabIndex: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.MaskIcon} ${ClassNames.MaskIconChevronDown}`,
      childCount: 0,
    },
  )

  return dom
}
