import { stripTypeScriptTypes } from 'node:module'

export const fixImports = (content) => {
  if (!content) {
    return content
  }
  return content
    .replaceAll(/(from\s+['"][^'"]+)\.ts(['"])/g, '$1.js$2')
    .replaceAll(/(import\s+['"][^'"]+)\.ts(['"])/g, '$1.js$2')
    .replaceAll(/(import\(\s*['"][^'"]+)\.ts(['"]\s*\))/g, '$1.js$2')
    .replaceAll('sharedProcessMain.ts', 'sharedProcessMain.js')
}

const normalizeStrippedTypes = (content) => {
  return content.replaceAll(/([A-Za-z0-9_$])\s+(?=[,)])/g, '$1').replaceAll(/\)\s+=>/g, ') =>')
}

export const replaceTs = async (content) => {
  if (!content) {
    return content
  }
  const strippedContent = stripTypeScriptTypes(content, {
    mode: 'strip',
  })
  return fixImports(normalizeStrippedTypes(strippedContent))
}
