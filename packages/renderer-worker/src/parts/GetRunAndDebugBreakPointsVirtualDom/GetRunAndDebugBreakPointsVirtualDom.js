import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'
import * as ViewletRunAndDebugStrings from '../ViewletRunAndDebug/ViewletRunAndDebugStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const breakPointsHeader = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugSectionHeader,
  tabIndex: 0,
  childCount: 2,
}

const textBreakPoints = text(ViewletRunAndDebugStrings.breakPoints())

export const renderBreakPoints = (state) => {
  return [breakPointsHeader, GetChevronVirtualDom.getChevronRightVirtualDom(), textBreakPoints]
}
