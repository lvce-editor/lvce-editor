import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as ViewletProblemsStrings from '../ViewletProblems/ViewletProblemsStrings.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getProblemVirtualDom = (problem) => {
  return [
    {
      type: VirtualDomElements.Li,
      className: 'Problem',
      childCount: 1,
    },
    text(problem),
  ]
}

export const getProblemsVirtualDom = (problems) => {
  if (problems.length === 0) {
    return [text(ViewletProblemsStrings.noProblemsDetected())]
  }
  const dom = [
    {
      type: VirtualDomElements.Ul,
      className: 'ProblemsList',
      childCount: problems.length,
    },
    ...problems.flatMap(getProblemVirtualDom),
  ]
  return dom
}
