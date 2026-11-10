# Bar’s Little Home · בר בבית

A small pixel-art life simulator for Bar: body needs rise, actions affect them, ignored needs have visible consequences, and a parent is always available for care. Built for portrait and landscape tablets, without page scrolling. The frame uses the available screen height; a camera follows Bar across one undistorted 16:9 house scene. Room buttons keep every room reachable on narrower displays. The background, objects, characters, and touch targets share the same scene coordinates. All story text and speech use **Hebrew first, then English**.

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
node scripts/tablet-layout-check.mjs
# Optional Safari-engine check after installing Playwright WebKit:
BROWSER=webkit node scripts/tablet-layout-check.mjs
npm run deploy
```

The browser check uses a locally installed Chrome (`CHROME_PATH` can override `/usr/bin/google-chrome`). Deploy requires `gh` authenticated for `yogurtcp/bar-little-home`; it builds the static app and publishes `dist` to `gh-pages` without changing the source checkout.

## Installation, offline use, and updates

Use the visible **Install / התקנה** button. Chromium may offer a native install prompt. On iPad/iPhone, use Safari → Share → Add to Home Screen; keep Open as Web App enabled if offered. Available installation UI varies by browser and OS.

Wait for **Ready offline** after the initial visit. The service worker caches the complete game, including all artwork and recorded speech, in an atomic installation. A failed installation leaves the previous published version available. No browser speech service or network API is required to play.

The app checks for a published update at online startup only. It does not poll or check on focus/reconnection. An installed update waits until the story returns to Home, dialogs are closed, and speech/movement finish; the current world, selected parent, care step, and settings are saved before activation and reload. Saved data has a separate stable key and is not stored in disposable asset caches. A web app cannot update while closed, and offline startup keeps the last downloaded version.

## Art and speech

- Original artwork: built-in OpenAI ImageGen. The [original home prompts](art-source/PROMPTS.md) and [life simulator prompts and atlases](art-source/PROMPTS-LIFE-SIM.md) are included. New poses show pee/poo urgency, hunger, dirty clothes, eating, washing and wet clothes. Game assets live in `public/art/`.
- Hebrew: **he-IL-HilaNeural**, generated from reviewed, fully pointed Hebrew at build time. [Pronunciation verification](AUDIO_VERIFICATION.md), [recording provenance](scripts/hebrew/hila-recordings.json), and the content-hashed MP3 assets are included. Install `edge-tts` and `mutagen`, then run `python scripts/generate-hebrew.py`.
- English: Microsoft Aria, recorded with `edge-tts`. Run `python scripts/generate-english.py` to regenerate. No browser voice, cloud API, or connectivity is needed during play.
- Earlier BlueTTS rebuilding scripts/provenance are retained for history; the published game uses the Hila recording manifest.
- Narration source: `src/messages.js`; body simulation: `src/simulation.js`; actions and routines: `src/state.js`.

## Body simulation and consequences

Four meters represent **pee, poo, hunger and dirt**. Fuller means more need. Tap a meter for the relevant care choices. A controllable game clock advances while the game is visible and active; it pauses during speech, care steps, dialogs and background/closed play. There is no elapsed-time catch-up when reopening. The pause button stops passive time; player actions still affect needs. Speed toggles 1×/2× and the sand timer deliberately advances 15 game minutes.

- **Drinking → delayed pee:** water queues a later bladder increase. A full pee meter produces urgency and a toilet pose. Ignoring it beyond a grace period can lead to a wet-clothes accident and a stationary floor puddle. Changing clothes, washing and wiping the floor are distinct actions.
- **Eating → hunger relief and later poo:** meals reduce hunger substantially and queue digestion. Sweets only reduce hunger slightly. Eating repeatedly after feeling full can produce tummy discomfort. Poo has its own meter, urgency, toilet routine, and clothing consequence if ignored.
- **Play → hunger and dirt:** continuing to play raises both needs faster. Very high hunger makes Bar low-energy and stops play until he gets food. High dirt visibly marks clothes and produces a sweaty smell and discomfort.
- **Appropriate care matters:** pee and poo routines address their own meter, then offer handwashing. A shower cleans Bar and clothes but does not clear toilet needs or hunger. A hug comforts; it does not erase bodily needs or dental pain. Rest is not a substitute for the toilet: ignoring a full need during that time can still lead to an accident.
- **Connected household events:** broken tables, scattered toys, spills, washable drawing marks, sound comfort, rest and dental care remain part of the same home.

The picture chains beside narration show causes, consequences and care. The drawing/history button opens the last 18 story entries with need snapshots and replayable bilingual narration. Help is paged when many problems coexist, so every relevant care choice stays reachable.

Needs, queued digestion, urgency grace periods, clothes, puddle location, story history, current routine, selected parent and pause/speed settings are saved and migrated from earlier versions.

## Story accuracy

Time is compressed explicitly when “later” is chosen. A single missed brushing does not produce toothache. Repeated skips move the story forward over a long period; brushing does not clear established tooth pain. A separate parent-supported dentist visit/care step resolves that story. Crying is met with comfort. Loud music is represented visually and never raises playback volume. Routines avoid humiliation or frightening injuries.

Timing is deliberately compressed for play; these rules are not a medical timetable. Accidents receive calm support and cleanup, without shame or loss of food, water, help or affection. Holding-poo discomfort is represented separately from sweets or overeating discomfort.

Body-care references: [NHS constipation in children](https://www.nhs.uk/baby/health/constipation-in-children/), [NHS soiling in children](https://www.nhs.uk/symptoms/soiling-child-pooing-their-pants/).

Dental references: [NHS tooth decay](https://www.nhs.uk/conditions/tooth-decay/), [NHS toothache](https://www.nhs.uk/symptoms/toothache/). These are simplified stories about communication and care, not diagnostic or treatment simulations.
