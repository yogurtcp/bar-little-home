export const needIds=['pee','poo','hunger','dirt'];
export const clamp=(v,max=100)=>Math.max(0,Math.min(max,Number.isFinite(Number(v))?Number(v):0));
export const newSimulation=()=>({modelVersion:2,needs:{pee:24,poo:16,hunger:38,dirt:12},clock:{minutes:0,paused:false,speed:1},digestion:[],urgency:{pee:0,poo:0},announced:{},wetClothes:false,soiledClothes:false,peePuddle:false,peePuddleX:48,handsDirty:false,candyAche:false,overeatAche:false,pooAche:false,hungerWeak:false,fatigue:8,activity:'idle',mealLoad:0,journal:[]});
export function migrateSimulation(s,raw){const d=newSimulation(),v=raw||{};for(const k of['wetClothes','soiledClothes','peePuddle','handsDirty','candyAche','overeatAche','pooAche','hungerWeak'])d[k]=typeof v[k]==='boolean'?v[k]:d[k];
 if(v.modelVersion===2){for(const id of needIds)d.needs[id]=clamp(v.needs?.[id]??d.needs[id]);d.clock={minutes:clamp(v.clock?.minutes,1e7),paused:!!v.clock?.paused,speed:v.clock?.speed===2?2:1};for(const id of['pee','poo'])d.urgency[id]=clamp(v.urgency?.[id],60);d.digestion=Array.isArray(v.digestion)?v.digestion.filter(q=>['pee','poo'].includes(q.need)&&Number.isFinite(q.at)&&Number.isFinite(q.amount)).slice(0,30).map(q=>({need:q.need,at:clamp(q.at,1e7),amount:clamp(q.amount)})):[];d.peePuddleX=Math.max(6,Math.min(94,Number.isFinite(v.peePuddleX)?v.peePuddleX:48));d.fatigue=clamp(v.fatigue??8);d.mealLoad=clamp(v.mealLoad,200);d.activity=['idle','play','draw','rest'].includes(v.activity)?v.activity:'idle';d.announced=Object.fromEntries(Object.entries(v.announced||{}).filter(([k,t])=>/^(pee|poo|hunger|dirt):\d+$/.test(k)&&Number.isFinite(t)));d.journal=Array.isArray(v.journal)?v.journal.filter(e=>typeof e.id==='string'&&Number.isFinite(e.at)).slice(-18).map(e=>({id:e.id,at:clamp(e.at,1e7),kind:e.kind==='care'?'care':e.kind==='need'?'need':'action',needs:Object.fromEntries(needIds.map(id=>[id,clamp(e.needs?.[id])]))})):[];
 }else{if(typeof v.hungry==='boolean')d.needs.hunger=v.hungry?48:8;if(Number.isFinite(v.smell))d.needs.dirt=clamp(v.smell/3*100);if(Number.isFinite(v.toiletNeed))d.needs.pee=clamp(v.toiletNeed/3*90);if(Number.isFinite(v.tired))d.fatigue=clamp(v.tired/3*90);d.candyAche=!!v.tummy;}
 Object.assign(s,d);syncBody(s);return s;
}
export function syncBody(s){for(const id of needIds)s.needs[id]=Math.round(clamp(s.needs[id])*100)/100;s.fatigue=clamp(s.fatigue);s.hungry=s.needs.hunger>=25;s.smell=s.needs.dirt>=70?3:s.needs.dirt>=45?2:s.needs.dirt>=20?1:0;s.toiletNeed=Math.max(s.needs.pee,s.needs.poo)>=85?3:Math.max(s.needs.pee,s.needs.poo)>=60?2:Math.max(s.needs.pee,s.needs.poo)>=30?1:0;s.tired=Math.min(3,Math.floor(s.fatigue/25));s.tummy=!!(s.candyAche||s.overeatAche||s.pooAche);s.hungerWeak=s.needs.hunger>=95;return s;}
export function record(s,id,kind='action'){s.journal.push({id,at:s.clock.minutes,kind,needs:{...s.needs}});s.journal=s.journal.slice(-18);}
export function queue(s,need,amount,delay){s.digestion.push({need,amount,at:s.clock.minutes+delay});s.digestion=s.digestion.slice(-30);}
const priority={peeAccident:10,pooAccident:10,holdPoo:8,peeFull:7,pooFull:7,needFood:6,needDirty:5,needPee:3,needPoo:3};
export function advance(s,minutes=1){const events=[];const emit=id=>{events.push(id);record(s,id,'need');};
 for(let i=0;i<Math.max(0,Math.min(180,Math.floor(minutes)));i++){
  s.clock.minutes++;const playing=s.activity==='play',drawing=s.activity==='draw';s.needs.pee+=.23;s.needs.poo+=.12;s.needs.hunger+=playing?.48:.24;s.needs.dirt+=playing?.55:drawing?.30:.08;s.fatigue=clamp(s.fatigue+(playing?.22:.08));s.mealLoad=Math.max(0,s.mealLoad-.24);
  const due=s.digestion.filter(q=>q.at<=s.clock.minutes);s.digestion=s.digestion.filter(q=>q.at>s.clock.minutes);for(const q of due)s.needs[q.need]+=q.amount;
  for(const id of needIds)s.needs[id]=clamp(s.needs[id]);
  for(const id of['pee','poo']){
   s.urgency[id]=s.needs[id]>=100?s.urgency[id]+1:0;
   if(id==='poo'&&s.needs.poo>=95&&s.urgency.poo>=8&&!s.pooAche){s.pooAche=true;emit('holdPoo');}
   if(s.urgency[id]>=(id==='pee'?20:30)){
    s.needs[id]=4;s.urgency[id]=0;s.activity='idle';s.cry=true;
    if(id==='pee'){s.wetClothes=true;s.peePuddle=true;s.peePuddleX=s.x;s.needs.dirt=Math.max(s.needs.dirt,75);emit('peeAccident');}
    else{s.soiledClothes=true;s.pooAche=false;s.needs.dirt=100;emit('pooAccident');}
   }
  }
  if(s.needs.hunger>=95)s.activity='idle';
  for(const id of needIds){if(s.needs[id]<45){delete s.announced[id+':70'];delete s.announced[id+':95'];}for(const threshold of[70,95]){const key=id+':'+threshold;if(s.needs[id]>=threshold&&s.announced[key]===undefined){s.announced[key]=s.clock.minutes;const msg=id==='pee'?(threshold===95?'peeFull':'needPee'):id==='poo'?(threshold===95?'pooFull':'needPoo'):id==='hunger'?'needFood':'needDirty';emit(msg);}}}
 }
 syncBody(s);const cue=events.sort((a,b)=>(priority[b]||0)-(priority[a]||0))[0]||null;return cue;
}
export function needStatus(n){return n>=95?'urgent':n>=70?'high':n>=45?'growing':'comfortable';}
