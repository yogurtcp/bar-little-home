"""Regenerate bundled English recordings (online build-time step only)."""
import asyncio, hashlib, json, pathlib, subprocess
import edge_tts
ROOT=pathlib.Path(__file__).resolve().parent.parent
catalog=json.loads(subprocess.check_output(['node','scripts/audio-catalog.js'],cwd=ROOT))
async def main():
    folder=ROOT/'public/audio/en'; folder.mkdir(parents=True,exist_ok=True)
    sem=asyncio.Semaphore(4)
    async def generate(text):
        path=folder/(hashlib.sha256(text.encode()).hexdigest()[:20]+'.mp3')
        if not path.exists():
            async with sem:
                for attempt in range(3):
                    try:
                        await edge_tts.Communicate(text,'en-US-AriaNeural',rate='-12%').save(str(path));break
                    except Exception:
                        path.unlink(missing_ok=True)
                        if attempt==2: raise
                        await asyncio.sleep(2)
        return text,'audio/en/'+path.name
    values=await asyncio.gather(*(generate(t) for t in catalog['en']))
    (ROOT/'src/english-audio.js').write_text('export const englishAudio = '+json.dumps(dict(values),ensure_ascii=False,indent=2)+';\n')
    print('English recordings ready:',len(values))
asyncio.run(main())
