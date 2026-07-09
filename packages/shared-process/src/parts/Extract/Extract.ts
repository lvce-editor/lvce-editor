import * as NetworkProcess from '../NetworkProcess/NetworkProcess.ts'

export const extractTarBr = (inFile, outDir) => {
  return NetworkProcess.invoke('Extract.extractTarBr', inFile, outDir)
}

export const extractTarGz = ({ inFile, outDir, strip }) => {
  return NetworkProcess.invoke('Extract.extractTarGz', {
    inFile,
    outDir,
    strip,
  })
}
