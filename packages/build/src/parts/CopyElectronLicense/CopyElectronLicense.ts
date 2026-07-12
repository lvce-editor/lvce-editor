import * as Copy from '../Copy/Copy.ts'

export const copyElectronLicense = async ({ resourcesPath }) => {
  await Copy.copyFile({
    from: 'LICENSE',
    to: `${resourcesPath}/app/LICENSE`,
  })
}
