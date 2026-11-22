// ===== EDIT ME: image paths or URLs =====
// introBg: wide background image for the intro (any image, cover-fit)
// rugerPng: transparent PNG of Ruger Aidal shown in the middle
const CONFIG = { introBg: "bg.jpg", rugerPng: "ruger.png" };
if (CONFIG.introBg) { document.getElementById("introbg").style.backgroundImage = `url("${CONFIG.introBg}")` }
if (CONFIG.rugerPng) { const i = document.getElementById("rugerimg"); i.src = CONFIG.rugerPng; i.hidden = false; document.getElementById("sun").classList.add("has-png") }

const TABS = [
  { name: "Single patterns", note: "One attack, one answer. Learn the tell, make your move, then punish the recovery." },
  { name: "Combo patterns", note: "Chains of two or more attacks. Don’t relax after the first hit, because the next one is already on its way." },
  { name: "Disintegrate chances", cls: "rage", note: "Glowing-lance attacks. These are your disintegrate chances, so keep an eye on the lance." }
];

// Fields: n = new name | video, start, end = clip and seconds to play | orig = name in the video
// kind = "single" or "combo" | dis:1 = disintegrate chance | pill:1 = shown around the sun
// z, d, t, a, r = zone, danger 1-5, timing estimates (no longer shown)
//
// Each move lives in ONE group only. Priority: Disintegrate > Combo > Single.
// A move that is both a combo and a disintegrate chance goes in DISINTEGRATES.

// =====================================================================
// SINGLE PATTERNS
// =====================================================================
const SINGLES = [
  {
    n: "Backstep Rake", video: "videos/backstep-rake.mp4", start: 1, end: 3.5, orig: "Single claw slash", kind: "single", pill: 1, z: "cone", d: 2, t: 600, a: 250, r: 900, tag: "Frontal slash",
    desc: "Ruger hops back at roughly a 75° angle, then lunges in with one sweeping claw slash. (The video is similar, but this move performs one slash instead of two.)",
    tell: "A backward hop at an angle.", counter: "Don’t dash away. Always dash in towards the attacking claw.", open: "Short opening after the swing."
  },
  {
    n: "Recoil Ram", video: "videos/recoil-ram.mp4", start: 1, end: 4, orig: "Tackle", kind: "single", pill: 1, z: "line", d: 3, t: 700, a: 350, r: 1100, tag: "Straight charge",
    desc: "Ruger steps straight back to wind up, then slams forward with a tackle.",
    tell: "Steps straight backward.", counter: "Sidestep off the charge line.", open: "Hit the flank as he recovers."
  },
  {
    n: "Skyback Ram", video: "videos/recoil-ram.mp4", start: 8.5, end: 11.5, orig: "Flying tackle", kind: "single", z: "line", d: 4, t: 900, a: 450, r: 1300, tag: "Aerial charge",
    desc: "Ruger flies backward, then dives in with a flying tackle.",
    tell: "Lifts off and drifts backward.", counter: "Move sideways, not back.", open: "Long recovery after the landing."
  },
  {
    n: "Wing Ram", video: "videos/wing-ram.mp4", start: 0, end: 2.37, orig: "Wing tackle", kind: "single", z: "line", d: 3, t: 800, a: 400, r: 1100, tag: "Side tackle",
    desc: "Ruger drops one wing but won't touch the ground, then side-tackles with the lowered wing.",
    tell: "One wing drops mid-way.", counter: "Dodge away or inside from the lowered wing’s side. Do not dash in if you are far.", open: "Hit the exposed flank after the tackle."
  },
  {
    n: "Stone Fling", video: "videos/wing-ram.mp4", start: 3, end: 7, orig: "Wing throwing rocks: single throw", kind: "single", z: "field", d: 3, t: 800, a: 400, r: 1000, tag: "Rock throw",
    desc: "Ruger plants one wing on the ground, then flings rocks with it.",
    tell: "One wing lowered to the ground.", counter: "Move out of the throw’s path.", open: "Close in during the recovery."
  },
  {
    n: "Crescent Sweep", video: "videos/crescent-sweep.mp4", orig: "Single tail sweep", kind: "single", z: "stomp", d: 2, t: 700, a: 300, r: 1000, tag: "Tail sweep",
    desc: "Ruger side-steps backward, then whips his tail around, usually counter-clockwise.",
    tell: "A sidestep backward.", counter: "Back away or dodge in the tail’s sweep direction.", open: "Hit the body once the tail passes."
  },
  {
    n: "Tailfall", video: "videos/tailfall.mp4", start: 0, end: 7, orig: "Tail slam", kind: "single", z: "stomp", d: 3, t: 900, a: 300, r: 1200, tag: "Rear slam",
    desc: "Ruger lifts his hind legs and tail, then brings the tail down in a heavy slam.",
    tell: "Hind legs and tail rise.", counter: "Get out from behind him before the slam lands.", open: "Strike the legs after the slam."
  },
  {
    n: "Sunburst Ray", video: "videos/sunburst-ray.mp4", orig: "Sun", kind: "single", pill: 1, z: "line", d: 4, t: 1200, a: 600, r: 1500, tag: "Sun ray",
    desc: "Ruger turns into a sun and fires a ray of sunlight.",
    tell: "His body becomes a sun.", counter: "There are two ways to avoid the sun, first is to move out of the ray's path and time it perfectly, second is to go below him directly.", open: "during the sun you can take hp potions but do it as early as possible to avoid the sun smash"
  },
  {
    n: "Wing Rush", video: "videos/wing-rush.mp4", start: 0, end: 3, orig: "Single wing charge", kind: "single", pill: 1, z: "line", d: 3, t: 800, a: 500, r: 1100, tag: "Wing charge",
    desc: "Ruger lowers one wing and charges straight at you.",
    tell: "One wing lowers before the charge.", counter: "dash in the charge line when he's close.", open: "Hit the flank during recovery."
  },
  {
    n: "Skyfall Smash", video: "videos/skyfall-smash.mp4", start: 0, end: 6, orig: "Flying smack down", kind: "single", pill: 1, z: "ring", d: 5, t: 1200, a: 450, r: 1500, tag: "Aerial slam",
    desc: "Ruger takes to the air and raises his right arm. His hand glows, then he slams it into the ground.",
    tell: "He flies up and his right hand glows.", counter: "dash in toward the slam, if timed correctly, you will avoid any damage. (as far as i know its un parryable lemme know)", open: "Long opening after he lands."
  }
];

