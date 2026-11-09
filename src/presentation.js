// Concise, fully pointed labels; complete sentences stay in the narration.
export const labels={
 'ask:food':['אֹכֶל','Food'],'ask:water':['מַיִם','Water'],'ask:shower':['מִקְלַחַת','Shower'],'ask:toilet':['שֵׁרוּתִים','Toilet'],'ask:pee':['פִּיפִּי','Pee'],'ask:poo':['קַקִּי','Poo'],'ask:help':['עֶזְרָה','Help'],'ask:hug':['חִבּוּק','Hug'],'ask:break':['שֶׁקֶט','Quiet'],'ask:hurt':['כּוֹאֵב לִי','It hurts'],
 tableSit:['לָשֶׁבֶת','Sit'],tableJump:['לִקְפֹּץ','Jump'],tableFix:['לְתַקֵּן','Repair'],cushionJump:['עַל כָּרִית','Cushion'],
 candyOne:['קְצָת','A little'],candyMany:['הַרְבֵּה','A lot'],tummyHelp:['בֶּטֶן','Tummy'],
 showerLater:['אַחַר כָּךְ','Later'],showerDone:['לְהִתְרַחֵץ','Wash'],teethLater:['אַחַר כָּךְ','Later'],brush:['לְצַחְצֵחַ','Brush'],dentistStart:['שֵׁן','Tooth'],dentistDone:['אַחֲרֵי טִפּוּל','After care'],
 foodBanana:['בָּנָנָה','Banana'],foodSandwich:['כָּרִיךְ','Sandwich'],foodLater:['אַחַר כָּךְ','Later'],spill:['לַהֲפֹךְ','Tip over'],wipe:['לְנַגֵּב','Wipe'],toysOut:['לְשַׂחֵק','Play'],play:['לְשַׂחֵק','Play'],toysTidy:['לְסַדֵּר','Tidy'],
 wallDraw:['עַל הַקִּיר','Wall'],paperDraw:['עַל נְיָר','Paper'],wipeWall:['לְנַקּוֹת','Clean'],musicLoud:['חָזָק מִדַּי','Too loud'],musicQuiet:['נָעִים','Gentle'],sleepLater:['עוֹד מִשְׂחָק','More play'],napStart:['לָנוּחַ','Rest'],restDone:['אַחֲרֵי מְנוּחָה','After rest'],toiletLater:['אַחַר כָּךְ','Later'],toiletDone:['סִיַּמְתִּי','All done'],
 usePee:['פִּיפִּי','Pee'],usePoo:['קַקִּי','Poo'],peeLater:['אַחַר כָּךְ','Later'],pooLater:['אַחַר כָּךְ','Later'],peeDone:['סִיַּמְתִּי','All done'],pooDone:['סִיַּמְתִּי','All done'],washHands:['לִשְׁטֹף','Wash hands'],handsLater:['אַחַר כָּךְ','Later'],changeClothes:['בְּגָדִים','Clothes']
};
export const needInfo={pee:{he:'פִּיפִּי',en:'Pee',icon:'need-pee',menu:'pee',color:'#eac44e'},poo:{he:'קַקִּי',en:'Poo',icon:'need-poo',menu:'poo',color:'#ae7852'},hunger:{he:'רָעָב',en:'Hunger',icon:'need-food',menu:'food',color:'#ea9657'},dirt:{he:'לִכְלוּךְ',en:'Dirt',icon:'dirty-shirt',menu:'shower',color:'#88a75f'}};
export const objects=[
 {id:'food',he:'אֹכֶל',en:'Food',x:7,y:48,w:12,h:48},
 {id:'table',he:'שֻׁלְחָן',en:'Table',x:21,y:74,w:18,h:30},
 {id:'water',he:'מַיִם',en:'Water',x:32,y:66,w:7,h:14},
 {id:'candy',he:'מַמְתַּקִּים',en:'Sweets',x:60,y:41,w:8,h:18},
 {id:'toys',he:'צַעֲצוּעִים',en:'Toys',x:55,y:82,w:12,h:20},
 {id:'draw',he:'צִיּוּר',en:'Drawing',x:39,y:47,w:9,h:19},
 {id:'music',he:'מוּזִיקָה',en:'Music',x:66,y:55,w:7,h:17},
 {id:'sleep',he:'מְנוּחָה',en:'Rest',x:45,y:85,w:12,h:14},
 {id:'teeth',he:'שִׁנַּיִם',en:'Teeth',x:75,y:49,w:8,h:20},
 {id:'hands',he:'יָדַיִם',en:'Hands',x:75,y:65,w:9,h:17},
 {id:'toilet',he:'שֵׁרוּתִים',en:'Toilet',x:85,y:56,w:10,h:29},
 {id:'shower',he:'מִקְלַחַת',en:'Shower',x:94,y:47,w:10,h:45},
 {id:'laundry',he:'בְּגָדִים',en:'Clothes',x:94,y:88,w:10,h:16}
];
export function choiceAnchor(state){const object=objects.find(o=>o.id===state.menu);if(object)return{x:object.x,y:object.y};const care={showerCare:'shower',toiletCare:'toilet',pee:'toilet',poo:'toilet',peeCare:'toilet',pooCare:'toilet',accident:'laundry',restCare:'sleep',dentistCare:'teeth'}[state.menu];if(care){const o=objects.find(o=>o.id===care);return{x:o.x,y:o.y};}return{x:state.x,y:65};}
export const eventArt={askPee:'need-pee',askPoo:'need-poo',needPee:'need-pee',needPoo:'need-poo',peeFull:'need-pee',pooFull:'need-poo',peeAccident:'clean-clothes',pooAccident:'laundry',needFood:'need-food',needDirty:'dirty-shirt',playMore:'play-ball',waterDone:'water',foodDone:'need-food',foodFull:'need-food',candyMany:'candy-pile',showerDone:'towel',changeClothes:'clean-clothes',washHandsDone:'wash-hands',peeDone:'need-pee',pooDone:'need-poo',tableBreak:'table-broken',tableFix:'repair',restDone:'cushion',brushDone:'teeth',holdPoo:'bar-poo'};
export function consequenceChain(id){
 if(['peeQuestion','needPee','peeFull'].includes(id))return['water','need-pee','toilet'];
 if(['pooQuestion','needPoo','pooFull','holdPoo'].includes(id))return['need-food','need-poo','toilet'];
 if(id==='peeAccident')return['need-pee','bar-wet','clean-clothes'];
 if(id==='pooAccident')return['need-poo','laundry','towel'];
 if(['needDirty','showerOdor'].includes(id))return['play-ball','dirty-shirt','towel'];
 if(id==='needFood')return['play-ball','bar-hungry','need-food'];
 if(['candyMany','overeaten'].includes(id))return[id==='candyMany'?'candy-pile':'need-food','bar-tummy','cushion'];
 if(id==='tableBreak')return['bar-jump','table-broken','repair'];
 if(id==='tableFix')return['table-broken','repair','table'];
 if(id==='showerDone')return['dirty-shirt','towel','clean-clothes'];
 if(id==='peeDone')return['need-pee','toilet','wash-hands'];
 if(id==='pooDone')return['need-poo','toilet','wash-hands'];
 if(id==='changeClothes')return['dirty-shirt','laundry','clean-clothes'];
 return[];
}
