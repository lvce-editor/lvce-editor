import * as Copy from '../Copy/Copy.ts'

export const copyElectronLicense = async ({ resourcesPath }) => {
  await Copy.copyFile({
    from: 'LICENSE',
    to: `${resourcesPath}/app/LICENSE`,
  })
  await Copy.copyFile({
    from: 'ThirdPartyNotices.txt',
    to: `${resourcesPath}/app/ThirdPartyNotices.txt`,
  })
}
