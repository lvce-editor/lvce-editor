import * as Remove from '../Remove/Remove.ts'
import * as Replace from '../Replace/Replace.ts'

const htmlExtensionId = 'builtin.language-features-html'
const typeScriptExtensionId = 'builtin.language-features-typescript'

export const prepareElectronHtmlExtension = async ({ extensionsPath }: { readonly extensionsPath: string }): Promise<void> => {
  const htmlExtensionPath = `${extensionsPath}/${htmlExtensionId}`
  await Remove.remove(`${htmlExtensionPath}/typescript`)
  await Replace.replace({
    path: `${htmlExtensionPath}/html-worker/src/parts/TypeScriptPath/TypeScriptPath.js`,
    occurrence: '../../../../typescript/lib',
    replacement: `../../../../../${typeScriptExtensionId}/typescript/lib`,
  })
  await Replace.replace({
    path: `${htmlExtensionPath}/html-worker/dist/htmlWorkerMain.js`,
    occurrence: '../../typescript/lib',
    replacement: `../../../${typeScriptExtensionId}/typescript/lib`,
  })
}
