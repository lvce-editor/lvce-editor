import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetProblemsListVirtualDom from '../GetProblemsListVirtualDom/GetProblemsListVirtualDom.js'
import * as GetProblemsTableVirtualDom from '../GetProblemsTableVirtualDom/GetProblemsTableVirtualDom.js'
import * as ProblemsViewMode from '../ProblemsViewMode/ProblemsViewMode.js'
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
  if (viewMode === ProblemsViewMode.Table) {
    return GetProblemsTableVirtualDom.getProblemsTableVirtualDom(problems)
  }
  const dom = GetProblemsListVirtualDom.getProblemsListVirtualDom(problems)
  return dom
}
