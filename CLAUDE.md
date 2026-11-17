# bailamos-web

Static marketing site for the Bailamos! iOS app. No build step — the repo root
is what Cloudflare Pages serves, so **every file here is publicly reachable**
and **pushing `main` deploys to production in ~30s**.

## Before changing assets

`_headers` caches `/assets/*` for 7 days. Replacing a file in place under the
same name leaves the old bytes served at the edge. Bump the `?v=` token on that
asset's references in `index.html`, then verify the live `content-length`
against the local file.

## Videos

Video production does **not** live here — it is in `../Marketing/`, deliberately
outside this repo so 188 MB of renders never deploy. Making or re-rendering the
App Store preview, the Reels / feed / paid cuts, or the site's tour video:
**read `../Marketing/VIDEO.md` first.**

`assets/tour.mp4`, `assets/tour-poster.jpg` and `assets/flyover-loop.*` are the
only video files that belong in this repo. They are produced in `../Marketing/`
and copied in — and because of the cache rule above, replacing one means bumping
its `?v=` token.
