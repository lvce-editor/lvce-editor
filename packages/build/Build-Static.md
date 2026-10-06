# Static

Generate fully static html, css and javascript that can be hosted for free on GitHub Pages, Netlify, Vercel, etc.

Since everything runs the in browser, some things will not be available:

- there is no filesystem access
- there are no terminals
- extensions cannot be installed (would require NodeJS)

## Build

```sh
node bin/build.js --target=static
```

GitHub Pages exports the static site from the server build so it reuses the same built artifacts:

```sh
npm run build:server
PATH_PREFIX=/lvce-editor npm run export:pages
```

The Pages artifact is written to `packages/build/.tmp/pages-export/dist`.

## Try out

```sh
http-server .tmp/dist
```
