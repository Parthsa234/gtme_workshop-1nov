/* GTME Live Build Workshop — interactions and motion. Everything readable is already in the HTML; this only updates and animates it. */
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- CONFIG: edit these before launch ---------- */
var CONFIG={
  payLink:"",        // Razorpay payment page for the ₹99 seat, e.g. "https://rzp.io/l/gtme-workshop"
  payLinkKit:"",     // Razorpay page for ₹598 (seat + Starter Kit). Leave empty to hide the add-on
  whatsapp:"",       // number with country code, digits only, e.g. "919876543210". Empty hides the button
  vsl:"",            // Loom or YouTube link. Empty hides the video block
  slots:[{dow:3,h:20,m:0},{dow:6,h:11,m:0}],  // Wed 20:00 IST, Sat 11:00 IST (0 = Sunday)
  oneOff:{y:2026,mo:10,d:1,h:15,m:0,duration:180} // Sunday 1 Nov 2026, 15:00–18:00 IST
};

/* ---------- schedule (IST) ---------- */
var IST=330*60000,DOW=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],DOWL=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function pad(n){return n<10?"0"+n:""+n}
function parts(t){var d=new Date(t+IST);return{y:d.getUTCFullYear(),mo:d.getUTCMonth(),d:d.getUTCDate(),dow:d.getUTCDay(),h:d.getUTCHours(),mi:d.getUTCMinutes()}}
function oneOffTime(){var o=CONFIG.oneOff;return Date.UTC(o.y,o.mo,o.d)+(o.h*60+o.m)*60000-IST}
function timeLabel(t){var p=parts(t),label=pad(p.h)+":"+pad(p.mi);if(t===oneOffTime()){var end=parts(t+CONFIG.oneOff.duration*60000);label+="–"+pad(end.h)+":"+pad(end.mi)}return label+" IST"}
function nextSessions(n){var now=Date.now(),b=parts(now),out=[],special=oneOffTime(),hasSpecial=special>now+5*60000;
  for(var i=0;i<21&&out.length<n;i++){var day=Date.UTC(b.y,b.mo,b.d+i),dw=new Date(day).getUTCDay();
    CONFIG.slots.forEach(function(s){if(s.dow===dw){var t=day+(s.h*60+s.m)*60000-IST;if(t>now+5*60000&&(!hasSpecial||t>=special))out.push(t)}})}
  if(hasSpecial)out.push(special);
  return out.sort(function(a,b){return a-b}).slice(0,n)}
