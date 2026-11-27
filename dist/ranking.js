// Compare weekly schedules only when the entire expression is understood.
// Unsupported holiday, seasonal and conditional rules are shown verbatim.
const NookRank=(()=>{
const DAYS=['Mo','Tu','We','Th','Fr','Sa','Su'],ZONE='America/Los_Angeles';
const formatter=new Intl.DateTimeFormat('en-US',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23',weekday:'short'});
const parts=d=>Object.fromEntries(formatter.formatToParts(d).map(x=>[x.type,x.value]));
function plan(when,duration,now=new Date()){
 let start=new Date(Math.floor(+now/60000)*60000+(when==='1'?3600000:0));
 if(when==='2'){const p=parts(now),target=Date.UTC(+p.year,+p.month-1,+p.day+1,10),probe=parts(new Date(target));start=new Date(target+(target-Date.UTC(+probe.year,+probe.month-1,+probe.day,+probe.hour,+probe.minute)))}
 return {start,end:new Date(+start+duration*3600000)};
}
function schedule(raw){
 if(raw==='24/7')return [[0,10080]];
 if(!raw)return null;
 const slots=[];
 for(const rule of raw.split(';')){
 const m=/^\s*((?:Mo|Tu|We|Th|Fr|Sa|Su)(?:[-,](?:Mo|Tu|We|Th|Fr|Sa|Su))*(?:\s+))?((?:\d\d:\d\d-\d\d:\d\d)(?:,\s*\d\d:\d\d-\d\d:\d\d)*)\s*$/.exec(rule);if(!m)return null;
 const days=new Set();
 if(!m[1])DAYS.forEach((_,i)=>days.add(i));else for(const spec of m[1].trim().split(',')){const [a,b]=spec.split('-');let i=DAYS.indexOf(a),end=DAYS.indexOf(b||a);if(i<0||end<0||spec.split('-').length>2)return null;for(let n=0;n<7;n++,i=(i+1)%7){days.add(i);if(i===end)break}}
 for(const span of m[2].split(',')){const [h,min,H,M]=span.trim().split(/[:-]/).map(Number);if(h>23||H>24||min>59||M>59||(H===24&&M))return null;const a=h*60+min;let b=H*60+M;if(b<=a)b+=1440;for(const d of days)slots.push([d*1440+a,d*1440+b])}
 }return slots;
}
function coverage(raw,session){const slots=schedule(raw);if(!slots)return 'unknown';
 if(!session.weeks){session.weeks=[];for(let t=+session.start;t<+session.end;t+=60000){const p=parts(new Date(t));session.weeks.push(['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].indexOf(p.weekday)*1440+Number(p.hour)*60+Number(p.minute))}}for(const week of session.weeks){if(!slots.some(([a,b])=>(week>=a&&week<b)||(week+10080>=a&&week+10080<b)))return 'outside'}return 'fits'}
function meters(v){const rad=Math.PI/180,a=Math.sin((v.lat-37.8697)*rad/2)**2+Math.cos(37.8697*rad)*Math.cos(v.lat*rad)*Math.sin((v.lon+122.2591)*rad/2)**2;return Math.round(12742000*Math.asin(Math.sqrt(a)))}
function evaluate(v,goal,coverage,preference=0){const desired=goal==='focus'?'library':'cafe',d=meters(v);return {v,d,coverage,score:(v.kind===desired?35:0)+(coverage==='fits'?35:0)+Math.round(30*Math.max(0,1-d/1500))+preference}}
return {plan,coverage,meters,evaluate,ZONE};
})();if(typeof module!=='undefined')module.exports=NookRank;
