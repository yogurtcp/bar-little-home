export const SAVE_KEY='bar-little-home-v1';
export const initialState=()=>({version:1,parent:'mom',x:48,event:'welcome',menu:'explore',muted:false,smell:0,teethSkips:0,toothache:false,tummy:false,cry:false,tired:0,toiletNeed:0,tableBroken:false,toysOut:false,puddle:false,wall:false,loud:false,hungry:true,food:null,paper:false,adult:null,completed:[]});
const menus=['explore','table','candy','shower','teeth','water','toys','draw','music','sleep','toilet','food','help','hurt','showerCare','toiletCare','dentistCare','restCare'];
export function restore(raw){const base=initialState();try{const s=JSON.parse(raw);if(!s||s.version!==1)return base;for(const k of Object.keys(base)){if(k==='completed')base[k]=Array.isArray(s[k])?s[k].filter(x=>typeof x==='string'):[];else if(k==='adult')base[k]=s[k]&&['mom','dad'].includes(s[k].who)?{who:s[k].who,pose:['idle','food','water','hug','towel','repair'].includes(s[k].pose)?s[k].pose:'idle'}:null;else if(k==='food')base[k]=['banana','sandwich'].includes(s[k])?s[k]:null;else if(typeof s[k]===typeof base[k])base[k]=s[k];}base.x=Math.max(6,Math.min(94,Number.isFinite(base.x)?base.x:48));for(const k of['smell','teethSkips','tired','toiletNeed'])base[k]=Math.min(3,Math.max(0,base[k]));if(!menus.includes(base.menu))base.menu='explore';if(!['mom','dad'].includes(base.parent))base.parent='mom';return base;}catch{return base;}}
const context={table:['tableQuestion',23],candy:['candyQuestion',60],shower:['showerQuestion',94],teeth:['teethQuestion',75],water:['waterQuestion',32],toys:['toysQuestion',54],draw:['drawQuestion',39],music:['musicQuestion',66],sleep:['sleepQuestion',45],toilet:['toiletQuestion',85]};
const complete=(s,id)=>{if(!s.completed.includes(id))s.completed.push(id);};
const adult=(s,pose='idle')=>s.adult={who:s.parent,pose};
export function act(previous,action,value){const s=structuredClone(previous);let motion='';const say=(event,menu=s.menu)=>{s.event=event;s.menu=menu;};
 if(action.startsWith('open:')){const id=action.slice(5),c=context[id];if(c){say(c[0],id);s.x=c[1];motion='walk';if(id==='table'&&s.tableBroken)s.event='tableBreak';if(id==='toys'&&s.toysOut)s.event='toysBlocked';if(id==='teeth'&&s.toothache)s.event='toothache';}return{s,motion};}
 if(action==='parent'){s.parent=value;return{s,motion};}
 if(action==='walk'){if(s.toysOut&&((s.x<54&&value>54)||(s.x>54&&value<54))){say('toysBlocked','toys');s.x=s.x<54?47:62;}else s.x=Math.max(6,Math.min(94,value));motion='walk';return{s,motion};}
 if(action.startsWith('ask:')){const id=action.slice(4);adult(s,id==='hug'?'hug':id==='shower'?'towel':id==='food'?'food':id==='water'?'water':'idle');switch(id){case'food':say('foodChoice','food');break;case'water':say('waterDone','explore');complete(s,'water');break;case'shower':s.x=94;say('showerStart','showerCare');break;case'toilet':s.x=85;say('toiletStart','toiletCare');break;case'help':say('helpOffer','help');break;case'hug':s.cry=false;say('hugDone','explore');complete(s,'hug');break;case'break':s.loud=false;say('breakChoice','sleep');break;case'hurt':say('hurtChoice','hurt');break;}return{s,motion};}
 switch(action){
 case'explore':say('welcome','explore');s.adult=null;break;
 case'tableSit':if(!s.tableBroken){s.x=22;say('tableSit');}else say('tableBreak','help');break;
 case'tableJump':if(!s.tableBroken){s.x=27;s.tableBroken=true;s.cry=true;motion='jump';say('tableBreak','table');}else say('tableBreak','help');break;
 case'tableFix':adult(s,'repair');s.tableBroken=false;s.cry=false;say('tableFix','explore');complete(s,'table');break;
 case'cushionJump':s.x=45;motion='jump';say('cushionJump','sleep');break;
 case'candyOne':say('candyOne','candy');break;
 case'candyMany':s.tummy=true;s.x=58;say('candyMany','candy');break;
 case'tummyHelp':adult(s,'hug');say('tummyHelp','sleep');break;
 case'showerLater':s.smell=Math.min(3,s.smell+1);say(s.smell>=2?'showerOdor':'showerLater','shower');break;
 case'showerDone':s.smell=0;adult(s,'towel');s.x=89;motion='fresh';say('showerDone','explore');complete(s,'shower');break;
 case'teethLater':s.teethSkips=Math.min(3,s.teethSkips+1);if(s.teethSkips>=3)s.toothache=true;say(s.toothache?'toothache':s.teethSkips===2?'teethWarning':'teethLater','teeth');break;
 case'brush':adult(s);s.teethSkips=0;s.x=75;motion='brush';say(s.toothache?'brushPain':'brushDone','teeth');complete(s,'brush');break;
 case'dentistStart':adult(s);say('dentistStart','dentistCare');break;
 case'dentistDone':s.toothache=false;s.teethSkips=0;say('dentistDone','explore');complete(s,'dentist');break;
 case'foodBanana':case'foodSandwich':s.food=action==='foodBanana'?'banana':'sandwich';s.hungry=false;adult(s,'food');say('foodDone','explore');complete(s,'food');break;
 case'spill':s.puddle=true;s.x=32;say('spill','water');break;
 case'wipe':s.puddle=false;adult(s,'towel');say('wipe','explore');complete(s,'spill');break;
 case'toysOut':s.toysOut=true;s.x=46;say('toysOut','toys');break;
 case'toysTidy':s.toysOut=false;say('toysTidy','explore');complete(s,'toys');break;
 case'wallDraw':s.wall=true;s.x=40;say('wallDraw','draw');break;
 case'paperDraw':s.paper=true;say('paperDraw','draw');complete(s,'paper');break;
 case'wipeWall':s.wall=false;adult(s,'towel');say('wipeWall','draw');complete(s,'wall');break;
 case'musicLoud':s.loud=true;say('musicLoud','music');break;
 case'musicQuiet':s.loud=false;say('musicQuiet','explore');complete(s,'quiet');break;
 case'sleepLater':s.tired=Math.min(3,s.tired+1);say(s.tired>=2?'sleepy':'sleepLater','sleep');break;
 case'napStart':s.x=45;s.loud=false;adult(s,'hug');say('napStart','restCare');break;
 case'restDone':s.tired=0;s.tummy=false;motion='fresh';say('restDone','explore');complete(s,'rest');break;
 case'toiletLater':s.toiletNeed=Math.min(3,s.toiletNeed+1);say(s.toiletNeed>=2?'toiletUrgent':'toiletLater','toilet');break;
 case'toiletDone':s.toiletNeed=0;s.x=78;adult(s);say('toiletDone','explore');complete(s,'toilet');break;
 }
 return{s,motion};
}
const c=(id,he,en,icon)=>({id,he,en,icon});
export function choices(s){switch(s.menu){
 case'table':return s.tableBroken?[c('ask:help','לבקש עזרה','Ask for help','repair'),c('ask:hug','חיבוק','A hug','heart')]:[c('tableSit','לשבת','Sit down','table'),c('tableJump','לקפוץ על השולחן','Jump on the table','bar-jump'),c('cushionJump','לקפוץ על כרית','Bounce on cushion','cushion')];
 case'candy':return[c('candyOne','ממתק קטן','One small sweet','candy'),c('candyMany','הרבה ממתקים','Lots of sweets','candy-pile'),...(s.tummy?[c('ask:hurt','כואבת לי הבטן','My tummy hurts','bar-tummy')]:[])];
 case'shower':return[c('ask:shower','לבקש מקלחת','Ask for a shower','towel'),c('showerLater','אחר כך… זמן עובר','Later… time passes','timer')];
 case'teeth':return[c('brush','לצחצח ביחד','Brush together','teeth'),c('teethLater','לדלג… זמן עובר','Skip… time passes','timer'),...(s.toothache?[c('ask:hurt','כואבת לי השן','My tooth hurts','bar-tooth')]:[])];
 case'water':return[c('ask:water','לבקש מים','Ask for water','water'),c('spill','להפוך את הכוס','Tip the cup','puddle'),...(s.puddle?[c('wipe','לנגב ביחד','Wipe together','towel')]:[])];
 case'toys':return s.toysOut?[c('toysTidy','להחזיר לסל','Put away','basket'),c('ask:help','לבקש עזרה','Ask for help','repair')]:[c('toysOut','לשחק ולהשאיר','Play and leave out','toys')];
 case'draw':return[c('paperDraw','לצייר על נייר','Draw on paper','paper'),c('wallDraw','לצייר על הקיר','Draw on the wall','scribble'),...(s.wall?[c('wipeWall','לנקות ביחד','Clean together','towel')]:[])];
 case'music':return[c('musicQuiet','עוצמה נעימה','Comfortable volume','speaker'),c('musicLoud','חזק מדי בסיפור','Too loud in the story','speaker')];
 case'sleep':return[c('napStart','לנוח קצת','Rest a while','bar-sleep'),c('sleepLater','להמשיך… זמן עובר','Keep playing… time passes','timer'),c('cushionJump','לקפוץ על כרית','Bounce on cushion','cushion')];
 case'toilet':return[c('ask:toilet','לבקש שירותים','Ask for the toilet','toilet'),c('toiletLater','לחכות… זמן עובר','Wait… time passes','timer')];
 case'food':return[c('foodBanana','בננה','Banana','banana'),c('foodSandwich','כריך','Sandwich','sandwich')];
 case'showerCare':return[c('showerDone','להתרחץ ולהתלבש','Wash and get dressed','towel')];
 case'toiletCare':return[c('toiletDone','שירותים ושטיפת ידיים','Toilet and wash hands','toilet')];
 case'dentistCare':return[c('dentistDone','אחרי ביקור וטיפול','After a dentist visit','teeth')];
 case'restCare':return[c('restDone','אחרי המנוחה','After our rest','timer')];
 case'hurt':return[c('tummyHelp','כואבת לי הבטן','My tummy hurts','bar-tummy'),c('dentistStart','כואבת לי השן','My tooth hurts','bar-tooth'),c('ask:hug','רוצה חיבוק','I want a hug','heart')];
 case'help':{const result=[];if(s.tableBroken)result.push(c('tableFix','לתקן עם הורה','Repair with a parent','repair'));if(s.toothache)result.push(c('dentistStart','עזרה לשן','Help for my tooth','teeth'));if(s.tummy)result.push(c('tummyHelp','עזרה לבטן','Help for my tummy','bar-tummy'));if(s.puddle)result.push(c('wipe','לנגב ביחד','Wipe together','towel'));if(s.toysOut)result.push(c('toysTidy','לסדר ביחד','Tidy together','basket'));if(s.wall)result.push(c('wipeWall','לנקות את הקיר','Clean the wall','towel'));if(s.loud)result.push(c('musicQuiet','להנמיך','Turn it down','speaker'));return result.length?result:[c('ask:hug','חיבוק','A hug','heart'),c('ask:break','הפסקה שקטה','A quiet break','cushion')];}
 default:return[];
}}
export const requests=[c('ask:food','אני רעב','I am hungry','sandwich'),c('ask:water','אני צמא','I am thirsty','water'),c('ask:shower','מקלחת בבקשה','A shower, please','towel'),c('ask:toilet','צריך שירותים','I need the toilet','toilet'),c('ask:help','עזרה בבקשה','Help, please','repair'),c('ask:hug','רוצה חיבוק','I want a hug','heart'),c('ask:break','רוצה שקט','I want quiet','cushion'),c('ask:hurt','כואב לי','Something hurts','bar-tummy')];
