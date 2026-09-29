import * as Replace from '../Replace/Replace.ts'

export const patchDialogWorkerProductName = async ({ product, toRoot }) => {
  const productName = product.nameLong.endsWith(' - OSS') ? product.nameLong : product.nameShort
  await Replace.replace({
    path: `${toRoot}/packages/dialog-worker/dist/dialogWorkerMain.js`,
    occurrence: `productNameLong = 'Lvce Editor - OSS'`,
    replacement: `productNameLong = '${productName}'`,
  })
}
