import * as Copy from '../Copy/Copy.ts'
import * as Remove from '../Remove/Remove.ts'

export const copyElectronFileIcons = async ({ resourcesPath, commitHash }) => {
  const vscodeIconsPath = `${resourcesPath}/app/static/${commitHash}/extensions/builtin.vscode-icons/icons`
  await Copy.copy({
    from: vscodeIconsPath,
    to: `${resourcesPath}/app/static/${commitHash}/file-icons`,
  })
  await Remove.remove(vscodeIconsPath)
}
