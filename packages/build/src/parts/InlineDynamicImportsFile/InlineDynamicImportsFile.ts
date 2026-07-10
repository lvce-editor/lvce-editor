import * as ReadFile from '../ReadFile/ReadFile.ts'
import * as WriteFile from '../WriteFile/WriteFile.ts'
import * as InlineDynamicImports from '../InlineDynamicImports/InlineDynamicImports.ts'

export const inlineDynamicModules = async ({ path, eagerlyLoadedModules, ipcPostFix = false, viewlet = false }) => {
  const content = await ReadFile.readFile(path)
  const newContent = InlineDynamicImports.getNewModuleCode(content, eagerlyLoadedModules, ipcPostFix, viewlet)
  await WriteFile.writeFile({
    to: path,
    content: newContent,
  })
}
