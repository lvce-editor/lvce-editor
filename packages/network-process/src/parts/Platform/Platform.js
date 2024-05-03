const { env, platform } = process

export const applicationName = 'lvce-oss'

export const isWindows = platform === 'win32'

export const isMacOs = platform === 'darwin'
