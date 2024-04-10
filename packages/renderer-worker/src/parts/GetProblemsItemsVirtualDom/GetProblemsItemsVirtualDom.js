import * as GetProblemsListVirtualDom from '../GetProblemsListVirtualDom/GetProblemsListVirtualDom.js'
import * as GetProblemsNoProblemsFoundVirtualDom from '../GetProblemsNoProblemsFoundVirtualDom/GetProblemsNoProblemsFoundVirtualDom.js'
import * as GetProblemsTableVirtualDom from '../GetProblemsTableVirtualDom/GetProblemsTableVirtualDom.js'
import * as ProblemsViewMode from '../ProblemsViewMode/ProblemsViewMode.js'

export const getProblemsVirtualDom = (viewMode, problems, filterValue) => {
  if (problems.length === 0) {
    return GetProblemsNoProblemsFoundVirtualDom.getProblemsNoProblemsFoundVirtualDom(filterValue)
  }
  if (viewMode === ProblemsViewMode.Table) {
    return GetProblemsTableVirtualDom.getProblemsTableVirtualDom(problems)
  }
  const dom = GetProblemsListVirtualDom.getProblemsListVirtualDom(problems)
  return dom
}
