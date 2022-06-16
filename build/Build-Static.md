# Static

Generate fully static html, css and javascript that can be hosted for free on github-pages, netlify, vercel, etc.

Since everything runs the in browser, some things will not be available:

- there is no filesystem access
- there are no terminals
- extensions cannot be installed (would require NodeJS)

## Build

```sh
node bin/build.js --target=static
```

## Try out

```sh
http-server .tmp/dist
```