// =====================================================================
// COMBO PATTERNS
// =====================================================================
const COMBOS = [
  {
    n: "Twin Rake", video: "videos/backstep-rake.mp4", start: 1, end: 5, orig: "Double claw slash", kind: "combo", z: "cone", d: 3, t: 600, a: 450, r: 1000, tag: "Double slash", seq: ["Backstep", "Claw slash", "Claw slash"],
    desc: "The same backstep as Backstep Rake, but with a second claw slash right behind the first. This is common than the single slash, so be ready for it.",
    tell: "The same backward hop. You can’t tell it from the single until the second swing.", counter: "Dodge the first slash and stay ready for the second.", open: "Hit after the second slash."
  },
  {
    n: "Ram & Snap", video: "videos/recoil-ram.mp4", start: 5.5, end: 8, orig: "Tackle to double bite", kind: "combo", z: "line", d: 3, t: 700, a: 900, r: 1200, tag: "Ram into bites", seq: ["Backstep", "Tackle", "Bite", "Bite"],
    desc: "A tackle that flows straight into two snapping bites. Left-Right.",
    tell: "Same backstep as Recoil Ram.", counter: "Sidestep the tackle, then dash in to left bite the opening will follow.", open: "Hit during the second bite after dodging the first bite."
  },
  {
    n: "Ram-Snap-Soar", video: "videos/recoil-ram.mp4", start: 13, end: 18, orig: "Tackle to double bite to flying tackle", kind: "combo", z: "line", d: 4, t: 700, a: 1700, r: 1500, tag: "Full tackle combo", seq: ["Tackle", "Bite", "Bite", "Flying tackle"],
    desc: "The full tackle combo: a ram, two bites, then a flying tackle to finish.",
    tell: "Starts exactly like Recoil Ram.", counter: "Survive the bites, then dodge sideways when he takes off.", open: "Big opening after the flying tackle."
  },
  {
    n: "Rockfall Volley", video: "videos/wing-ram.mp4", start: 8, end: 14, orig: "Wing throwing rocks: double throw", kind: "combo", z: "field", d: 4, t: 800, a: 900, r: 1100, tag: "Double rock throw", seq: ["Wing down", "Throw", "Throw"],
    desc: "Same wing-down setup as Stone Fling, but he throws twice.",
    tell: "One wing lowered to the ground.", counter: "Dodge the first throw and stay mobile for the second.", open: "Hit after the second throw."
  },
  {
    n: "Tail Tempest", video: "videos/tailfall.mp4", start: 8, end: 17, orig: "Double tail slam into spinning tail sweep", kind: "combo", pill: 1, z: "ring", d: 4, t: 900, a: 1700, r: 1500, tag: "Slam, slam, spin", seq: ["Tail slam", "Tail slam", "Counter-clockwise spin", "Tail sweep"],
    desc: "Two tail slams, then a counter-clockwise spin that ends in a wide tail sweep.",
    tell: "Same lifted legs and tail as Tailfall.", counter: "Stay clear for the slams, then after the spin, dash in to the tails direction (counter-clockwise so dash clockwise).", open: "Long opening after the sweep."
  },
  {
    n: "Wingfall Rush", video: "videos/wing-rush.mp4", start: 5, end: 14, orig: "Single wing charge to wing drop", kind: "combo", pill: 1, z: "line", d: 4, t: 800, a: 1300, r: 1500, tag: "Charge into slam", seq: ["Wing charge", "Lift body", "Claw glows", "Wing slam"],
    desc: "A wing charge, then Ruger rears up, his claw lights up, and he brings a wing slam down.",
    tell: "Lowered wing, then his body lifts and the claw glows.", counter: "Dodge the charge (dash in or away), then get out of the slam’s range.", open: "Opening after the wing slam."
  }
];

