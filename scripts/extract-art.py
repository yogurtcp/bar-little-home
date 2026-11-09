"""Extract the generated atlases; retain consistent character scale and foot baseline."""
from PIL import Image
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'public/art'
characters='bar-idle bar-walk bar-jump bar-cry bar-tummy bar-tooth bar-sleep bar-fresh mom-idle mom-food mom-hug mom-towel dad-idle dad-water dad-hug dad-repair'.split()
props='table table-broken candy candy-pile water puddle banana sandwich toys basket paper scribble teeth towel toilet speaker cushion heart repair timer'.split()
for atlas,names,cols in [('characters',characters,4),('props',props,5)]:
    im=Image.open(ROOT/'art-source'/f'{atlas}.png').convert('RGBA')
    for i,name in enumerate(names):
        r,c=divmod(i,cols)
        tile=im.crop((round(c*im.width/cols),round(r*im.height/4),round((c+1)*im.width/cols),round((r+1)*im.height/4)))
        # Ignore almost invisible generator residue when finding the content boundary.
        bbox=tile.getchannel('A').point(lambda a:255 if a>=80 else 0).getbbox()
        box=(max(0,bbox[0]-3),max(0,bbox[1]-3),min(tile.width,bbox[2]+3),min(tile.height,bbox[3]+3))
        sprite=tile.crop(box)
        if atlas=='characters':
            if name in ['bar-idle','mom-idle','dad-idle']:
                face=sprite.crop((0,0,sprite.width,round(sprite.height*.38)))
                face.save(OUT/(name.split('-')[0]+'-face.webp'),lossless=True)
            canvas=Image.new('RGBA',tile.size)
            canvas.alpha_composite(sprite,((tile.width-sprite.width)//2,tile.height-sprite.height-6));sprite=canvas
        sprite.thumbnail((300,300),Image.Resampling.NEAREST)
        sprite.save(OUT/(name+'.webp'),lossless=True)
icon=Image.new('RGBA',(512,512),'#f8e4bd');face=Image.open(OUT/'bar-face.webp');face.thumbnail((360,360),Image.Resampling.NEAREST)
# Nearest-neighbor upscale the extracted face for a crisp, centered installation icon.
scale=min(360/face.width,360/face.height);face=face.resize((round(face.width*scale),round(face.height*scale)),Image.Resampling.NEAREST)
icon.alpha_composite(face,((512-face.width)//2,(512-face.height)//2))
for size,file in [(512,'icon-512.png'),(192,'icon-192.png'),(180,'apple-touch-icon.png')]:
    icon.resize((size,size),Image.Resampling.NEAREST).convert('RGB').save(ROOT/'public/icons'/file)
