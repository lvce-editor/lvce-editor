const configRegex = /<script id="Config" type="application\/json">[\s\S]*?<\/script>/gm

export const escapeJsonForHtml = (json) => {
  return json.replaceAll('&', '\\u0026').replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029')
}

export const getConfigElement = (config) => {
  const json = JSON.stringify(config)
  const escapedJson = escapeJsonForHtml(json)
  return `<script id="Config" type="application/json">${escapedJson}</script>`
}

export const injectConfig = (html, config) => {
  const configElement = getConfigElement(config)
  if (html.includes('id="Config"')) {
    return html.replace(configRegex, configElement)
  }
  return html.replace('</head>', `    ${configElement}\n  </head>`)
}
