console.log('hello from process explorer')

const $TBody = /** @type {HTMLElement} */ (
  document.querySelector('#ProcessExplorer tbody')
)

const setValues = (values) => {
  console.log({ values })
  const $Fragment = document.createDocumentFragment()
  for (const value of values) {
    const $Td = document.createElement('td')
    $Td.textContent = value
    const $Row = document.createElement('tr')
    $Row.className = 'Row'
    $Row.append($Td)
    $Fragment.append($Row)
  }
  $TBody.textContent = ''
  $TBody.append($Fragment)
}

const handleMessage = (event) => {
  console.log(event)
  const { data } = event
  setValues([data])
}

const main = () => {
  onmessage = handleMessage
}

main()
