const main = async () => {
  await import(
    '../build/src/parts/DownloadBuiltinExtensions/DownloadBuiltinExtensions.js'
  )
  await import('./use-sample-data.js')
}

main()
