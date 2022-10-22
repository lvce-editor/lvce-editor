const knownErrors = [
  {
    code: 'ERR_SSL_PROTOCOL_ERROR',
    message: 'This site can’t provide a secure connection',
  },
]

const getError = (code) => {
  for (const error of knownErrors) {
    if (error.code === code) {
      return error
    }
  }
  return {
    code,
    message: 'An unknown error occurred',
  }
}

const main = () => {
  const href = location.href
  const url = new URL(href)
  const code = url.searchParams.get('code')
  const error = getError(code)

  const $Heading = document.createElement('h1')
  $Heading.textContent = error.message

  const $ErrorCode = document.createElement('div')
  $ErrorCode.className = 'ErrorCode'
  $ErrorCode.textContent = code

  const $Main = document.createElement('main')
  $Main.append($Heading, $ErrorCode)

  document.body.append($Main)
}

main()
