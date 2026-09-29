import * as NetworkProcess from '../NetworkProcess/NetworkProcess.ts'

export const extractTarBr = (inFile: any, outDir: any): any => {
  return NetworkProcess.invoke('Extract.extractTarBr', inFile, outDir)
}

export const extractTarGz = ({ inFile, outDir, strip }: any): any => {
  return NetworkProcess.invoke('Extract.extractTarGz', {
    inFile,
    outDir,
    strip,
  })
}
