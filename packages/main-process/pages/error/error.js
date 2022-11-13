import { getError } from './errorMessage.js'

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