// =====================================================================
// DISINTEGRATE CHANCES (glowing-lance moves, including the lance combos)
// =====================================================================
const DISINTEGRATES = [
  {
    n: "Buried Lance Slash", video: "videos/buried-lance-slash.mp4", start: 0, end: 5, orig: "Single glowing lance #1", kind: "single", dis: 1, z: "line", d: 4, t: 1000, a: 600, r: 1300, tag: "Shockwave slash",
    desc: "Ruger buries his lance, then fires off a straight frontal slash with a shockwave.",
    tell: "The lance is driven into the ground.", counter: "Move off the line to avoid the shockwave. Do not attempt to parry the shockwave will get through.", open: "Disintegrate chance after the slash."
  },
  {
    n: "Slow-Draw Lance", video: "videos/buried-lance-slash.mp4", start: 5, end: 14, orig: "Single glowing lance #2", kind: "single", dis: 1, z: "cone", d: 4, t: 1400, a: 500, r: 1300, tag: "Delayed slash",
    desc: "Ruger slams his left wing, slowly pulls out the lance, then slashes.",
    tell: "Left wing slam, followed by a slow pull.", counter: "Don’t panic during the slow pull. Wait for the slash. then click the attack button. although it is better to just dodge this one since the opening is not that much", open: "Disintegrate chance after the slash."
  },
  {
    n: "U-Turn Lance Rush", video: "videos/wing-rush.mp4", start: 20, end: 32, orig: "Double wing charge", kind: "combo", dis: 1, z: "line", d: 4, t: 800, a: 1500, r: 1400, tag: "Charge, turn, charge", seq: ["Wing charge", "U-turn", "Glowing-lance charge"],
    desc: "A regular wing charge, then a U-turn and a second charge with a glowing lance.",
    tell: "Starts like a Wing Rush.", counter: "Dodge the first charge, then be ready for the turn. then disintegrate the first and second slash. (the easiest one to disintegrate)", open: "Leads into Lance Duel."
  },
  {
    n: "Lance Storm", video: "videos/lance-storm.mp4", start: 0, end: 10, orig: "Triple glowing lance", kind: "combo", dis: 1, z: "cone", d: 5, t: 900, a: 1500, r: 1500, tag: "Triple lance", seq: ["Right-arm sweep", "Left-arm sweep", "Buried Lance Slash"],
    desc: "Ruger sweeps his lance with his right arm to the left, then the other arm, and finishes with a Buried Lance Slash.",
    tell: "The lance is raised for a sweep.", counter: "Get through both sweeps, then dodge the shockwave.", open: "Disintegrate chance during the first  slash."
  }
];

