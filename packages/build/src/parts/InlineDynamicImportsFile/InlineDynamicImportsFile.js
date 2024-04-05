import * as ReadFile from '../ReadFile/ReadFile.js'
import * as WriteFile from '../WriteFile/WriteFile.js'
import * as InlineDynamicImports from '../InlineDynamicImports/InlineDynamicImports.js'

export const inlineDynamicModules = async ({
  path,
  eagerlyLoadedModules,
  ipcPostFix = false,
  viewlet = false,
}) => {
  const content = await ReadFile.readFile(path)
  const newContent = InlineDynamicImports.getNewModuleCode(
    content,
    eagerlyLoadedModules,
    ipcPostFix,
    viewlet
  )
  await WriteFile.writeFile({
    to: path,
    content: newContent,
  })
}
