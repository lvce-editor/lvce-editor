const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; form-action https://www.google.com">
    <title>New Tab</title>
    <style>
      :root {
        color-scheme: dark;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #1c2121;
        color: #f3f5f4;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        width: 100%;
        min-width: 260px;
        height: 100%;
        margin: 0;
      }

      body {
        overflow: hidden;
        background:
          radial-gradient(circle at 50% 24%, rgba(131, 81, 255, 0.09), transparent 34%),
          #1c2121;
      }

      main {
        display: flex;
        width: min(680px, calc(100% - 48px));
        margin: 0 auto;
        padding-top: clamp(88px, 21vh, 220px);
        flex-direction: column;
        align-items: center;
        gap: 48px;
      }

      .Brand {
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 28px;
        font-weight: 650;
        letter-spacing: -0.6px;
      }

      .BrandMark {
        display: grid;
        width: 52px;
        height: 52px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 15px;
        background: linear-gradient(145deg, #30284a, #252b2b);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.24);
        place-items: center;
      }

      .BrandMark svg {
        width: 34px;
        height: 34px;
      }

      form {
        width: 100%;
      }

      .SearchBox {
        display: flex;
        width: 100%;
        height: 52px;
        padding: 0 18px;
        align-items: center;
        gap: 12px;
        border: 1px solid rgba(255, 255, 255, 0.09);
        border-radius: 15px;
        background: #272d2d;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
      }

      .SearchBox:hover {
        background: #2b3231;
      }

      .SearchBox:focus-within {
        border-color: #8b6df0;
        box-shadow: 0 0 0 3px rgba(139, 109, 240, 0.18), 0 10px 28px rgba(0, 0, 0, 0.24);
      }

      .SearchIcon {
        width: 19px;
        height: 19px;
        flex: none;
        color: #aab2af;
      }

      input {
        width: 100%;
        min-width: 0;
        border: 0;
        outline: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        font-size: 15px;
        user-select: none;
      }

      input::placeholder {
        color: #9ca5a2;
        opacity: 1;
      }

      input::-webkit-search-cancel-button {
        filter: invert(1);
        opacity: 0.65;
      }

      @media (max-height: 500px) {
        main {
          padding-top: 56px;
          gap: 30px;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="Brand" aria-label="LVCE">
        <span class="BrandMark" aria-hidden="true">
          <svg viewBox="0 0 48 48" role="img">
            <defs>
              <linearGradient id="mark" x1="8" y1="5" x2="38" y2="43" gradientUnits="userSpaceOnUse">
                <stop stop-color="#b06cff"></stop>
                <stop offset="1" stop-color="#7b49e8"></stop>
              </linearGradient>
            </defs>
            <path fill="url(#mark)" d="M20 3 30 39 18 46 11 42Z"></path>
          </svg>
        </span>
        <span>LVCE</span>
      </div>
      <form role="search" action="https://www.google.com/search" method="get">
        <label class="SearchBox">
          <svg class="SearchIcon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m20 20-4.2-4.2m1.2-5.3a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"></path>
          </svg>
          <input type="search" name="q" aria-label="Search with Google" placeholder="Search with Google" autocomplete="off" spellcheck="false">
        </label>
      </form>
    </main>
  </body>
</html>`

export const url = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`

export const toDisplayUrl = (value) => {
  return value === url ? '' : value
}