// ---- Do not edit below: tab order and the full list ----
const GROUPS = [SINGLES, COMBOS, DISINTEGRATES];   // tab 1, tab 2, tab 3
const MOVES = [...SINGLES, ...COMBOS, ...DISINTEGRATES];

const TELLS = [
  ["Lowered wing", "Wing Ram, rock throws, and wing rushes all begin with a dropped wing. Check whether it’s in the air or on the ground."],
  ["Raised hind legs", "Lifted back legs and a raised tail mean a Tailfall. If he does it twice, a spin is coming."],
  ["Glowing claw", "A glowing claw after he lifts his body means the wing slam. A glowing right hand in the air means Skyfall Smash."],
  ["Sun form", "When Ruger turns into a sun, a ray of sunlight is on its way."],
  ["Buried lance", "A lance driven into the ground means a straight slash with a shockwave."]
];
const CHAINS = [
  ["Tackle chain", ["Recoil Ram", "Double bite", "Skyback Ram"]],
  ["Tail chain", ["Tail slam", "Tail slam", "Spin", "Tail sweep"]],
  ["Wing chain", ["Wing Rush", "Body lift", "Wing slam"]],
  ["Lance chain", ["Wing Rush", "U-turn Lance Rush", "Double lance slash", "Parry both for a long damage window"]],
  ["Triple lance", ["Right-arm sweep", "Left-arm sweep", "Buried Lance Slash"]]
];

// intro stats
document.getElementById("stMoves").textContent = MOVES.length;
document.getElementById("stCombos").textContent = MOVES.filter(m => m.kind === "combo").length;
document.getElementById("stDis").textContent = MOVES.filter(m => m.dis).length;

// sun rays
(() => {
  let s = ""; for (let i = 0; i < 24; i++) {
    const a = i * 15 * Math.PI / 180, r1 = 130, r2 = i % 2 ? 160 : 185;
    s += `<line x1="${200 + Math.cos(a) * r1}" y1="${200 + Math.sin(a) * r1}" x2="${200 + Math.cos(a) * r2}" y2="${200 + Math.sin(a) * r2}"/>`
  }
  document.getElementById("rays").innerHTML = s
})();

let tab = 0, sel = 0;
const $ = id => document.getElementById(id);
const active = () => GROUPS[tab];