function fmt(t,long){var p=parts(t);return (long?DOWL:DOW)[p.dow]+" "+p.d+" "+MON[p.mo]+" · "+timeLabel(t)}
function zone(t,tz){try{return new Intl.DateTimeFormat("en-GB",{timeZone:tz,hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(t))}catch(e){return"—"}}
function cdText(ms){ms=Math.max(0,ms);var D=Math.floor(ms/864e5);ms-=D*864e5;var h=Math.floor(ms/36e5);ms-=h*36e5;var m=Math.floor(ms/6e4);return (D?D+"d ":"")+pad(h)+"h "+pad(m)+"m"}
var sessions=nextSessions(4);
function chosen(){var c=$("[name=session]:checked");return c?+c.value:sessions[0]}
var lastU={};
function tick(){
  var now=Date.now();if(sessions[0]<=now)sessions=nextSessions(4),renderSessions();
  var t=sessions[0],p=parts(t);
  $$("[data-next]").forEach(function(e){e.textContent=fmt(t,e.hasAttribute("data-long"))});
  $$("[data-next-day]").forEach(function(e){e.textContent=DOW[p.dow]+" "+p.d+" "+MON[p.mo]});
  $$("[data-next-time]").forEach(function(e){e.textContent=timeLabel(t)});
  $$("[data-cd]").forEach(function(e){e.textContent=cdText(t-now)});
  var ms=Math.max(0,t-now),u={d:Math.floor(ms/864e5),h:Math.floor(ms/36e5)%24,m:Math.floor(ms/6e4)%60,s:Math.floor(ms/1e3)%60};
  $$("[data-u]").forEach(function(e){var k=e.getAttribute("data-u"),v=pad(u[k]);if(e.textContent!==v){e.textContent=v;if(!reduce&&lastU[k]!==undefined){e.classList.remove("tick");void e.offsetWidth;e.classList.add("tick")}}lastU[k]=v});
}
function renderSessions(){var box=$("[data-sessions]");if(!box)return;
  box.innerHTML=sessions.map(function(t,i){return '<label class="sess"><input type="radio" name="session" id="s'+i+'" value="'+t+'"'+(i?'':' checked')+'><span class="t"><b>'+fmt(t,true)+'</b><span>'+zone(t,"Europe/London")+' London · '+zone(t,"America/New_York")+' New York · '+zone(t,"Asia/Dubai")+' Dubai</span></span><span class="st">'+(i?'OPEN':'NEXT')+'</span></label>'}).join("")}
renderSessions();tick();setInterval(tick,1000);

/* ---------- header progress ---------- */
var prog=$(".progress");
function onScroll(){var h=document.documentElement,max=h.scrollHeight-h.clientHeight;if(prog)prog.style.transform="scaleX("+(max>0?h.scrollTop/max:0)+")"}
window.addEventListener("scroll",onScroll,{passive:true});onScroll();

/* ---------- headline rotator (motion blur swap) ---------- */
var rot=$("[data-rot]");
if(rot&&!reduce){var words=$$("span",rot),wi=0;
  setInterval(function(){if(document.hidden)return;var cur=words[wi];wi=(wi+1)%words.length;var nx=words[wi];
    cur.classList.remove("on");cur.classList.add("out");nx.classList.remove("out");nx.classList.add("on");
    setTimeout(function(){cur.classList.remove("out")},600)},2200)}

/* ---------- live-build console ---------- */
var con=$("[data-console]");
if(con&&!reduce){
  var ROWS=[
    ["saasflow.ai","raised Series A","prospeo","T1","Congrats on the Series A. Usually the next hire is a head of sales, and the list they inherit is the first thing that breaks."],
    ["payrollhq.in","hiring 5 BDRs","apollo","T1","Five BDR roles open in Pune. That's the point where list quality starts to decide how fast they ramp."],
    ["kitchen-os.com","switched to HubSpot","prospeo","T2","Saw the move to HubSpot. The first month is when old sequences quietly stop landing."],
    ["medrecs.io","new VP Sales","prospeo","T1","A new VP Sales in their first 90 days is usually asked for pipeline before the team is ready to build it."],
    ["logiship.co","expanding to UAE","none","T3","Opening Dubai means outbound into a market nobody on the team has worked before."],
    ["edgecrm.dev","bought Clay","apollo","T2","Noticed Clay on your stack. Most teams use about a tenth of it in the first quarter."]
  ];
  var tbl=$("[data-table]",con),line=$("[data-line]",con),steps=$$("[data-steps] span",con),minEl=$("[data-min]",con),found=$("[data-found]",con);
  var s1=$("[data-s1]",con),s2=$("[data-s2]",con),s3=$("[data-s3]",con),n1=148,n2=121,n3=96,ri=0,minute=62,visible=true,typing=null,hits=3,total=5;
  function setStep(i){steps.forEach(function(s,j){s.classList.toggle("on",j===i);s.classList.toggle("done",j<i)})}
  function type(txt,done){clearInterval(typing);var i=0;line.textContent="";typing=setInterval(function(){i+=2;line.textContent=txt.slice(0,i);if(i>=txt.length){clearInterval(typing);done&&done()}},22)}
  function cycle(){
    if(!visible||document.hidden)return;
    var r=ROWS[ri%ROWS.length];ri++;
    setStep(1);
    var row=document.createElement("div");row.className="tr new hl";
    row.innerHTML='<span>'+r[0]+'</span><span>'+r[1]+'</span><span class="wf"><span class="spin" aria-hidden="true"></span></span><span'+(r[3]==="T1"?' class="tier"':'')+'>'+r[3]+'</span>';
    var head=tbl.children[0];tbl.insertBefore(row,head.nextSibling);
    $$(".tr.hl",tbl).forEach(function(x){if(x!==row)x.classList.remove("hl")});
    while(tbl.children.length>5)tbl.removeChild(tbl.lastChild);
    setTimeout(function(){var wf=row.children[2];
      if(r[2]==="apollo")wf.innerHTML='<em class="hit">Apollo ✓</em>';
      else if(r[2]==="prospeo")wf.innerHTML='<em class="miss">Apollo</em><em class="hit">Prospeo ✓</em>';
      else wf.innerHTML='<em class="miss">Apollo</em><em class="miss">Prospeo</em>';
      total++;if(r[2]!=="none")hits++;found.textContent=hits+"/"+total+" found";
      n1+=1;s1.textContent=n1;if(r[2]!=="none"){n2+=1;s2.textContent=n2}
      setStep(2);
      if(r[2]!=="none")type(r[4],function(){n3+=1;s3.textContent=n3;setStep(3);setTimeout(function(){setStep(4)},700)});
      else{clearInterval(typing);line.textContent="No email found in the waterfall. Row skipped, no AI credit spent.";setStep(1)}
    },900);
    minute=minute>=89?11:minute+1;minEl.textContent=minute;
  }
  if("IntersectionObserver" in window)new IntersectionObserver(function(es){visible=es[0].isIntersecting},{threshold:.15}).observe(con);
  setInterval(cycle,4200);setTimeout(cycle,1600);
}

/* ---------- pipeline: light each stage as the lead passes ---------- */
var pipe=$("[data-pipe]");
if(pipe&&!reduce){var st=$$(".stage",pipe),k=0;setInterval(function(){if(document.hidden)return;st.forEach(function(s,i){s.classList.toggle("lit",i===k)});k=(k+1)%st.length},1200)}

/* ---------- carousels ---------- */
$$("[data-rail]").forEach(function(rail){
  var id=rail.getAttribute("data-rail"),items=Array.prototype.slice.call(rail.children),dots=$('[data-dots="'+id+'"]'),prev=$('[data-prev="'+id+'"]'),next=$('[data-next-btn="'+id+'"]');
  if(dots)dots.innerHTML=items.map(function(){return"<i></i>"}).join("");
  function step(){return items[0]?items[0].getBoundingClientRect().width+14:300}
  function upd(){var i=Math.round(rail.scrollLeft/step());if(dots)$$("i",dots).forEach(function(d,j){d.classList.toggle("on",j===i)});
    if(prev)prev.disabled=rail.scrollLeft<8;if(next)next.disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-8}
  rail.addEventListener("scroll",function(){window.requestAnimationFrame(upd)},{passive:true});
  if(prev)prev.addEventListener("click",function(){rail.scrollBy({left:-step(),behavior:"smooth"})});
  if(next)next.addEventListener("click",function(){rail.scrollBy({left:step(),behavior:"smooth"})});
  upd();
});

/* ---------- dialogs ---------- */
function openD(d){if(!d)return false;if(typeof d.showModal==="function"){if(!d.open)d.showModal();return true}return false}
$$("dialog").forEach(function(d){d.addEventListener("click",function(e){if(e.target===d||e.target.closest("[data-close]"))d.close()})});

/* checkout sheet */
var sheet=$("#checkout"),kit=$("#kit"),payA=$("[data-pay-link]");
if(!CONFIG.payLinkKit){$$("[data-kit-row]").forEach(function(e){e.hidden=true});if(kit)kit.checked=false}
function updTotal(){var t=99+(kit&&kit.checked?499:0);$$("[data-total]").forEach(function(e){e.textContent="₹"+t});$$("[data-pay]").forEach(function(e){e.textContent="Pay ₹"+t+" and reserve"});
  if(payA){var u=(kit&&kit.checked)?CONFIG.payLinkKit:CONFIG.payLink;payA.href=u||"#reserve";if(u){payA.target="_self"}}}
if(kit)kit.addEventListener("change",updTotal);updTotal();
$$("[data-reserve]").forEach(function(a){a.addEventListener("click",function(e){var ex=$("#exit");if(ex&&ex.open)ex.close();if(openD(sheet))e.preventDefault()})});
if(payA)payA.addEventListener("click",function(e){if(!CONFIG.payLink){e.preventDefault();var m=$(".pay-msg",sheet);if(!m){m=document.createElement("p");m.className="pay-msg";payA.parentNode.insertBefore(m,payA.nextSibling)}m.textContent="Online payment is opening shortly. Write to hello@gtme.school to hold your seat."}});

/* WhatsApp + VSL from config */
if(CONFIG.whatsapp){$$("[data-wa]").forEach(function(a){a.href="https://wa.me/"+CONFIG.whatsapp.replace(/\D/g,"");a.hidden=false})}
if(CONFIG.vsl){$$("[data-vsl-wrap]").forEach(function(w){w.hidden=false});$$("[data-vsl]").forEach(function(a){a.href=CONFIG.vsl;a.target="_blank";a.rel="noopener"})}

/* screenshot zoom */
var zoom=$("#zoom");
$$("[data-zoom]").forEach(function(b){b.addEventListener("click",function(){if(!zoom)return;$("[data-zoom-img]",zoom).src=b.getAttribute("data-zoom");$("[data-zoom-img]",zoom).alt=b.getAttribute("data-cap")||"";$("[data-zoom-cap]",zoom).textContent=b.getAttribute("data-cap")||"";openD(zoom)})});

/* exit intent: once per visit */
var exitD=$("#exit"),shown=false,armed=false;
function seen(){try{return sessionStorage.getItem("gtme_exit")==="1"}catch(e){return shown}}
function mark(){shown=true;try{sessionStorage.setItem("gtme_exit","1")}catch(e){}}
function showExit(){if(shown||seen()||!exitD)return;if(sheet&&sheet.open)return;mark();openD(exitD)}
setTimeout(function(){armed=true},8000);
document.addEventListener("mouseout",function(e){if(armed&&!e.relatedTarget&&e.clientY<=0)showExit()});
var lastY=window.scrollY,lastT=Date.now();
window.addEventListener("scroll",function(){var y=window.scrollY,t=Date.now(),v=(lastY-y)/Math.max(1,t-lastT);
  var depth=y/Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  if(armed&&v>2.2&&depth>.35&&window.innerWidth<900)showExit();lastY=y;lastT=t},{passive:true});

/* ---------- counters ---------- */
function fmtN(v,dec){var s=v.toFixed(dec),p=s.split(".");p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");return p.join(".")}
if("IntersectionObserver" in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;var el=en.target;io.unobserve(el);
  if(el.hasAttribute("data-count")){var to=+el.getAttribute("data-count"),dec=+(el.getAttribute("data-dec")||0),suf=el.getAttribute("data-suf")||"",t0=performance.now();
    (function f(t){var k=Math.min(1,(t-t0)/1200);k=1-Math.pow(1-k,3);el.textContent=fmtN(to*k,dec)+suf;if(k<1)requestAnimationFrame(f)})(t0)}
  if(el.hasAttribute("data-grow")){$$(".bar>div",el).forEach(function(b,i){b.animate([{transform:"scaleX(0)"},{transform:"scaleX(1)"}],{duration:900,delay:i*80,easing:"cubic-bezier(.2,.8,.2,1)",fill:"backwards"})})}
})},{threshold:.4});$$("[data-count],[data-grow]").forEach(function(e){io.observe(e)})}

/* ---------- scroll reveal with motion blur (GSAP; content stays visible without it) ---------- */
function gs(){if(!window.gsap||reduce)return;if(window.ScrollTrigger)gsap.registerPlugin(ScrollTrigger);var st=window.ScrollTrigger;
  $$(".rv").forEach(function(el){gsap.fromTo(el,{y:32,filter:"blur(8px)"},{y:0,filter:"blur(0px)",duration:.9,ease:"power3.out",immediateRender:false,clearProps:"filter",scrollTrigger:st?{trigger:el,start:"top 94%",once:true}:undefined})});
  $$("[data-stagger]").forEach(function(g){gsap.fromTo(g.children,{y:26,filter:"blur(6px)"},{y:0,filter:"blur(0px)",duration:.8,stagger:.07,ease:"power3.out",immediateRender:false,clearProps:"filter",scrollTrigger:st?{trigger:g,start:"top 92%",once:true}:undefined})});
}
if(document.readyState==="complete")gs();else window.addEventListener("load",gs);

$$("[data-year]").forEach(function(e){e.textContent=new Date().getFullYear()});
})();
