export const getWebViewCsp = () => {
  const csp = `default-src *; script-src *; style-src *; script-src-elem *; style-src-elem *`
  return csp
}
