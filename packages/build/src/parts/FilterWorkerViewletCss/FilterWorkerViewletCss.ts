import * as GetFilteredCssDeclarations from '../GetFilteredCssDeclarations/GetFilteredCssDeclarations.ts'

export const filterWorkerViewletCss = (workers) => {
  return workers.map((worker) => {
    if (!Array.isArray(worker.viewlet?.css)) {
      return worker
    }
    return {
      ...worker,
      viewlet: {
        ...worker.viewlet,
        css: GetFilteredCssDeclarations.getFilteredCssDeclarations(worker.viewlet.css),
      },
    }
  })
}
