import{newSimulation,migrateSimulation,syncBody,advance,queue,record,clamp}from'./simulation.js';
export const SAVE_KEY='bar-little-home-v1';
export const initialState=()=>({version:1,parent:'mom',x:48,event:'welcome',menu:'explore',muted:false,smell:0,teethSkips:0,toothache:false,tummy:false,cry:false,tired:0,toiletNeed:0,tableBroken:false,toysOut:false,puddle:false,wall:false,loud:false,hungry:true,food:null,paper:false,adult:null,completed:[],...newSimulation()});
const menus=['explore','table','candy','shower','teeth','water','toys','draw','music','sleep','toilet','food','help','hurt','showerCare','toiletCare','dentistCare','restCare','pee','poo','peeCare','pooCare','hands','laundry','accident'];
export function restore(raw){const base=initialState();try{const s=JSON.parse(raw);if(!s||s.version!==1)return base;for(const k of['parent','x','event','menu','muted','smell','teethSkips','toothache','tummy','cry','tired','toiletNeed','tableBroken','toysOut','puddle','wall','loud','hungry','paper'])if(typeof s[k]===typeof base[k])base[k]=s[k];base.food=['banana','sandwich'].includes(s.food)?s.food:null;base.completed=Array.isArray(s.completed)?s.completed.filter(x=>typeof x==='string').slice(0,100):[];base.adult=s.adult&&['mom','dad'].includes(s.adult.who)?{who:s.adult.who,pose:['idle','food','water','hug','towel','repair'].includes(s.adult.pose)?s.adult.pose:'idle'}:null;base.x=Math.max(6,Math.min(94,Number.isFinite(base.x)?base.x:48));base.teethSkips=clamp(base.teethSkips,3);if(!menus.includes(base.menu))base.menu='explore';if(!['mom','dad'].includes(base.parent))base.parent='mom';return migrateSimulation(base,s);}catch{return base;}}
const context={table:['tableQuestion',23],candy:['candyQuestion',60],shower:['showerQuestion',94],teeth:['teethQuestion',75],water:['waterQuestion',32],toys:['toysQuestion',54],draw:['drawQuestion',39],music:['musicQuestion',66],sleep:['sleepQuestion',45],toilet:['toiletQuestion',85],pee:['peeQuestion',85],poo:['pooQuestion',85],food:['foodQuestion',10],hands:['dirtyHands',75],laundry:['laundryQuestion',92]};
const complete=(s,id)=>{if(!s.completed.includes(id))s.completed.push(id);};
const adult=(s,pose='idle')=>s.adult={who:s.parent,pose};
export function act(previous,action,value){const s=structuredClone(previous);let motion='',cue=null;const say=(event,menu=s.menu)=>{s.event=event;s.menu=menu;};const time=n=>{cue=advance(s,n)||cue;};const done=(log=false,kind='action')=>{syncBody(s);if(cue==='peeAccident'||cue==='pooAccident'){say(cue,'accident');motion='accident';}if(log)record(s,s.event,kind);return{s,motion,cue};};
 if(action==='tick'){if(s.clock.paused)return done();time(value||1);if(cue){say(cue,(/Accident$/.test(cue)?'accident':s.menu));}return done();}
 if(action==='pause'){s.clock.paused=!s.clock.paused;return done();}
 if(action==='speed'){s.clock.speed=s.clock.speed===1?2:1;return done();}
 if(action==='wait'){time(15);say(cue||'timePass');return done(true);}
 if(action.startsWith('open:')){const id=action.slice(5),c=context[id];if(c){say(c[0],id);s.x=c[1];s.activity='idle';motion='walk';if(id==='table'&&s.tableBroken)s.event='tableBreak';if(id==='toys'&&s.toysOut)s.event='toysBlocked';if(id==='teeth'&&s.toothache)s.event='toothache';if(id==='pee'&&s.needs.pee>=70)s.event=s.needs.pee>=95?'peeFull':'needPee';if(id==='poo'&&s.needs.poo>=70)s.event=s.needs.poo>=95?'pooFull':'needPoo';if(id==='food'&&s.needs.hunger>=80)s.event='needFood';if(id==='shower'&&s.needs.dirt>=70)s.event='needDirty';}return done();}
 if(action==='parent'){s.parent=value;return done();}
 if(action==='walk'){if(s.toysOut&&((s.x<54&&value>54)||(s.x>54&&value<54))){say('toysBlocked','toys');s.x=s.x<54?47:62;}else s.x=Math.max(6,Math.min(94,value));motion='walk';return done();}
 if(action.startsWith('ask:')){const id=action.slice(4);s.activity='idle';adult(s,id==='hug'?'hug':id==='shower'?'towel':id==='food'?'food':id==='water'?'water':'idle');switch(id){case'food':say(s.needs.hunger<=10?'foodFull':'foodChoice','food');break;case'water':time(3);queue(s,'pee',24,12);say('waterDone','explore');complete(s,'water');break;case'shower':s.x=94;say('showerStart','showerCare');break;case'pee':case'poo':s.x=85;say('toiletStart',id+'Care');break;case'toilet':s.x=85;say('toiletStart','toiletCare');break;case'help':say(s.wetClothes||s.soiledClothes?'cleanHelp':'helpOffer','help');break;case'hug':s.cry=false;say('hugDone','explore');complete(s,'hug');break;case'break':s.loud=false;say('breakChoice','sleep');break;case'hurt':say('hurtChoice','hurt');break;}return done(true,'care');}
 switch(action){
 case'explore':say('welcome','explore');s.adult=null;break;
 case'tableSit':if(!s.tableBroken){s.x=22;say('tableSit');}else say('tableBreak','help');break;
 case'tableJump':if(s.needs.hunger>=95){say('needFood','food');break;}time(4);if(!s.tableBroken){s.x=27;s.tableBroken=true;s.cry=true;motion='jump';say('tableBreak','table');}else say('tableBreak','help');break;
 case'tableFix':time(8);adult(s,'repair');s.tableBroken=false;s.cry=false;say('tableFix','explore');complete(s,'table');break;
 case'cushionJump':if(s.needs.hunger>=95){say('needFood','food');break;}time(10);s.needs.dirt+=7;s.fatigue+=5;s.x=45;s.activity='play';motion='jump';say('cushionJump','sleep');break;
 case'candyOne':time(3);s.needs.hunger=Math.max(0,s.needs.hunger-5);s.needs.dirt+=3;s.handsDirty=true;say('candyOne','candy');break;
 case'candyMany':time(8);s.needs.hunger=Math.max(0,s.needs.hunger-8);s.needs.dirt+=12;s.handsDirty=true;s.candyAche=true;s.x=58;s.activity='idle';say('candyMany','candy');break;
 case'tummyHelp':adult(s,'hug');say('tummyHelp',s.pooAche&&!s.candyAche&&!s.overeatAche?'poo':'sleep');break;
 case'showerLater':time(15);s.needs.dirt+=20;say(s.needs.dirt>=70?'showerOdor':cue||'showerLater','shower');break;
 case'showerDone':time(12);s.needs.dirt=0;s.wetClothes=false;s.soiledClothes=false;s.handsDirty=false;if(!s.tableBroken)s.cry=false;adult(s,'towel');s.x=89;motion='fresh';say('showerDone','explore');complete(s,'shower');break;
 case'teethLater':time(15);s.teethSkips=Math.min(3,s.teethSkips+1);if(s.teethSkips>=3)s.toothache=true;say(s.toothache?'toothache':s.teethSkips===2?'teethWarning':'teethLater','teeth');break;
 case'brush':time(3);adult(s);s.teethSkips=0;s.x=75;motion='brush';say(s.toothache?'brushPain':'brushDone','teeth');complete(s,'brush');break;
 case'dentistStart':adult(s);say('dentistStart','dentistCare');break;
 case'dentistDone':s.toothache=false;s.teethSkips=0;say('dentistDone','explore');complete(s,'dentist');break;
 case'foodBanana':case'foodSandwich':{time(5);const full=s.needs.hunger<=10,banana=action==='foodBanana';s.food=banana?'banana':'sandwich';s.mealLoad+=banana?22:40;s.needs.hunger=Math.max(0,s.needs.hunger-(banana?30:52));s.needs.poo+=banana?2:4;queue(s,'poo',banana?13:24,banana?25:35);s.overeatAche=s.overeatAche||(full&&s.mealLoad>=85);s.activity='idle';s.cry=s.cry&&(s.tableBroken||s.wetClothes||s.soiledClothes);motion='eat';say(s.overeatAche?'overeaten':full?'foodFull':'foodDone','food');complete(s,'food');break;}
 case'foodLater':time(20);say(cue||'foodWait','food');break;
 case'spill':time(2);s.puddle=true;s.x=32;say('spill','water');break;
 case'wipe':time(5);s.puddle=false;s.peePuddle=false;adult(s,'towel');say('wipe','explore');complete(s,'spill');break;
 case'toysOut':case'play':if(s.needs.hunger>=95){say('needFood','food');s.activity='idle';break;}s.toysOut=true;s.x=52;s.activity='play';s.handsDirty=true;s.needs.dirt+=10;time(12);say(cue||'playMore','toys');motion='play';break;
 case'toysTidy':time(6);s.toysOut=false;s.activity='idle';say('toysTidy','explore');complete(s,'toys');break;
 case'wallDraw':s.wall=true;s.x=40;s.activity='draw';s.handsDirty=true;s.needs.dirt+=9;time(6);say('wallDraw','draw');break;
 case'paperDraw':s.paper=true;s.activity='draw';s.handsDirty=true;s.needs.dirt+=4;time(8);say('paperDraw','draw');complete(s,'paper');break;
 case'wipeWall':time(5);s.wall=false;adult(s,'towel');say('wipeWall','draw');complete(s,'wall');break;
 case'musicLoud':s.loud=true;say('musicLoud','music');break;
 case'musicQuiet':s.loud=false;say('musicQuiet','explore');complete(s,'quiet');break;
 case'sleepLater':time(20);s.fatigue=clamp(s.fatigue+20);say(s.fatigue>=50?'sleepy':'sleepLater','sleep');break;
 case'napStart':s.x=45;s.loud=false;s.activity='rest';adult(s,'hug');say('napStart','restCare');break;
 case'restDone':time(30);s.fatigue=Math.max(0,s.fatigue-70);s.candyAche=false;s.overeatAche=false;s.activity='idle';motion='fresh';say(s.pooAche?'holdPoo':'restDone',s.pooAche?'poo':'explore');complete(s,'rest');break;
 case'toiletLater':case'peeLater':case'pooLater':{const id=action==='pooLater'?'poo':action==='peeLater'?'pee':s.needs.poo>s.needs.pee?'poo':'pee';s.needs[id]+=12;time(20);say(cue||(id==='pee'?'peeLater':'pooLater'),id);break;}
 case'usePee':case'usePoo':{const id=action==='usePee'?'pee':'poo';s.adult=null;s.activity='idle';s.x=85;say('toiletStart',id+'Care');break;}
 case'peeDone':case'pooDone':case'toiletDone':{const id=action==='pooDone'?'poo':action==='peeDone'?'pee':s.needs.poo>s.needs.pee?'poo':'pee';s.needs[id]=0;s.urgency[id]=0;if(id==='poo')s.pooAche=false;time(3);s.handsDirty=true;s.needs.dirt+=4;s.x=79;say(id==='pee'?'peeDone':'pooDone','hands');complete(s,id);break;}
 case'washHands':time(2);s.handsDirty=false;s.needs.dirt=Math.max(0,s.needs.dirt-12);s.x=75;motion='wash';say('washHandsDone','explore');complete(s,'hands');break;
 case'handsLater':say('handsLater','explore');break;
 case'changeClothes':time(4);s.wetClothes=false;s.soiledClothes=false;s.needs.dirt=Math.max(0,s.needs.dirt-30);s.cry=false;motion='fresh';say('changeClothes','laundry');complete(s,'clothes');break;
 }
 return done(!['explore'].includes(action),/Done$/.test(action)||['washHands','changeClothes','wipe','toysTidy','tableFix','brush'].includes(action)?'care':'action');
}
const c=(id,he,en,icon)=>({id,he,en,icon});
export function choices(s){switch(s.menu){
 case'table':return s.tableBroken?[c('ask:help','עֶזְרָה','Help','repair'),c('ask:hug','חִבּוּק','Hug','heart')]:[c('tableSit','לָשֶׁבֶת','Sit','table'),c('tableJump','לִקְפֹּץ','Jump','bar-jump'),c('cushionJump','עַל כָּרִית','Cushion','cushion')];
 case'candy':return[c('candyOne','קְצָת','A little','candy'),c('candyMany','הַרְבֵּה','A lot','candy-pile'),...(s.tummy?[c('ask:hurt','כּוֹאֵב','It hurts','bar-tummy')]:[])];
 case'shower':return[c('ask:shower','מִקְלַחַת','Shower','towel'),c('showerLater','אַחַר כָּךְ','Later','timer')];
 case'teeth':return[c('brush','לְצַחְצֵחַ','Brush','teeth'),c('teethLater','אַחַר כָּךְ','Later','timer'),...(s.toothache?[c('ask:hurt','כּוֹאֵב','It hurts','bar-tooth')]:[])];
 case'water':return[c('ask:water','מַיִם','Water','water'),c('spill','לַהֲפֹךְ','Tip over','puddle'),...(s.puddle||s.peePuddle?[c('wipe','לְנַגֵּב','Wipe','towel')]:[])];
 case'toys':return[c('play','לְשַׂחֵק','Play','play-ball'),...(s.toysOut?[c('toysTidy','לְסַדֵּר','Tidy','basket')]:[]),c('ask:help','עֶזְרָה','Help','repair')];
 case'draw':return[c('paperDraw','נְיָר','Paper','paper'),c('wallDraw','קִיר','Wall','scribble'),...(s.wall?[c('wipeWall','לְנַקּוֹת','Clean','towel')]:[])];
 case'music':return[c('musicQuiet','נָעִים','Gentle','speaker'),c('musicLoud','חָזָק מִדַּי','Too loud','speaker')];
 case'sleep':return[c('napStart','לָנוּחַ','Rest','bar-sleep'),c('sleepLater','עוֹד מִשְׂחָק','More play','timer'),c('cushionJump','עַל כָּרִית','Cushion','cushion')];
 case'toilet':case'toiletCare':return[c('usePee','פִּיפִּי','Pee','need-pee'),c('usePoo','קַקִּי','Poo','need-poo'),c('ask:help','עֶזְרָה','Help','repair')];
 case'pee':case'poo':{const id=s.menu;return[c(id==='pee'?'usePee':'usePoo',id==='pee'?'פִּיפִּי':'קַקִּי',id==='pee'?'Pee':'Poo','need-'+id),c('ask:'+id,'עִם הוֹרֶה','With parent',s.parent+'-face'),c(id+'Later','אַחַר כָּךְ','Later','timer')];}
 case'food':return[c('foodBanana','בָּנָנָה','Banana','banana'),c('foodSandwich','כָּרִיךְ','Sandwich','sandwich'),...(s.handsDirty?[c('washHands','לִשְׁטֹף','Wash hands','wash-hands')]:[c('foodLater','אַחַר כָּךְ','Later','timer')])];
 case'showerCare':return[c('showerDone','לְהִתְרַחֵץ','Wash','towel')];
 case'peeCare':return[c('peeDone','סִיַּמְתִּי','All done','need-pee')];
 case'pooCare':return[c('pooDone','סִיַּמְתִּי','All done','need-poo')];
 case'hands':return[c('washHands','לִשְׁטֹף','Wash hands','wash-hands'),c('handsLater','אַחַר כָּךְ','Later','timer')];
 case'laundry':case'accident':return[c('changeClothes','בְּגָדִים','Clean clothes','clean-clothes'),c('ask:shower','מִקְלַחַת','Shower','towel'),...(s.peePuddle?[c('wipe','לְנַגֵּב','Wipe','towel')]:[c('ask:help','עֶזְרָה','Help','care-heart')])];
 case'dentistCare':return[c('dentistDone','אַחֲרֵי טִפּוּל','After care','teeth')];
 case'restCare':return[c('restDone','אַחֲרֵי מְנוּחָה','After rest','timer')];
 case'hurt':return[c('tummyHelp','בֶּטֶן','Tummy','bar-tummy'),c('dentistStart','שֵׁן','Tooth','bar-tooth'),c('ask:hug','חִבּוּק','Hug','heart')];
 case'help':{const result=[];if(s.needs.pee>=70)result.push(c('ask:pee','פִּיפִּי','Pee','need-pee'));if(s.needs.poo>=70||s.pooAche)result.push(c('ask:poo','קַקִּי','Poo','need-poo'));if(s.needs.hunger>=70)result.push(c('ask:food','אֹכֶל','Food','need-food'));if(s.needs.dirt>=70)result.push(c('ask:shower','מִקְלַחַת','Shower','dirty-shirt'));if(s.wetClothes||s.soiledClothes)result.push(c('changeClothes','בְּגָדִים','Clothes','clean-clothes'));if(s.tableBroken)result.push(c('tableFix','לְתַקֵּן','Repair','repair'));if(s.toothache)result.push(c('dentistStart','שֵׁן','Tooth','teeth'));if(s.tummy)result.push(c('tummyHelp','בֶּטֶן','Tummy','bar-tummy'));if(s.puddle||s.peePuddle)result.push(c('wipe','לְנַגֵּב','Wipe','towel'));if(s.toysOut)result.push(c('toysTidy','לְסַדֵּר','Tidy','basket'));if(s.wall)result.push(c('wipeWall','לְנַקּוֹת','Clean','towel'));if(s.loud)result.push(c('musicQuiet','שֶׁקֶט','Quiet','speaker'));return result.length?result:[c('ask:hug','חִבּוּק','Hug','heart'),c('ask:break','שֶׁקֶט','Quiet','cushion')];}
 default:return[];
}}
export const requests=[c('ask:food','אֹכֶל','Food','need-food'),c('ask:water','מַיִם','Water','water'),c('ask:pee','פִּיפִּי','Pee','need-pee'),c('ask:poo','קַקִּי','Poo','need-poo'),c('ask:shower','מִקְלַחַת','Shower','towel'),c('ask:help','עֶזְרָה','Help','repair'),c('ask:hug','חִבּוּק','Hug','heart'),c('ask:break','שֶׁקֶט','Quiet','cushion'),c('ask:hurt','כּוֹאֵב','It hurts','bar-tummy')];
