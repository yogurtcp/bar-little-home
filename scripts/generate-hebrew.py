"""Build-time Hebrew recordings from reviewed, fully pointed text. No runtime TTS."""
import asyncio,hashlib,json,pathlib,subprocess
import edge_tts
from mutagen.mp3 import MP3
ROOT=pathlib.Path(__file__).resolve().parent.parent
VOICE='he-IL-HilaNeural'
RATE='-15%'
catalog=json.loads(subprocess.check_output(['node','scripts/audio-catalog.js'],cwd=ROOT))['he']
async def main():
    folder=ROOT/'public/audio/he';folder.mkdir(parents=True,exist_ok=True)
    sem=asyncio.Semaphore(4)
    async def generate(text):
        digest=hashlib.sha256((VOICE+'|'+RATE+'|pointed-v1|'+text).encode()).hexdigest()[:20]
        path=folder/('hila-'+digest+'.mp3')
        async with sem:
            if not path.exists():
                temporary=path.with_suffix('.tmp')
                for attempt in range(4):
                    try:
                        await edge_tts.Communicate(text,VOICE,rate=RATE).save(str(temporary))
                        if temporary.stat().st_size<800:raise ValueError('Empty recording')
                        temporary.replace(path);break
                    except Exception:
                        temporary.unlink(missing_ok=True)
                        if attempt==3:raise
                        await asyncio.sleep(2*(attempt+1))
        seconds=MP3(path).info.length
        if not .15<seconds<20:raise ValueError('Invalid clip duration: '+text)
        return text,{'input':text,'path':'audio/he/'+path.name,'seconds':seconds,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
    values=dict(await asyncio.gather(*(generate(text)for text in catalog)))
    metadata={'engine':'Microsoft neural speech, build-time recordings','voice':VOICE,'rate':RATE,'textPolicy':'Reviewed niqqud is passed verbatim to synthesis','records':values}
    (ROOT/'scripts/hebrew/hila-recordings.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
    manifest={'he':{text:entry['path']for text,entry in values.items()},'en':{}}
    (ROOT/'src/audio-manifest.js').write_text('// Bundled Hebrew from fully pointed text, using the Hila female voice.\nexport const audioManifest = '+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n')
    print('Pointed Hebrew recordings validated:',len(values))
asyncio.run(main())
