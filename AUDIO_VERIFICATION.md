# Hebrew pronunciation correction

The child-facing Hebrew text now contains reviewed niqqud. In particular:

**אֲנִי רוֹצֶה שֶׁקֶט.**

The previous local voice sometimes blended or dropped sounds in **רוֹצֶה**. The published game now uses **he-IL-HilaNeural**, a female Hebrew voice, generated at build time from the pointed text at `-15%` rate. Every recording is bundled; no speech service is contacted during play.

A local Whisper `base` multilingual recognition check on the new recordings recovered:

| Check | Recognized text |
| --- | --- |
| Pointed full sentence | אני רוצה שקט. |
| Pointed word in isolation | רוצה |
| Toilet needs phrase | אני צריך פיפי, אני צריך קקי |
| Final bundled quiet request | אני רוצה שקט. |

Recognition is an automated check, rather than a human pronunciation review. The full sentence and isolated word checks both passed; other spot checks included the pee, poo, hunger and dirt requests. Some recognition results contained spelling variations, so these checks are not treated as proof that every sound is perfect.

The exact inputs, voice, durations, content hashes and published asset paths are in [the Hebrew recording manifest](scripts/hebrew/hila-recordings.json). The complete written sentences are in [messages.js](src/messages.js). Browser QA plays the actual bundled request, in Hebrew first and English second, and verifies the order through the parent's reply. It also confirms all recordings are available offline.

Regenerate in a Python environment with `edge-tts` and `mutagen` installed:

```sh
python scripts/generate-hebrew.py
```
