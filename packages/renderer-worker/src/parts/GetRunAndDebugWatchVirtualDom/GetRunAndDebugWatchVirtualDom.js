import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'
import * as ViewletRunAndDebugStrings from '../ViewletRunAndDebug/ViewletRunAndDebugStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const watchHeader = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugSectionHeader,
  tabIndex: 0,
  childCount: 2,
}

const textWatch = text(ViewletRunAndDebugStrings.watch())

export const renderWatch = (state) => {
  return [watchHeader, GetChevronVirtualDom.getChevronRightVirtualDom(), textWatch]
}
