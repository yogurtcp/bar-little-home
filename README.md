# Bar’s Little Home · בר בבית

A small pixel-art home for Bar to explore everyday choices, their consequences, and asking a parent for care. Built for a tablet, without page scrolling. All story text and speech use **Hebrew first, then English**.

Play: **https://yogurtcp.github.io/bar-little-home/**

Tap a household object to open large picture choices beside it, directly inside the house. The picture labels and bilingual spoken lines are short, and the house has no menus or narration panels underneath it. Tap the floor to walk. The Mom and Dad buttons always open a picture communication board: food, water, shower, toilet, help, hug, quiet, and pain. A single tap communicates; spoken repetition is never required. There are no scores, deadlines, or punishments.

The first version includes a broken table and adult repair, sweets and tummy discomfort, washing and sweaty smell, brushing and dental care, spilled water and wiping, toys blocking a path and tidying, washable crayon marks and paper, story volume and quiet, rest, and toilet routines with handwashing. Support and basic needs remain available during every scenario.

## Development

Requires Node 18+.

```sh
npm ci
npm test
npm run build
npm start
```

Open http://localhost:4192. The build validates every bilingual recording, packages all assets, and derives the service-worker version from the complete published contents.

```sh
node scripts/browser-check.mjs
npm run deploy
```

The browser check uses a locally installed Chrome (`CHROME_PATH` can override `/usr/bin/google-chrome`). Deploy requires `gh` authenticated for `yogurtcp/bar-little-home`; it builds the static app and publishes `dist` to `gh-pages` without changing the source checkout.

## Installation, offline use, and updates

Use the visible **Install / התקנה** button. Chromium may offer a native install prompt. On iPad/iPhone, use Safari → Share → Add to Home Screen; keep Open as Web App enabled if offered. Available installation UI varies by browser and OS.

Wait for **Ready offline** after the initial visit. The service worker caches the complete game, including all artwork and recorded speech, in an atomic installation. A failed installation leaves the previous published version available. No browser speech service or network API is required to play.

The app checks for a published update at online startup only. It does not poll or check on focus/reconnection. An installed update waits until the story returns to Home, dialogs are closed, and speech/movement finish; the current world, selected parent, care step, and settings are saved before activation and reload. Saved data has a separate stable key and is not stored in disposable asset caches. A web app cannot update while closed, and offline startup keeps the last downloaded version.

## Art and speech

- Original artwork: OpenAI ImageGen. The [original atlases and exact prompts](art-source/PROMPTS.md) are included. `python3 scripts/extract-art.py` extracts sprites with Pillow, maintaining a consistent scale and baseline. This is a game illustration, not a photograph of Bar or his parents.
- Hebrew: local [BlueTTS](https://github.com/maxmelichov/BlueTTS) female voice; bundled MP3 recordings, pronunciation map, provenance JSON, and [upstream license](scripts/hebrew/BLUETTS_LICENSE.txt) are included. No cloud Hebrew speech dependency. See `scripts/generate-hebrew-blue.py --help` and `scripts/requirements-hebrew-blue.txt` to regenerate. Paths to the local engine, model, and G2P model must be supplied.
- English: Microsoft Aria voice recordings generated at build time with `edge-tts`. Install `edge-tts` in a Python environment, then run `python scripts/generate-english.py`. Recordings use content-hashed names so changed text never reuses stale speech.
- Narration source: `src/messages.js`; interaction rules: `src/state.js`.

## Story accuracy

Time is compressed explicitly when “later” is chosen. A single missed brushing does not produce toothache. Repeated skips move the story forward over a long period; brushing does not clear established tooth pain. A separate parent-supported dentist visit/care step resolves that story. Crying is met with comfort. Loud music is represented visually and never raises playback volume. Routines avoid humiliation or frightening injuries.

Dental references: [NHS tooth decay](https://www.nhs.uk/conditions/tooth-decay/), [NHS toothache](https://www.nhs.uk/symptoms/toothache/). These are simplified stories about communication and care, not diagnostic or treatment simulations.
