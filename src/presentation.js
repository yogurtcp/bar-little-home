// Picture labels stay short; aria-labels retain the complete communication phrase.
export const labels={
 'ask:food':['אוכל','Food'],'ask:water':['מים','Water'],'ask:shower':['מקלחת','Shower'],'ask:toilet':['שירותים','Toilet'],'ask:help':['עזרה','Help'],'ask:hug':['חיבוק','Hug'],'ask:break':['שקט','Quiet'],'ask:hurt':['כואב לי','It hurts'],
 tableSit:['לשבת','Sit'],tableJump:['לקפוץ','Jump'],tableFix:['לתקן','Repair'],cushionJump:['על הכרית','Cushion'],
 candyOne:['קצת','A little'],candyMany:['הרבה','A lot'],tummyHelp:['בטן','Tummy'],
 showerLater:['אחר כך','Later'],showerDone:['להתרחץ','Wash'],teethLater:['אחר כך','Later'],brush:['לצחצח','Brush'],dentistStart:['שן','Tooth'],dentistDone:['אחרי טיפול','After care'],
 foodBanana:['בננה','Banana'],foodSandwich:['כריך','Sandwich'],spill:['להפוך','Tip over'],wipe:['לנגב','Wipe'],toysOut:['לשחק','Play'],toysTidy:['לסדר','Tidy'],
 wallDraw:['על הקיר','Wall'],paperDraw:['על נייר','Paper'],wipeWall:['לנקות','Clean'],musicLoud:['חזק מדי','Too loud'],musicQuiet:['נעים','Gentle'],sleepLater:['עוד משחק','More play'],napStart:['לנוח','Rest'],restDone:['אחרי מנוחה','After rest'],toiletLater:['אחר כך','Later'],toiletDone:['סיימתי','All done']
};
export const objects=[
 {id:'table',he:'שולחן',en:'Table',x:21,y:74,w:18,h:30},
 {id:'water',he:'מים',en:'Water',x:32,y:66,w:7,h:14},
 {id:'candy',he:'ממתקים',en:'Sweets',x:60,y:41,w:8,h:18},
 {id:'toys',he:'צעצועים',en:'Toys',x:55,y:82,w:12,h:20},
 {id:'draw',he:'ציור',en:'Drawing',x:39,y:47,w:9,h:19},
 {id:'music',he:'מוזיקה',en:'Music',x:66,y:55,w:7,h:17},
 {id:'sleep',he:'מנוחה',en:'Rest',x:45,y:85,w:12,h:14},
 {id:'teeth',he:'שיניים',en:'Teeth',x:75,y:49,w:8,h:20},
 {id:'toilet',he:'שירותים',en:'Toilet',x:85,y:56,w:10,h:29},
 {id:'shower',he:'מקלחת',en:'Shower',x:94,y:47,w:10,h:45}
];
export function choiceAnchor(state){const object=objects.find(o=>o.id===state.menu);if(object)return{x:object.x,y:object.y};const care={showerCare:'shower',toiletCare:'toilet',restCare:'sleep',dentistCare:'teeth'}[state.menu];if(care){const o=objects.find(o=>o.id===care);return{x:o.x,y:o.y};}return{x:state.x,y:65};}
