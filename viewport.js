// The house, actors and touch targets share one undistorted 16:9 scene.
// The tablet frame fills the available height and views the appropriate room.
export const HOUSE_RATIO=16/9;
export function fitHouse(width,height,focus=50){
 const sceneHeight=Math.max(1,height),sceneWidth=sceneHeight*HOUSE_RATIO;
 const viewWidth=Math.max(1,Math.min(width,sceneWidth));
 const cameraX=Math.max(0,Math.min(sceneWidth-viewWidth,focus/100*sceneWidth-viewWidth/2));
 return{width:viewWidth,height:sceneHeight,sceneWidth,sceneHeight,cameraX,cropped:sceneWidth-viewWidth>16};
}
export function toScreen(view,x,y){return{x:x/100*view.sceneWidth-view.cameraX,y:y/100*view.sceneHeight};}
export function toHouse(view,x,y){return{x:Math.max(0,Math.min(100,(x+view.cameraX)/view.sceneWidth*100)),y:y/view.sceneHeight*100};}
export const rooms=[
 {id:'kitchen',he:'מִטְבָּח',en:'Kitchen',x:17,icon:'need-food'},
 {id:'living',he:'סָלוֹן',en:'Living',x:50,icon:'cushion'},
 {id:'bathroom',he:'רַחְצָה',en:'Bathroom',x:85,icon:'towel'}
];
