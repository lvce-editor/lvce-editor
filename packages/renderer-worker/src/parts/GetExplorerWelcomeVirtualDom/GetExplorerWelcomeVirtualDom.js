import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'
import * as ExplorerStrings from '../ViewletExplorer/ViewletExplorerStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getExplorerWelcomeVirtualDom = () => {
  return [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
      tabIndex: 0,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Welcome,
      childCount: 2,
    },
    {
      type: VirtualDomElements.P,
      className: ClassNames.WelcomeMessage,
      childCount: 1,
    },
    text(ExplorerStrings.youHaveNotYetOpenedAFolder()),
    {
      type: VirtualDomElements.Button,
      className: MergeClassNames.mergeClassNames(ClassNames.Button, ClassNames.ButtonPrimary),
      childCount: 1,
      onClick: DomEventListenerFunctions.handleClickOpenFolder,
    },
    text(ExplorerStrings.openFolder()),
  ]
}
