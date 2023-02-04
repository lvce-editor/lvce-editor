const main = async () => {
  await import('./use-sample-data.js')
  if (process.env.DOWNLOAD_BUILTIN_EXTENSIONS !== '0') {
    await import('../build/src/parts/DownloadBuiltinExtensions/DownloadBuiltinExtensions.js')
  }
}

main()
