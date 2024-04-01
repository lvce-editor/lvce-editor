import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetProblemsListVirtualDom from '../GetProblemsListVirtualDom/GetProblemsListVirtualDom.js'
import * as ViewletProblemsStrings from '../ViewletProblems/ViewletProblemsStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getProblemsVirtualDom = (viewMode, problems) => {
  if (problems.length === 0) {
    return [
      {
        type: VirtualDomElements.Div,
        className: ClassNames.Message,
        childCount: 1,
      },
      text(ViewletProblemsStrings.noProblemsDetected()),
    ]
  }
  // TODO if viewMode is table, render a table
  const dom = GetProblemsListVirtualDom.getProblemsListVirtualDom(problems)
  return dom
}