function renderTabs() {
  $("tabs").innerHTML = TABS.map((p, i) => `<button class="tab ${p.cls || ""}" role="tab" aria-selected="${i === tab}" data-p="${i}">${p.name}</button>`).join("");
  $("tabs").querySelectorAll(".tab").forEach(b => b.onclick = () => { tab = +b.dataset.p; sel = 0; render() });
}
function renderList() {
  $("pnote").textContent = TABS[tab].note;
  $("list").innerHTML = active().map((m, i) => `<button class="move" aria-pressed="${i === sel}" data-i="${i}"><span>${m.n}<br><small>${m.tag}</small></span><span class="pips" aria-label="Danger ${m.d} of 5">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= m.d ? "f" : ""}"></i>`).join("")}</span></button>`).join("");
  $("list").querySelectorAll(".move").forEach(b => b.onclick = () => { sel = +b.dataset.i; renderList(); renderDetail() });
}
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
// Video file = m.video if set, otherwise videos/<move-name>.mp4 (e.g. videos/backstep-rake.mp4)
function renderDetail() {
  const m = active()[sel]; if (!m) return;
  const src = m.video || `videos/${slug(m.n)}.mp4`;
  const badges = (m.dis ? '<span class="badge">Disintegrate chance</span>' : "") + (m.parry ? '<span class="badge b2">Parry window</span>' : "");
  const seq = m.seq ? `<div class="seq">${m.seq.map((s, i) => `${i ? '<em>then</em>' : ""}<span>${s}</span>`).join("")}</div>` : "";
  $("detail").innerHTML = `<div class="vid">
   <video id="mvid" src="${src}${m.start != null ? "#t=" + m.start : ""}" autoplay loop muted controls playsinline preload="metadata"></video>
   <div class="novid" style="display:none">Video coming soon<small>${src}</small></div>
  </div>
  <div><div class="tagline">${m.kind === "combo" ? "Combo" : "Single"} · ${m.tag} · danger ${m.d}/5</div><h3 class="display">${m.n}</h3>${badges}<p class="desc">${m.desc}</p>${seq}
  <dl><dt>Name in the video</dt><dd>${m.orig}</dd><dt>Tell</dt><dd>${m.tell}</dd><dt>Counter</dt><dd>${m.counter}</dd><dt>Opening</dt><dd>${m.open}</dd></dl></div>`;
  const v = $("mvid");
  v.onerror = () => { v.style.display = "none"; v.nextElementSibling.style.display = "grid" };
  if (m.start != null || m.end != null) {
    const s = m.start || 0, e = m.end || 0;
    v.loop = false;
    const jump = () => { try { v.currentTime = s } catch (_) { } };
    v.addEventListener("loadedmetadata", jump);
    v.addEventListener("canplay", () => { if (!v._ready) { v._ready = 1; jump() } });
    v.addEventListener("ended", () => { jump(); v.play() });
    const tick = () => {
      if (!v.isConnected) return;
      const t = v.currentTime;
      if (!v.seeking && v.readyState >= 1 && (t < s - 0.3 || (e && t >= e))) jump();
      requestAnimationFrame(tick);
    };
    tick();
  }
}
function renderTells() {
  $("tellgrid").innerHTML = TELLS.map(t => `<div class="tell"><h3 class="display">${t[0]}</h3><p>${t[1]}</p></div>`).join("");
  $("chains").innerHTML = CHAINS.map(c => `<div class="chain-label">${c[0]}</div><div class="chain">${c[1].map((n, i) => `${i ? '<span class="arrow">then</span>' : ""}<span class="chip ${/lance|parry/i.test(n) ? "sp" : ""}">${n}</span>`).join("")}</div>`).join("");
}
function render() { renderTabs(); renderList(); renderDetail() }
render(); renderTells();

// move compass around the sun
function renderCompass() {
  const sun = $("sun"), ps = MOVES.filter(m => m.pill);
  ps.forEach((m, i) => {
    const a = (-157.5 + i * (360 / ps.length)) * Math.PI / 180;
    const b = document.createElement("button"); b.className = "pill"; b.textContent = m.n;
    b.style.left = (50 + Math.cos(a) * 72) + "%"; b.style.top = (50 + Math.sin(a) * 60) + "%";
    b.onclick = () => { tab = GROUPS.findIndex(g => g.includes(m)); sel = active().indexOf(m); render(); $("moves").scrollIntoView() };
    sun.appendChild(b)
  });
}
renderCompass();

// scroll spy
const links = [...document.querySelectorAll("#rail a")];
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.classList.toggle("on", l.getAttribute("href") === "#" + e.target.id)) }), { rootMargin: "-40% 0px -50% 0px" });
document.querySelectorAll("main section").forEach(s => io.observe(s));

// moving @La_plume tag (design lives in style.css, 30% opacity)
(()=>{
 const person='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z"/></svg>';
 const tag=`<div class="wm-id"><span class="wm-ring">${person}</span><div class="wm-plate"><span>@La_plume</span></div></div>`;
 const gap='<i style="flex:none;width:200px"></i>';
 const group=`<div class="wm-g">${(tag+gap).repeat(8)}</div>`;
 document.getElementById("wmtrack").innerHTML=group+group;
})();