const addSemicolon = (line) => {
  return line + ';'
}

export const ContentSecurityPolicy = {
  key: 'Content-Security-Policy',
  value: [
    `default-src 'none'`,
    `connect-src 'self'`,
    `font-src 'self'`,
    `frame-src *`,
    `img-src 'self' https: data: blob:`,
    `script-src 'self'`,
    `media-src 'self'`,
    `manifest-src 'self'`,
    `style-src 'self'`,
  ]
    .map(addSemicolon)
    .join(' '),
}

export const ContentSecurityPolicyRendererWorker = {
  key: 'Content-Security-Policy',
  value: [`default-src 'none'`, `connect-src 'self'`, `script-src 'self'`, `font-src 'self'`].map(addSemicolon).join(' '),
}

export const ContentSecurityPolicyExtensionHostWorker = {
  key: 'Content-Security-Policy',
  value: [`default-src 'none'`, `connect-src 'self'`, `script-src 'self'`, `font-src 'self'`].map(addSemicolon).join(' '),
}

export const ContentSecurityPolicyTerminalWorker = {
  key: 'Content-Security-Policy',
  value: [`default-src 'none'`, `connect-src 'self'`, `script-src 'self'`].map(addSemicolon).join(' '),
}
