const { useState, useEffect, useRef } = React;

// ── PALETTE ────────────────────────────────────────────────────────────────
const LIGHT = {
  bg:"#EEEEEE",surface:"#FFFFFF",surface2:"#F5F5F5",border:"#D0D0D0",borderStrong:"#AAAAAA",
  text:"#222831",textSub:"#393E46",textMuted:"#6B7280",
  accent:"#00ADB5",accentText:"#007A80",accentBg:"#E0F7F8",accentFg:"#FFFFFF",
  navBg:"#FFFFFF",navBorder:"#D0D0D0",
  correct:"#16A34A",correctBg:"#F0FDF4",wrong:"#DC2626",wrongBg:"#FEF2F2",
  hardRed:"#B91C1C",hardBg:"#FEF2F2",
  gold:"#B45309",silver:"#4B5563",bronze:"#92400E",streakOrange:"#EA580C",
  youBg:"#E0F7F8",youBorder:"#00ADB5",warn:"#92400E",warnBg:"#FEF3C7",
};
const DARK = {
  bg:"#222831",surface:"#2D3340",surface2:"#393E46",border:"#4A5060",borderStrong:"#6B7280",
  text:"#EEEEEE",textSub:"#D1D5DB",textMuted:"#9CA3AF",
  accent:"#00ADB5",accentText:"#00CDD6",accentBg:"#003A3D",accentFg:"#FFFFFF",
  navBg:"#1A1F27",navBorder:"#393E46",
  correct:"#4ADE80",correctBg:"#052E16",wrong:"#F87171",wrongBg:"#1C0505",
  hardRed:"#EF4444",hardBg:"#1C0505",
  gold:"#F59E0B",silver:"#9CA3AF",bronze:"#D97706",streakOrange:"#FB923C",
  youBg:"#003A3D",youBorder:"#00ADB5",warn:"#FCD34D",warnBg:"#1C1500",
};

function AppLogo({size=130}){
  return(
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldRing" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f5c842"/>
          <stop offset="50%" stopColor="#c8952a"/>
          <stop offset="100%" stopColor="#f5c842"/>
        </linearGradient>
        <linearGradient id="qgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00e5ef"/>
          <stop offset="100%" stopColor="#00adb5"/>
        </linearGradient>
        <radialGradient id="bgGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#0d2535"/>
          <stop offset="100%" stopColor="#0a1520"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="url(#bgGlow)" stroke="url(#goldRing)" strokeWidth="7"/>
      <text x="100" y="88" textAnchor="middle" fontSize="60" fontWeight="900" fontFamily="Georgia,serif" fill="url(#qgrad)">?</text>
      <text x="100" y="148" textAnchor="middle" fontSize="28" fontWeight="700" fontFamily="Georgia,serif" letterSpacing="3" fill="#c8952a">uncl</text>
      <ellipse cx="100" cy="158" rx="24" ry="9" fill="none" stroke="#00adb5" strokeWidth="2.5" opacity="0.6"/>
    </svg>
  );
}


// ── ANONYMOUS NAME GENERATOR ───────────────────────────────────────────────
const ADJ1=["heavy","silent","wild","bright","dark","swift","golden","iron","frozen","hollow","ancient","brave","calm","fierce","gentle","hidden","lost","mighty","pale","proud","sharp","tall","vast","warm","young"];
const ADJ2=["autumn","winter","summer","spring","dawn","dusk","ember","stone","river","ocean","forest","desert","thunder","shadow","silver","amber","crimson","jade","onyx","storm","smoke","frost","flame","tide","mist"];
const NOUN=["wolf","hawk","bear","fox","crow","elk","owl","raven","lion","tiger","falcon","lynx","drake","viper","crane","heron","bison","cobra","eagle","panther","stallion","jaguar","orca","moose","boar"];
function generatePublicName(){
  const a1=ADJ1[Math.floor(Math.random()*ADJ1.length)];
  const a2=ADJ2[Math.floor(Math.random()*ADJ2.length)];
  const n=NOUN[Math.floor(Math.random()*NOUN.length)];
  return `${a1}-${a2}-${n}`;
}


const AVATAR_COLORS = {
  You:"#00ADB5",Alex:"#2563EB",Jordan:"#7C3AED",Sam:"#059669",Riley:"#DC2626",
  Casey:"#D97706",Morgan:"#0891B2",Drew:"#6D28D9",Pat:"#065F46",
};

// ── MATERIAL ICONS ─────────────────────────────────────────────────────────
function MI({ name, size=22, color="inherit" }) {
  return <span className="material-icons" style={{fontSize:size,color,lineHeight:1,userSelect:"none",display:"inline-flex",alignItems:"center"}}>{name}</span>;
}
const Icon = {
  Home:       p=><MI name="home"                      size={p.size||22} color={p.color||"inherit"}/>,
  Chat:       p=><MI name="chat_bubble"               size={p.size||22} color={p.color||"inherit"}/>,
  Trophy:     p=><MI name="emoji_events"              size={p.size||22} color={p.color||"inherit"}/>,
  Flame:      p=><MI name="local_fire_department"    size={p.size||20} color={p.color||"inherit"}/>,
  Skull:      p=><MI name="skull"                    size={p.size||18} color={p.color||"#ef4444"}/>,
  Crown:      p=><MI name="workspace_premium"        size={p.size||20} color={p.color||"inherit"}/>,
  Star:       p=><MI name="star"                     size={p.size||18} color={p.color||"inherit"}/>,
  Celebrate:  p=><MI name="celebration"              size={p.size||18} color={p.color||"inherit"}/>,
  Mood:       p=><MI name="mood"                     size={p.size||18} color={p.color||"inherit"}/>,
  MoodBad:    p=><MI name="mood_bad"                 size={p.size||18} color={p.color||"inherit"}/>,
  Surprise:   p=><MI name="sentiment_very_satisfied" size={p.size||18} color={p.color||"inherit"}/>,
  Target:     p=><MI name="my_location"              size={p.size||18} color={p.color||"inherit"}/>,
  Check:      p=><MI name="check_circle"             size={p.size||20} color={p.color||"inherit"}/>,
  Cross:      p=><MI name="cancel"                   size={p.size||20} color={p.color||"inherit"}/>,
  Send:       p=><MI name="send"                     size={p.size||20} color={p.color||"inherit"}/>,
  Settings:   p=><MI name="settings"                size={p.size||20} color={p.color||"inherit"}/>,
  Back:       p=><MI name="arrow_back"               size={p.size||20} color={p.color||"inherit"}/>,
  Copy:       p=><MI name="content_copy"             size={p.size||18} color={p.color||"inherit"}/>,
  Clock:      p=><MI name="schedule"                size={p.size||18} color={p.color||"inherit"}/>,
  Lightning:  p=><MI name="bolt"                     size={p.size||18} color={p.color||"inherit"}/>,
  DarkMode:   p=><MI name="dark_mode"                size={p.size||22} color={p.color||"inherit"}/>,
  LightMode:  p=><MI name="light_mode"               size={p.size||22} color={p.color||"inherit"}/>,
  PopCulture: p=><MI name="theaters"                size={p.size||24} color={p.color||"inherit"}/>,
  Science:    p=><MI name="science"                 size={p.size||24} color={p.color||"inherit"}/>,
  History:    p=><MI name="account_balance"         size={p.size||24} color={p.color||"inherit"}/>,
  Sports:     p=><MI name="sports_soccer"           size={p.size||24} color={p.color||"inherit"}/>,
  Food:       p=><MI name="restaurant"              size={p.size||24} color={p.color||"inherit"}/>,
  Brain:      p=><MI name="extension"               size={p.size||24} color={p.color||"inherit"}/>,
  WildCard:   p=><MI name="casino"                  size={p.size||24} color={p.color||"inherit"}/>,
  ChevronR:   p=><MI name="chevron_right"           size={p.size||20} color={p.color||"inherit"}/>,
  ChevronD:   p=><MI name="expand_more"             size={p.size||20} color={p.color||"inherit"}/>,
  Info:       p=><MI name="info"                    size={p.size||18} color={p.color||"inherit"}/>,
  Add:        p=><MI name="add"                     size={p.size||20} color={p.color||"inherit"}/>,
  AddCircle:  p=><MI name="add_circle"              size={p.size||22} color={p.color||"inherit"}/>,
  Groups:     p=><MI name="groups"                  size={p.size||22} color={p.color||"inherit"}/>,
  Lock:       p=><MI name="lock"                    size={p.size||18} color={p.color||"inherit"}/>,
  Edit:       p=><MI name="edit"                    size={p.size||18} color={p.color||"inherit"}/>,
  Key:        p=><MI name="key"                     size={p.size||20} color={p.color||"inherit"}/>,
  Close:      p=><MI name="close"                   size={p.size||20} color={p.color||"inherit"}/>,
  Leave:      p=><MI name="logout"                  size={p.size||18} color={p.color||"inherit"}/>,
  Swap:       p=><MI name="swap_horiz"              size={p.size||20} color={p.color||"inherit"}/>,
  Bug:        p=><MI name="bug_report"              size={p.size||18} color={p.color||"inherit"}/>,
  CalDay:     p=><MI name="calendar_today"          size={p.size||18} color={p.color||"inherit"}/>,
  Person:     p=><MI name="person"                  size={p.size||22} color={p.color||"inherit"}/>,
  Badge:      p=><MI name="military_tech"           size={p.size||22} color={p.color||"inherit"}/>,
  Shield:     p=><MI name="shield"                  size={p.size||18} color={p.color||"inherit"}/>,
  XP:         p=><MI name="auto_awesome"            size={p.size||18} color={p.color||"inherit"}/>,
  Share:      p=><MI name="share"                   size={p.size||20} color={p.color||"inherit"}/>,
};

const THEME_ICONS = {
  Monday:Icon.PopCulture,Tuesday:Icon.Science,Wednesday:Icon.History,
  Thursday:Icon.Sports,Friday:Icon.Food,Saturday:Icon.Brain,Sunday:Icon.WildCard,
};

const REACTIONS = [
  {key:"fire",IconComp:Icon.Flame},{key:"crown",IconComp:Icon.Crown},
  {key:"celebrate",IconComp:Icon.Celebrate},{key:"laugh",IconComp:Icon.Surprise},
  {key:"target",IconComp:Icon.Target},{key:"mood",IconComp:Icon.Mood},
  {key:"moodbad",IconComp:Icon.MoodBad},{key:"skull",IconComp:Icon.Skull},
];
function ReactionIcon({rkey,size=18,c}) {
  const map={fire:Icon.Flame,crown:Icon.Crown,celebrate:Icon.Celebrate,laugh:Icon.Surprise,target:Icon.Target,mood:Icon.Mood,moodbad:Icon.MoodBad,skull:Icon.Skull};
  const Comp=map[rkey]||Icon.Star;
  return <Comp size={size} color={c.accent}/>;
}
function Avatar({name,size=36}) {
  const bg=AVATAR_COLORS[name]||"#6B7280";
  const content=name==="You"
    ?<MI name="person" size={Math.round(size*0.55)} color="#fff"/>
    :<span style={{fontSize:Math.round(size*0.44),fontWeight:700,color:"#fff"}}>{(name||"?")[0]}</span>;
  return <div style={{width:size,height:size,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{content}</div>;
}

// ── DAY THEMES ─────────────────────────────────────────────────────────────
const DAY_THEMES = {
  Monday:   {name:"Pop Culture"},
  Tuesday:  {name:"Science & Tech"},
  Wednesday:{name:"History"},
  Thursday: {name:"Sports"},
  Friday:   {name:"Food & Travel"},
  Saturday: {name:"Brain Teasers"},
  Sunday:   {name:"Wild Card"},
};
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// ── ALL-WEEK PUZZLES (normal + hard per day) ───────────────────────────────
const ALL_PUZZLES = {
  Monday: {
    normal:[
      {id:1,type:"multiple_choice",question:"Which pop star released the album 'Thriller' in 1982?",options:["Prince","Michael Jackson","David Bowie","Bruce Springsteen"],answer:"Michael Jackson",time_limit:15},
      {id:2,type:"true_false",question:"The TV show 'Friends' ran for 10 seasons.",answer:"True",time_limit:10},
      {id:3,type:"type_in",question:"Name the actress who played Katniss Everdeen in The Hunger Games.",answer:"jennifer lawrence",time_limit:null},
      {id:4,type:"multiple_choice",question:"Which movie features the quote 'You can't handle the truth!'?",options:["The Godfather","A Few Good Men","Wall Street","JFK"],answer:"A Few Good Men",time_limit:20},
      {id:5,type:"timed",question:"What year did the first iPhone launch?",options:["2005","2006","2007","2008"],answer:"2007",time_limit:12},
    ],
    hard:[
      {id:1,type:"multiple_choice",question:"Which director's debut film was 'Reservoir Dogs'?",options:["David Fincher","Paul Thomas Anderson","Quentin Tarantino","Spike Lee"],answer:"Quentin Tarantino",time_limit:15},
      {id:2,type:"true_false",question:"David Bowie's 'Ziggy Stardust' album was released in 1972.",answer:"True",time_limit:10},
      {id:3,type:"type_in",question:"In which fictional town is the TV show Twin Peaks set?",answer:"twin peaks",time_limit:null},
      {id:4,type:"multiple_choice",question:"Which novel inspired the film 'Apocalypse Now'?",options:["Lord Jim","Heart of Darkness","Nostromo","The Secret Sharer"],answer:"Heart of Darkness",time_limit:20},
      {id:5,type:"timed",question:"What year did Stanley Kubrick's '2001: A Space Odyssey' release?",options:["1966","1967","1968","1969"],answer:"1968",time_limit:12},
    ],
  },
  Tuesday: {
    normal:[
      {id:1,type:"multiple_choice",question:"What does 'www' stand for in a website address?",options:["World Wide Web","Wide World Web","Web World Wide","World Web Wide"],answer:"World Wide Web",time_limit:15},
      {id:2,type:"true_false",question:"The sun is a star.",answer:"True",time_limit:10},
      {id:3,type:"type_in",question:"What is the chemical symbol for water?",answer:"h2o",time_limit:null},
      {id:4,type:"multiple_choice",question:"Which planet is known as the Red Planet?",options:["Venus","Jupiter","Mars","Saturn"],answer:"Mars",time_limit:20},
      {id:5,type:"timed",question:"How many bones are in the adult human body?",options:["196","206","216","226"],answer:"206",time_limit:12},
    ],
    hard:[
      {id:1,type:"multiple_choice",question:"Which subatomic particle has no electric charge?",options:["Proton","Electron","Neutron","Photon"],answer:"Neutron",time_limit:15},
      {id:2,type:"true_false",question:"CRISPR-Cas9 is a gene-editing technology.",answer:"True",time_limit:10},
      {id:3,type:"type_in",question:"What is the powerhouse of the cell?",answer:"mitochondria",time_limit:null},
      {id:4,type:"multiple_choice",question:"What does DNA stand for?",options:["Deoxyribonucleic Acid","Dioxyribose Nucleic Acid","Deoxyribose Nucleic Atom","Dioxyribonucleic Acid"],answer:"Deoxyribonucleic Acid",time_limit:20},
      {id:5,type:"timed",question:"At what temperature (Celsius) does water boil at sea level?",options:["90°C","95°C","100°C","105°C"],answer:"100°C",time_limit:12},
    ],
  },
  Wednesday: {
    normal:[
      {id:1,type:"multiple_choice",question:"Which ancient wonder was located in Alexandria, Egypt?",options:["The Colossus of Rhodes","The Lighthouse of Alexandria","The Hanging Gardens","The Temple of Artemis"],answer:"The Lighthouse of Alexandria",time_limit:20},
      {id:2,type:"true_false",question:"The Berlin Wall fell in 1989.",answer:"True",time_limit:10},
      {id:3,type:"type_in",question:"What was the name of the ship that sank on its maiden voyage in 1912?",answer:"titanic",time_limit:null},
      {id:4,type:"multiple_choice",question:"Which empire was ruled by Genghis Khan?",options:["Ottoman Empire","Roman Empire","Mongol Empire","Persian Empire"],answer:"Mongol Empire",time_limit:20},
      {id:5,type:"timed",question:"In what year did World War II end?",options:["1943","1944","1945","1946"],answer:"1945",time_limit:12},
    ],
    hard:[
      {id:1,type:"multiple_choice",question:"The Library of Alexandria was founded under which ruling dynasty?",options:["Ptolemaic Dynasty","Achaemenid Dynasty","Roman Dynasty","Macedonian Republic"],answer:"Ptolemaic Dynasty",time_limit:20},
      {id:2,type:"true_false",question:"Nazi Germany and the Soviet Union signed a non-aggression pact before Germany invaded Poland in 1939.",answer:"True",time_limit:10},
      {id:3,type:"type_in",question:"The Titanic was en route to which city when it struck the iceberg?",answer:"new york",time_limit:null},
      {id:4,type:"multiple_choice",question:"Which country successfully resisted Mongol invasion in the 13th century?",options:["China","Persia","Japan","Russia"],answer:"Japan",time_limit:20},
      {id:5,type:"timed",question:"Which 1945 Allied conference divided post-war Europe into spheres of influence?",options:["Tehran Conference","Yalta Conference","Potsdam Conference","Cairo Conference"],answer:"Yalta Conference",time_limit:14},
    ],
  },
  Thursday: {
    normal:[
      {id:1,type:"multiple_choice",question:"How many players are on a standard soccer team?",options:["9","10","11","12"],answer:"11",time_limit:15},
      {id:2,type:"true_false",question:"The Super Bowl is played in the NBA.",answer:"False",time_limit:10},
      {id:3,type:"type_in",question:"In which sport would you perform a slam dunk?",answer:"basketball",time_limit:null},
      {id:4,type:"multiple_choice",question:"How many Grand Slam tennis tournaments are there per year?",options:["2","3","4","5"],answer:"4",time_limit:20},
      {id:5,type:"timed",question:"Which country won the 2018 FIFA World Cup?",options:["Brazil","Germany","France","Argentina"],answer:"France",time_limit:12},
    ],
    hard:[
      {id:1,type:"multiple_choice",question:"Which golfer holds the record for the most major championship titles?",options:["Arnold Palmer","Jack Nicklaus","Tiger Woods","Gary Player"],answer:"Jack Nicklaus",time_limit:15},
      {id:2,type:"true_false",question:"Michael Jordan won 6 NBA championships all with the Chicago Bulls.",answer:"True",time_limit:10},
      {id:3,type:"type_in",question:"What is the term for a score of 3-under-par on a single golf hole?",answer:"albatross",time_limit:null},
      {id:4,type:"multiple_choice",question:"In which year were the first modern Olympic Games held?",options:["1892","1894","1896","1900"],answer:"1896",time_limit:20},
      {id:5,type:"timed",question:"How many dimples does a regulation golf ball have (approximately)?",options:["256","336","512","420"],answer:"336",time_limit:12},
    ],
  },
  Friday: {
    normal:[
      {id:1,type:"multiple_choice",question:"Which country is known as the birthplace of pizza?",options:["Greece","Spain","Italy","France"],answer:"Italy",time_limit:15},
      {id:2,type:"true_false",question:"Sushi originally comes from Japan.",answer:"True",time_limit:10},
      {id:3,type:"type_in",question:"What nut is used to make marzipan?",answer:"almond",time_limit:null},
      {id:4,type:"multiple_choice",question:"Which city is famous for its deep-dish pizza?",options:["New York","Los Angeles","Chicago","Detroit"],answer:"Chicago",time_limit:20},
      {id:5,type:"timed",question:"What is the main ingredient in guacamole?",options:["Tomato","Avocado","Lime","Jalapeño"],answer:"Avocado",time_limit:12},
    ],
    hard:[
      {id:1,type:"multiple_choice",question:"What is the French culinary term for a butter-flour mixture used to thicken sauces?",options:["Beurre blanc","Roux","Mirepoix","Béchamel"],answer:"Roux",time_limit:15},
      {id:2,type:"true_false",question:"Tempura is a Portuguese-influenced Japanese cooking technique.",answer:"True",time_limit:10},
      {id:3,type:"type_in",question:"What herb is the primary flavoring in pesto sauce?",answer:"basil",time_limit:null},
      {id:4,type:"multiple_choice",question:"Which region of France is Champagne produced in?",options:["Bordeaux","Burgundy","Champagne-Ardenne","Alsace"],answer:"Champagne-Ardenne",time_limit:20},
      {id:5,type:"timed",question:"What is the Japanese term for a trained sushi chef?",options:["Itamae","Senpai","Shokunin","Kaiseki"],answer:"Itamae",time_limit:12},
    ],
  },
  Saturday: {
    normal:[
      {id:1,type:"multiple_choice",question:"If you rearrange 'LISTEN', you get which word?",options:["ENLIST","SILENT","TINSEL","All of these"],answer:"All of these",time_limit:20},
      {id:2,type:"true_false",question:"A 'baker's dozen' equals 13.",answer:"True",time_limit:10},
      {id:3,type:"type_in",question:"What 5-letter word becomes shorter when you add two letters to it?",answer:"short",time_limit:null},
      {id:4,type:"multiple_choice",question:"How many sides does a hexagon have?",options:["5","6","7","8"],answer:"6",time_limit:15},
      {id:5,type:"timed",question:"Which weighs more: a pound of feathers or a pound of gold?",options:["Feathers","Gold","They weigh the same","Depends on altitude"],answer:"They weigh the same",time_limit:14},
    ],
    hard:[
      {id:1,type:"multiple_choice",question:"If all Bloops are Razzles, and all Razzles are Lazzles, then all Bloops are definitely…",options:["Razzles only","Lazzles","Neither","Cannot be determined"],answer:"Lazzles",time_limit:20},
      {id:2,type:"true_false",question:"In the Monty Hall problem, switching doors gives you a 2/3 chance of winning.",answer:"True",time_limit:10},
      {id:3,type:"type_in",question:"What is the next number in the Fibonacci sequence after 21?",answer:"34",time_limit:null},
      {id:4,type:"multiple_choice",question:"I have cities, but no houses. I have mountains, but no trees. What am I?",options:["A painting","A dream","A map","A globe"],answer:"A map",time_limit:20},
      {id:5,type:"timed",question:"How many times can you subtract 10 from 100?",options:["10","9","1","Infinitely"],answer:"1",time_limit:14},
    ],
  },
  Sunday: {
    normal:[
      {id:1,type:"multiple_choice",question:"What is the tallest mountain in the world?",options:["K2","Kangchenjunga","Mount Everest","Lhotse"],answer:"Mount Everest",time_limit:15},
      {id:2,type:"true_false",question:"Dolphins are fish.",answer:"False",time_limit:10},
      {id:3,type:"type_in",question:"What is the capital city of Australia?",answer:"canberra",time_limit:null},
      {id:4,type:"multiple_choice",question:"How many colors are in a standard rainbow?",options:["5","6","7","8"],answer:"7",time_limit:15},
      {id:5,type:"timed",question:"What is the largest ocean on Earth?",options:["Atlantic","Indian","Arctic","Pacific"],answer:"Pacific",time_limit:12},
    ],
    hard:[
      {id:1,type:"multiple_choice",question:"What is the official language of Brazil?",options:["Spanish","Portuguese","Brazilian","Creole"],answer:"Portuguese",time_limit:15},
      {id:2,type:"true_false",question:"The Great Wall of China is visible from space with the naked eye.",answer:"False",time_limit:10},
      {id:3,type:"type_in",question:"What is the name of the world's largest desert?",answer:"sahara",time_limit:null},
      {id:4,type:"multiple_choice",question:"Which element has the atomic number 79?",options:["Silver","Platinum","Gold","Mercury"],answer:"Gold",time_limit:15},
      {id:5,type:"timed",question:"How many time zones does Russia span?",options:["9","10","11","12"],answer:"11",time_limit:12},
    ],
  },
};

// Aliases for fuzzy matching across all days
const ALIASES = {
  "new york":["nyc","ny","new york city"],
  "titanic":["the titanic","rms titanic"],
  "japan":["japanese"],
  "yalta conference":["yalta"],
  "ptolemaic dynasty":["ptolemaic","ptolemy"],
  "jennifer lawrence":["jennifer","lawrence","j. lawrence"],
  "twin peaks":["twinpeaks"],
  "heart of darkness":["heart of darknesss"],
  "h2o":["water","h₂o"],
  "mitochondria":["mitochondrion"],
  "basketball":["basket ball"],
  "albatross":["double eagle"],
  "almond":["almonds"],
  "basil":["sweet basil"],
  "canberra":["canbera"],
  "sahara":["the sahara","sahara desert"],
  "short":["shorter"],
  "34":["thirty-four","thirty four"],
};

// ── BADGES & PROGRESSION ──────────────────────────────────────────────────
const BADGE_DEFS = [
  {id:"perfect_week",  label:"Perfect Week",    desc:"100% on all 7 days in a week",      iconName:"Crown",    color:"#F59E0B"},
  {id:"streak_7",      label:"On Fire",         desc:"7-day streak",                       iconName:"Flame",    color:"#EA580C"},
  {id:"streak_30",     label:"Habit Formed",    desc:"30-day streak",                      iconName:"Flame",    color:"#DC2626"},
  {id:"speed_demon",   label:"Speed Demon",     desc:"Timed puzzle in under 30s",          iconName:"Lightning",color:"#7C3AED"},
  {id:"theme_master",  label:"Theme Master",    desc:"Perfect score on one theme 5 times", iconName:"Star",     color:"#0891B2"},
  {id:"social",        label:"Social Butterfly",desc:"Active in 3+ groups",                iconName:"Groups",   color:"#059669"},
  {id:"first_play",    label:"First Play",      desc:"Completed your first puzzle",        iconName:"Trophy",   color:"#00ADB5"},
  {id:"hard_finisher", label:"Glutton for Punishment",desc:"Complete a hard mode puzzle",  iconName:"Skull",    color:"#B91C1C"},
];
const XP_PER_PUZZLE=50, XP_PER_CORRECT=10;
const XP_LEVELS=[0,100,250,500,850,1300,1900,2700,3700,5000,7000];
function xpLevel(xp){let l=0;for(let i=0;i<XP_LEVELS.length;i++){if(xp>=XP_LEVELS[i])l=i+1;else break;}return l;}
function xpNextThreshold(xp){const l=xpLevel(xp);return XP_LEVELS[l]||null;}
function xpPct(xp){const l=xpLevel(xp),cur=XP_LEVELS[l-1]||0,nxt=XP_LEVELS[l];if(!nxt)return 1;return(xp-cur)/(nxt-cur);}

const INIT_PROFILE={
  streak:7, totalXP:620,
  badges:["first_play","streak_7"],
  themePerfects:{Monday:2,Tuesday:1,Wednesday:3,Thursday:0,Friday:1,Saturday:0,Sunday:1},
  history:[],
};


// ── API CLIENT ─────────────────────────────────────────────────────────────
const API_BASE = "/api";

async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(API_BASE + path, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "API error");
    return data;
  } catch (e) {
    console.warn("API call failed:", path, e.message);
    throw e;
  }
}

const api = {
  signup: (email, password, handle) =>
    apiFetch("/auth/signup", { method: "POST", body: JSON.stringify({ email, password, handle }) }),
  getPuzzleToday: (mode) => apiFetch("/puzzle/today?mode=" + (mode || "normal")),
  submitPuzzle: (userId, puzzleId, answers, timeTakenMs, mode) =>
    apiFetch("/puzzle/submit", { method: "POST", body: JSON.stringify({ userId, puzzleId, answers, timeTakenMs, mode }) }),
  getGroups: (userId) => apiFetch("/groups?userId=" + userId),
  createGroup: (userId, name, hardMode) =>
    apiFetch("/groups", { method: "POST", body: JSON.stringify({ userId, name, hardMode }) }),
  joinGroup: (userId, code) =>
    apiFetch("/groups/join", { method: "POST", body: JSON.stringify({ userId, code }) }),
  getLeaderboard: (period) => apiFetch("/leaderboard/global?period=" + (period || "daily")),
  getProfile: (userId) => apiFetch("/profile?userId=" + userId),
};

// ── MULTI-GROUP DATA ───────────────────────────────────────────────────────
const INIT_GROUPS = [
  {
    id:"g1",name:"Friday Night Crew",code:"FNC-4829",isCreator:true,hardMode:false,
    members:[{name:"You",score:null,done:false},{name:"Alex",score:420,done:true},{name:"Jordan",score:380,done:true},{name:"Sam",score:510,done:true},{name:"Riley",score:290,done:true}],
    weekly:[{name:"Sam",scores:[510,480,430,null]},{name:"Alex",scores:[420,400,510,null]},{name:"Jordan",scores:[380,350,490,null]},{name:"You",scores:[null,460,380,null]},{name:"Riley",scores:[290,320,410,null]}],
    messages:[
      {id:1,type:"score_card",author:"Sam",score:510,accuracy:100,time:"8:02 AM",reactions:{crown:["Alex","Jordan"],fire:["Riley"]}},
      {id:2,type:"chat",author:"Alex",text:"Sam going off as usual",time:"8:03 AM",reactions:{}},
      {id:3,type:"score_card",author:"Alex",score:420,accuracy:80,time:"8:15 AM",reactions:{celebrate:["Sam"]}},
      {id:4,type:"chat",author:"Jordan",text:"These questions are rough today",time:"8:22 AM",reactions:{laugh:["Alex","Riley"]}},
      {id:5,type:"score_card",author:"Jordan",score:380,accuracy:80,time:"8:24 AM",reactions:{}},
      {id:6,type:"chat",author:"Sam",text:"Jordan you gotta study up",time:"8:25 AM",reactions:{laugh:["Jordan"]}},
      {id:7,type:"score_card",author:"Riley",score:290,accuracy:60,time:"9:10 AM",reactions:{skull:["Alex","Sam","Jordan"]}},
      {id:8,type:"chat",author:"Riley",text:"I was half asleep okay",time:"9:11 AM",reactions:{laugh:["Alex","Sam","Jordan"]}},
      {id:9,type:"chat",author:"Alex",text:"You still playing today?",time:"9:45 AM",reactions:{}},
    ],
  },
  {
    id:"g2",name:"Book Club Brainiacs",code:"BCB-7731",isCreator:false,hardMode:true,
    members:[{name:"You",score:null,done:false},{name:"Casey",score:480,done:true},{name:"Morgan",score:390,done:true},{name:"Drew",score:550,done:true}],
    weekly:[{name:"Drew",scores:[550,520,null,null]},{name:"Casey",scores:[480,460,null,null]},{name:"You",scores:[null,430,null,null]},{name:"Morgan",scores:[390,370,null,null]}],
    messages:[
      {id:1,type:"score_card",author:"Drew",score:550,accuracy:100,time:"7:55 AM",reactions:{crown:["Casey","Morgan"]}},
      {id:2,type:"chat",author:"Casey",text:"Drew is unbeatable on hard mode",time:"7:56 AM",reactions:{}},
      {id:3,type:"score_card",author:"Casey",score:480,accuracy:80,time:"8:30 AM",reactions:{celebrate:["Drew"]}},
      {id:4,type:"score_card",author:"Morgan",score:390,accuracy:60,time:"9:00 AM",reactions:{mood:["Casey"]}},
      {id:5,type:"chat",author:"Morgan",text:"Hard mode is no joke",time:"9:01 AM",reactions:{laugh:["Drew","Casey"]}},
      {id:6,type:"chat",author:"Drew",text:"You doing today's puzzle?",time:"9:50 AM",reactions:{}},
    ],
  },
  {
    id:"g3",name:"Work Lunch Gang",code:"WLG-2255",isCreator:true,hardMode:false,
    members:[{name:"You",score:null,done:false},{name:"Pat",score:310,done:true},{name:"Sam",score:440,done:true}],
    weekly:[{name:"Sam",scores:[440,null,null,null]},{name:"You",scores:[null,null,null,null]},{name:"Pat",scores:[310,null,null,null]}],
    messages:[
      {id:1,type:"score_card",author:"Sam",score:440,accuracy:80,time:"12:05 PM",reactions:{celebrate:["Pat"]}},
      {id:2,type:"chat",author:"Pat",text:"Doing this on my lunch break",time:"12:10 PM",reactions:{}},
      {id:3,type:"score_card",author:"Pat",score:310,accuracy:60,time:"12:15 PM",reactions:{}},
      {id:4,type:"chat",author:"Sam",text:"You playing today?",time:"12:30 PM",reactions:{}},
    ],
  },
];

// ── UTILS ──────────────────────────────────────────────────────────────────
function calcScore(correct,timeLeft,timeLimit,streak){
  if(!correct) return 0;
  return 100+(timeLimit?Math.floor((timeLeft/timeLimit)*50):0)+streak*10;
}
function levenshtein(a,b){
  const m=a.length,n=b.length,dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j-1],dp[i-1][j],dp[i][j-1]);
  return dp[m][n];
}
function fuzzyMatch(userInput,correct){
  const u=userInput.trim().toLowerCase().replace(/[.,!?']/g,"");
  const a=correct.trim().toLowerCase().replace(/[.,!?']/g,"");
  if(!u) return false;
  if(u===a||a.includes(u)||u.includes(a)) return true;
  const al=ALIASES[a]||[]; if(al.includes(u)) return true;
  for(const[k,v] of Object.entries(ALIASES)) if((k===u||v.includes(u))&&(k===a||v.includes(a))) return true;
  if(levenshtein(u,a)<=(a.length<=5?1:2)) return true;
  const stop=new Set(["the","a","an","of","in","on","at","to","for","is","was"]);
  const aw=a.split(/\s+/).filter(w=>w.length>1&&!stop.has(w)),uw=u.split(/\s+/);
  if(aw.length>0&&aw.every(x=>uw.some(y=>y===x||levenshtein(y,x)<=1))) return true;
  return false;
}
function genCode(){
  const alpha="ABCDEFGHJKLMNPQRSTUVWXYZ";
  const p1=Array.from({length:3},()=>alpha[Math.floor(Math.random()*alpha.length)]).join("");
  return `${p1}-${Math.floor(1000+Math.random()*9000)}`;
}

// ── SHARED UI ──────────────────────────────────────────────────────────────
function Divider({c}){return <div style={{height:1,background:c.border}}/>;}
function SectionLabel({text,c}){return <div style={{fontSize:12,fontWeight:700,color:c.textMuted,marginBottom:8,marginTop:4}}>{text}</div>;}
function Card({children,c,style={},onClick}){
  return <div onClick={onClick} style={{background:c.surface,border:`1.5px solid ${c.border}`,borderRadius:12,padding:16,...style,cursor:onClick?"pointer":"default"}}>{children}</div>;
}
function Btn({label,icon,onClick,variant="primary",c,style={},disabled=false}){
  const vs={
    primary:{background:c.accent,color:"#fff",border:"none"},
    secondary:{background:"transparent",color:c.accent,border:`2px solid ${c.accent}`},
    ghost:{background:"transparent",color:c.text,border:`1.5px solid ${c.border}`},
    danger:{background:c.hardRed,color:"#fff",border:"none"},
    warn:{background:c.warn,color:"#fff",border:"none"},
  };
  return <button onClick={onClick} disabled={disabled} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px 20px",borderRadius:10,fontSize:16,fontWeight:600,cursor:disabled?"default":"pointer",opacity:disabled?0.45:1,width:"100%",minHeight:52,...vs[variant],...style}}>{icon&&icon}{label}</button>;
}
function HardBadge({c,small}){
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:c.hardBg,border:`1.5px solid ${c.hardRed}`,color:c.hardRed,fontWeight:700,fontSize:small?11:12,padding:small?"2px 8px":"4px 10px",borderRadius:6}}><Icon.Skull size={small?13:15} color={c.hardRed}/>{small?"Hard":"Hard Mode"}</span>;
}
function TimerBar({total,current,c}){
  const pct=Math.max(0,(current/total)*100),danger=pct<30;
  return <div style={{width:"100%",height:8,background:c.border,borderRadius:4,overflow:"hidden",margin:"12px 0"}}><div style={{height:"100%",width:`${pct}%`,background:danger?c.wrong:c.accent,borderRadius:4,transition:"width 1s linear, background 0.3s"}}/></div>;
}
function ReactionPicker({onPick,onClose,align,c}){
  return <div style={{position:"absolute",[align==="right"?"right":"left"]:0,bottom:36,background:c.surface,border:`1.5px solid ${c.border}`,borderRadius:12,padding:10,display:"flex",gap:6,flexWrap:"wrap",width:200,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",zIndex:300}}>
    {REACTIONS.map(r=><button key={r.key} onClick={()=>{onPick(r.key);onClose();}} style={{width:40,height:40,borderRadius:8,border:`1.5px solid ${c.border}`,background:c.surface2,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><r.IconComp size={20} color={c.accent}/></button>)}
  </div>;
}

// ── DEV: DAY SELECTOR BAR ─────────────────────────────────────────────────
function DevDaySelector({selectedDay,onSelectDay,c}){
  return(
    <div style={{background:c.warnBg,border:`1.5px solid ${c.warn}`,borderRadius:10,margin:"0 0 0 0",padding:"10px 14px"}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
        <Icon.Bug size={16} color={c.warn}/>
        <span style={{fontSize:12,fontWeight:700,color:c.warn}}>DEV MODE — Testing Day Override</span>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
        {DAYS.map(day=>{
          const TI=THEME_ICONS[day];
          const isActive=day===selectedDay;
          return(
            <button key={day} onClick={()=>onSelectDay(day)}
              style={{display:"flex",alignItems:"center",gap:5,padding:"6px 10px",borderRadius:8,border:`1.5px solid ${isActive?c.warn:c.border}`,background:isActive?c.warn:c.surface,color:isActive?"#fff":c.text,fontSize:12,fontWeight:isActive?700:500,cursor:"pointer",transition:"all 0.15s"}}>
              <TI size={14} color={isActive?"#fff":c.textMuted}/>
              {day.slice(0,3)}
            </button>
          );
        })}
      </div>
      <div style={{marginTop:8,fontSize:11,color:c.warn,opacity:0.8}}>
        Active: <strong>{selectedDay}</strong> — {DAY_THEMES[selectedDay].name}
        {" · "}Changing day resets your score for testing.
      </div>
    </div>
  );
}

// ── GROUP SWITCHER ─────────────────────────────────────────────────────────
function GroupSwitcher({groups,activeId,onSwitch,c}){
  const [open,setOpen]=useState(false);
  const active=groups.find(g=>g.id===activeId)||groups[0];
  return(
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:20,border:`1.5px solid ${c.accent}`,background:c.accentBg,cursor:"pointer",maxWidth:220}}>
        <Icon.Groups size={18} color={c.accent}/>
        <span style={{fontSize:14,fontWeight:600,color:c.accentText,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:130}}>{active.name}</span>
        <Icon.ChevronD size={18} color={c.accentText}/>
      </button>
      {open&&(
        <div style={{position:"absolute",top:"110%",left:0,background:c.surface,border:`1.5px solid ${c.border}`,borderRadius:12,overflow:"hidden",boxShadow:"0 8px 24px rgba(0,0,0,0.18)",zIndex:400,minWidth:220}}>
          {groups.map((g,i)=>(
            <div key={g.id}>
              {i>0&&<Divider c={c}/>}
              <button onClick={()=>{onSwitch(g.id);setOpen(false);}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:g.id===activeId?c.accentBg:"transparent",border:"none",cursor:"pointer",textAlign:"left"}}>
                <div style={{width:32,height:32,borderRadius:8,background:g.id===activeId?c.accent:c.border,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon.Groups size={18} color={g.id===activeId?"#fff":c.textMuted}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:g.id===activeId?c.accentText:c.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</div>
                  <div style={{fontSize:11,color:c.textMuted}}>{g.members.length} members{g.hardMode?" · Hard Mode":""}</div>
                </div>
                {g.id===activeId&&<Icon.Check size={18} color={c.accent}/>}
              </button>
            </div>
          ))}
          <Divider c={c}/>
          <button onClick={()=>setOpen(false)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"transparent",border:"none",cursor:"pointer"}}>
            <div style={{width:32,height:32,borderRadius:8,background:c.surface2,border:`1.5px solid ${c.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon.AddCircle size={18} color={c.accent}/>
            </div>
            <span style={{fontSize:14,fontWeight:600,color:c.accent}}>Create or Join Group</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ── SCORE CARD (in chat) ───────────────────────────────────────────────────
function ScoreCard({msg,onReact,isYou,hardMode,day,c}){
  const [showPicker,setShowPicker]=useState(false);
  const reactions=Object.entries(msg.reactions).filter(([,u])=>u.length>0);
  const ThemeIconComp=THEME_ICONS[day||"Wednesday"];
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:isYou?"flex-end":"flex-start",marginBottom:4}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexDirection:isYou?"row-reverse":"row"}}>
        <Avatar name={msg.author} size={30}/>
        <span style={{fontSize:13,color:c.textMuted}}>{msg.author} · {msg.time}</span>
      </div>
      <div style={{maxWidth:280,width:"100%",background:c.surface,border:`1.5px solid ${isYou?c.accent:c.border}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{background:isYou?c.accent:c.surface2,padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
          <ThemeIconComp size={18} color={isYou?"#fff":c.accent}/>
          <span style={{fontSize:13,fontWeight:700,color:isYou?"#fff":c.accent}}>{DAY_THEMES[day||"Wednesday"].name}</span>
          {hardMode&&<HardBadge c={c} small/>}
        </div>
        <div style={{padding:"14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:38,fontWeight:900,color:c.text,lineHeight:1}}>{msg.score}</div>
            <div style={{fontSize:13,color:c.textMuted,marginTop:4}}>{msg.accuracy}% accuracy</div>
          </div>
          <Icon.Trophy size={40} color={msg.score>=500?c.gold:c.textMuted}/>
        </div>
        <div style={{padding:"8px 14px 12px",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",borderTop:`1px solid ${c.border}`}}>
          {reactions.map(([rk,users])=>(
            <button key={rk} onClick={()=>onReact(msg.id,rk)} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,border:`1.5px solid ${users.includes("You")?c.accent:c.border}`,background:users.includes("You")?c.accentBg:c.surface2,cursor:"pointer",minHeight:32}}>
              <ReactionIcon rkey={rk} size={16} c={c}/>
              <span style={{fontSize:13,fontWeight:600,color:c.text}}>{users.length}</span>
            </button>
          ))}
          <div style={{position:"relative"}}>
            <button onClick={()=>setShowPicker(p=>!p)} style={{width:32,height:32,borderRadius:20,border:`1.5px solid ${c.border}`,background:c.surface2,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:c.textMuted,fontSize:18}}>+</button>
            {showPicker&&<ReactionPicker onPick={e=>onReact(msg.id,e)} onClose={()=>setShowPicker(false)} align={isYou?"right":"left"} c={c}/>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CHAT BUBBLE ────────────────────────────────────────────────────────────
function ChatBubble({msg,onReact,isYou,showAvatar,c}){
  const [showPicker,setShowPicker]=useState(false);
  const reactions=Object.entries(msg.reactions).filter(([,u])=>u.length>0);
  return(
    <div style={{display:"flex",flexDirection:isYou?"row-reverse":"row",alignItems:"flex-end",gap:8}}>
      <div style={{width:34,flexShrink:0}}>{showAvatar&&!isYou&&<Avatar name={msg.author} size={30}/>}</div>
      <div style={{maxWidth:"72%",display:"flex",flexDirection:"column",alignItems:isYou?"flex-end":"flex-start"}}>
        {showAvatar&&!isYou&&<span style={{fontSize:12,color:c.textMuted,marginBottom:3}}>{msg.author}</span>}
        <div style={{padding:"12px 16px",borderRadius:isYou?"18px 18px 4px 18px":"18px 18px 18px 4px",background:isYou?c.accent:c.surface,border:`1.5px solid ${isYou?c.accent:c.border}`,fontSize:15,lineHeight:1.5,color:isYou?"#fff":c.text,wordBreak:"break-word"}}>
          {msg.text}
        </div>
        {reactions.length>0&&(
          <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap",justifyContent:isYou?"flex-end":"flex-start"}}>
            {reactions.map(([rk,users])=>(
              <button key={rk} onClick={()=>onReact(msg.id,rk)} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:20,border:`1.5px solid ${users.includes("You")?c.accent:c.border}`,background:users.includes("You")?c.accentBg:c.surface2,cursor:"pointer",minHeight:28}}>
                <ReactionIcon rkey={rk} size={14} c={c}/><span style={{fontSize:12,color:c.text}}>{users.length}</span>
              </button>
            ))}
          </div>
        )}
        <div style={{position:"relative",marginTop:2}}>
          <button onClick={()=>setShowPicker(p=>!p)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:c.textMuted,padding:"2px 4px"}}>+ react</button>
          {showPicker&&<ReactionPicker onPick={e=>{onReact(msg.id,e);setShowPicker(false);}} onClose={()=>setShowPicker(false)} align={isYou?"right":"left"} c={c}/>}
        </div>
      </div>
    </div>
  );
}

// ── CHAT SCREEN ────────────────────────────────────────────────────────────
function ChatScreen({group,onUpdateGroup,hardMode,userScore,userPlayed,day,c,groups,onSwitchGroup}){
  const [inputText,setInputText]=useState("");
  const bottomRef=useRef(null);
  const inputRef=useRef(null);
  const scorePosted=useRef({});

  useEffect(()=>{
    if(userPlayed&&!scorePosted.current[group.id]){
      scorePosted.current[group.id]=true;
      const card={id:Date.now(),type:"score_card",author:"You",score:userScore,accuracy:80,time:"Just now",reactions:{}};
      const bots=group.members.filter(m=>m.name!=="You");
      const bot=bots[Math.floor(Math.random()*bots.length)]?.name||"Alex";
      const reply=userScore>500?{from:bot,text:hardMode?"Hard mode and 500+? Impressive!":"Nice score!"}:userScore>350?{from:bot,text:"Good effort!"}:{from:bot,text:"Better luck next time!"};
      const chatMsg={id:Date.now()+1,type:"chat",author:reply.from,text:reply.text,time:"Just now",reactions:{}};
      onUpdateGroup(group.id,g=>({...g,messages:[...g.messages,card,chatMsg]}));
    }
  },[userPlayed,group.id]);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[group.messages]);

  function sendMessage(){
    if(!inputText.trim()) return;
    const txt=inputText.trim(); setInputText("");
    onUpdateGroup(group.id,g=>({...g,messages:[...g.messages,{id:Date.now(),type:"chat",author:"You",text:txt,time:"Just now",reactions:{}}]}));
    inputRef.current?.focus();
    const replies=["Good point!","Totally agree","Ha, true","No way!","Same here"];
    const bots=group.members.filter(m=>m.name!=="You");
    if(bots.length){
      const bot=bots[Math.floor(Math.random()*bots.length)];
      setTimeout(()=>onUpdateGroup(group.id,g=>({...g,messages:[...g.messages,{id:Date.now()+2,type:"chat",author:bot.name,text:replies[Math.floor(Math.random()*replies.length)],time:"Just now",reactions:{}}]})),900+Math.random()*500);
    }
  }

  function handleReact(msgId,emoji){
    onUpdateGroup(group.id,g=>({...g,messages:g.messages.map(m=>{
      if(m.id!==msgId) return m;
      const cur=m.reactions[emoji]||[];
      return{...m,reactions:{...m.reactions,[emoji]:cur.includes("You")?cur.filter(u=>u!=="You"):[...cur,"You"]}};
    })}));
  }

  const playedCount=group.members.filter(m=>m.done).length+(userPlayed?1:0);
  return(
    <div style={{height:"calc(100vh - 64px)",background:c.bg,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:`1.5px solid ${c.border}`,background:c.surface,flexShrink:0}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{marginBottom:4}}><GroupSwitcher groups={groups} activeId={group.id} onSwitch={onSwitchGroup} c={c}/></div>
          <div style={{fontSize:13,color:c.textMuted,display:"flex",alignItems:"center",gap:6}}>
            {playedCount} of {group.members.length+1} played today {group.hardMode&&<><span>·</span><HardBadge c={c} small/></>}
          </div>
        </div>
        <Icon.Lock size={16} color={c.textMuted}/>
      </div>
      <div style={{textAlign:"center",padding:"10px 0",flexShrink:0}}>
        <span style={{fontSize:12,color:c.textMuted,background:c.surface2,border:`1px solid ${c.border}`,padding:"4px 12px",borderRadius:20}}>
          {day} · {DAY_THEMES[day].name}{group.hardMode?" · Hard Mode":""}
        </span>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"4px 16px 12px"}}>
        {group.messages.map((msg,i)=>{
          const isYou=msg.author==="You",prev=group.messages[i-1],showAvatar=!prev||prev.author!==msg.author;
          return(
            <div key={msg.id} style={{marginBottom:showAvatar&&i>0?16:4}}>
              {msg.type==="score_card"
                ?<ScoreCard msg={msg} onReact={handleReact} isYou={isYou} hardMode={group.hardMode} day={day} c={c}/>
                :<ChatBubble msg={msg} onReact={handleReact} isYou={isYou} showAvatar={showAvatar} c={c}/>}
            </div>
          );
        })}
        {!userPlayed&&<div style={{textAlign:"center",margin:"20px 0"}}><div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 18px",borderRadius:10,background:c.accentBg,border:`1.5px solid ${c.accent}`,fontSize:14,color:c.accentText,fontWeight:500}}><Icon.Target size={18} color={c.accent}/> Play today's puzzle to post your score</div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"10px 12px 12px",borderTop:`1.5px solid ${c.border}`,background:c.surface,display:"flex",gap:8,alignItems:"flex-end",flexShrink:0}}>
        <div style={{flex:1,background:c.surface2,borderRadius:24,border:`1.5px solid ${c.border}`,display:"flex",alignItems:"center",padding:"0 8px 0 16px",minHeight:48}}>
          <input ref={inputRef} value={inputText} onChange={e=>setInputText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()} placeholder="Message the group…" style={{flex:1,background:"none",border:"none",color:c.text,fontSize:15,outline:"none",padding:"12px 0"}}/>
        </div>
        <button onClick={sendMessage} disabled={!inputText.trim()} style={{width:48,height:48,borderRadius:"50%",border:"none",flexShrink:0,background:inputText.trim()?c.accent:c.border,color:"#fff",cursor:inputText.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.2s"}}>
          <Icon.Send size={20} color="#fff"/>
        </button>
      </div>
    </div>
  );
}

// ── HOME SCREEN ────────────────────────────────────────────────────────────
// ── GROUPS TODAY (paginated, 4 per page, swipeable) ───────────────────────
const GROUPS_PER_PAGE=4;
function GroupCard({g,modeScores,c}){
  const played=g.members.filter(m=>m.done).length;
  const total=g.members.length;
  const pct=total>0?played/total:0;
  const gScore=modeScores[g.hardMode?"hard":"normal"]?.score??null;
  const doneMembers=g.members.filter(m=>m.done);
  return(
    <div style={{background:c.surface,border:`1.5px solid ${c.border}`,borderRadius:12,padding:"12px 14px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
      {/* Name row — fixed single line, badge below if needed */}
      <div style={{marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:g.hardMode?4:0}}>
          <Icon.Groups size={14} color={c.accent} style={{flexShrink:0}}/>
          <span style={{fontSize:13,fontWeight:600,color:c.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,minWidth:0}}>{g.name}</span>
        </div>
        {g.hardMode&&<div style={{marginTop:2}}><HardBadge c={c} small/></div>}
      </div>
      {/* Progress bar */}
      <div style={{height:5,background:c.surface2,borderRadius:3,overflow:"hidden",marginBottom:6,border:`1px solid ${c.border}`}}>
        <div style={{height:"100%",width:`${pct*100}%`,background:pct===1?c.correct:c.accent,borderRadius:3,transition:"width 0.4s"}}/>
      </div>
      {/* Footer */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:11,color:c.textMuted}}>{played}/{total} played{gScore!=null?` · ${gScore}pts`:""}</span>
        <div style={{display:"flex"}}>
          {doneMembers.slice(0,3).map((m,i)=>(
            <div key={i} style={{marginLeft:i>0?-6:0,position:"relative",zIndex:3-i}}>
              <Avatar name={m.name} size={20}/>
            </div>
          ))}
          {doneMembers.length>3&&(
            <div style={{marginLeft:-6,width:20,height:20,borderRadius:"50%",background:c.surface2,border:`1px solid ${c.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:c.textMuted,position:"relative",zIndex:0}}>+{doneMembers.length-3}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function GroupsToday({groups,modeScores,onOpenGroups,c}){
  const [page,setPage]=useState(0);
  const totalPages=Math.ceil(groups.length/GROUPS_PER_PAGE);
  const pageGroups=groups.slice(page*GROUPS_PER_PAGE,(page+1)*GROUPS_PER_PAGE);
  const touchStart=useRef(null);
  function onTouchStart(e){touchStart.current=e.touches[0].clientX;}
  function onTouchEnd(e){
    if(touchStart.current===null) return;
    const dx=e.changedTouches[0].clientX-touchStart.current;
    if(dx<-40&&page<totalPages-1) setPage(p=>p+1);
    else if(dx>40&&page>0) setPage(p=>p-1);
    touchStart.current=null;
  }
  return(
    <div style={{margin:"20px 20px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <SectionLabel text="Groups Today" c={c}/>
        <button onClick={onOpenGroups} style={{display:"flex",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",color:c.accent,fontSize:13,fontWeight:600,padding:"4px 0"}}>
          <Icon.Add size={16} color={c.accent}/>Manage
        </button>
      </div>
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{userSelect:"none"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,alignItems:"stretch"}}>
          {Array.from({length:GROUPS_PER_PAGE}).map((_,i)=>{
            const g=pageGroups[i];
            return g
              ? <GroupCard key={g.id} g={g} modeScores={modeScores} c={c}/>
              : <div key={"empty-"+i}/>;
          })}
        </div>
        {totalPages>1&&(
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:12,marginTop:12}}>
            <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} style={{background:"none",border:"none",cursor:page===0?"default":"pointer",opacity:page===0?0.3:1,padding:4}}>
              <Icon.Back size={16} color={c.textMuted}/>
            </button>
            <div style={{display:"flex",gap:6}}>
              {Array.from({length:totalPages}).map((_,i)=>(
                <button key={i} onClick={()=>setPage(i)} style={{width:i===page?20:7,height:7,borderRadius:4,background:i===page?c.accent:c.border,border:"none",cursor:"pointer",padding:0,transition:"all 0.2s"}}/>
              ))}
            </div>
            <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page===totalPages-1} style={{background:"none",border:"none",cursor:page===totalPages-1?"default":"pointer",opacity:page===totalPages-1?0.3:1,padding:4}}>
              <Icon.ChevronR size={16} color={c.textMuted}/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function HomeScreen({groups,activeGroupId,onSwitchGroup,onStartNormal,onStartHard,alreadyPlayed,modeScores,needsHard,needsNormal,hasHardGroups,userScore,onOpenChat,totalUnread,onOpenSettings,c,onToggleDark,isDark,onOpenGroups,day,onSelectDay,streak}){
  const ThemeIcon=THEME_ICONS[day];
  const todayIdx=DAYS.indexOf(day);
  const doneNormal=!!modeScores.normal;
  const doneHard=!!modeScores.hard;
  const hasBothModes=needsHard&&needsNormal;
  const weeklyPts=(modeScores.normal?.score??0)+(modeScores.hard?.score??0);
  // allDone = all *required* modes played (hard only required if they have hard groups)
  const allDone=(!needsNormal||doneNormal)&&(!needsHard||doneHard);

  return(
    <div style={{minHeight:"calc(100vh - 64px)",background:c.bg}}>

      {/* ── Header ── */}
      <div style={{padding:"18px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:12,fontWeight:600,color:c.textMuted}}>Today</div>
          <div style={{fontSize:24,fontWeight:900,color:c.text}}>Trivia Daily</div>
        </div>
        <button onClick={onToggleDark} style={{width:44,height:44,borderRadius:"50%",border:`1.5px solid ${c.border}`,background:c.surface,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          {isDark?<Icon.LightMode size={22} color={c.text}/>:<Icon.DarkMode size={22} color={c.text}/>}
        </button>
      </div>

      {/* ── Dev day selector ── */}
      <div style={{margin:"14px 20px 0"}}>
        <DevDaySelector selectedDay={day} onSelectDay={onSelectDay} c={c}/>
      </div>

      {/* ── Streak + Points stat row ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"14px 20px 0"}}>
        <div style={{background:c.surface,border:`1.5px solid ${c.border}`,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:10,background:"#FFF0E0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Icon.Flame size={22} color={c.streakOrange}/>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:600,color:c.textMuted}}>Streak</div>
            <div style={{fontSize:22,fontWeight:900,color:c.streakOrange}}>{streak||7} <span style={{fontSize:12,fontWeight:500,color:c.textMuted}}>days</span></div>
          </div>
        </div>
        <div style={{background:c.surface,border:`1.5px solid ${c.border}`,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:10,background:c.accentBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Icon.Trophy size={22} color={c.accent}/>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:600,color:c.textMuted}}>Today's pts</div>
            <div style={{fontSize:22,fontWeight:900,color:alreadyPlayed?c.accent:c.textMuted}}>{alreadyPlayed?weeklyPts:"—"}</div>
          </div>
        </div>
      </div>

      {/* ── Today's puzzle card ── */}
      <Card c={c} style={{margin:"14px 20px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{width:52,height:52,borderRadius:12,background:c.accentBg,border:`1.5px solid ${c.accent}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <ThemeIcon size={28} color={c.accent}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:600,color:c.textMuted}}>{day}'s Theme</div>
            <div style={{fontSize:20,fontWeight:800,color:c.text}}>{DAY_THEMES[day].name}</div>
            <div style={{fontSize:13,color:c.textMuted,marginTop:2}}>Mixed formats · {ALL_PUZZLES[day].normal.length} questions</div>
          </div>
        </div>

        {allDone?(
          <div style={{background:c.accentBg,border:`1.5px solid ${c.accent}`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <Icon.Check size={18} color={c.accentText}/>
              <span style={{fontSize:13,fontWeight:600,color:c.accentText}}>All done today!</span>
            </div>
            <div style={{display:"flex",gap:12}}>
              {doneNormal&&(
                <div style={{flex:1,background:c.surface,borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                  <div style={{fontSize:11,fontWeight:600,color:c.textMuted,marginBottom:2}}>Normal</div>
                  <div style={{fontSize:22,fontWeight:900,color:c.text}}>{modeScores.normal.score}</div>
                  <div style={{fontSize:11,color:c.textMuted}}>pts</div>
                </div>
              )}
              {doneHard&&(
                <div style={{flex:1,background:c.hardBg,border:`1px solid ${c.hardRed}`,borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                  <div style={{fontSize:11,fontWeight:600,color:c.hardRed,marginBottom:2}}>Hard</div>
                  <div style={{fontSize:22,fontWeight:900,color:c.text}}>{modeScores.hard.score}</div>
                  <div style={{fontSize:11,color:c.textMuted}}>pts</div>
                </div>
              )}
              {doneNormal&&doneHard&&(
                <div style={{flex:1,background:c.surface2,borderRadius:8,padding:"10px 12px",textAlign:"center",border:`1px solid ${c.border}`}}>
                  <div style={{fontSize:11,fontWeight:600,color:c.textMuted,marginBottom:2}}>Total</div>
                  <div style={{fontSize:22,fontWeight:900,color:c.accent}}>{weeklyPts}</div>
                  <div style={{fontSize:11,color:c.textMuted}}>pts</div>
                </div>
              )}
            </div>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {/* Normal button */}
            <button
              onClick={onStartNormal}
              disabled={doneNormal}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"14px 12px",borderRadius:10,border:`2px solid ${doneNormal?c.correct:c.accent}`,background:doneNormal?c.correctBg:c.accentBg,cursor:doneNormal?"default":"pointer",textAlign:"center",transition:"all 0.15s"}}
            >
              <div style={{width:38,height:38,borderRadius:9,background:doneNormal?"transparent":c.surface,border:`1.5px solid ${doneNormal?c.correct:c.accent}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {doneNormal?<Icon.Check size={20} color={c.correct}/>:<ThemeIcon size={20} color={c.accent}/>}
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:doneNormal?c.correct:c.text}}>Normal</div>
                <div style={{fontSize:11,color:c.textMuted,marginTop:1}}>{doneNormal?`${modeScores.normal.score} pts`:"Standard"}</div>
              </div>
            </button>

            {/* Hard button */}
            <button
              onClick={onStartHard}
              disabled={doneHard}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"14px 12px",borderRadius:10,border:`2px solid ${doneHard?c.correct:c.hardRed}`,background:doneHard?c.correctBg:c.hardBg,cursor:doneHard?"default":"pointer",textAlign:"center",transition:"all 0.15s"}}
            >
              <div style={{width:38,height:38,borderRadius:9,background:doneHard?"transparent":c.surface,border:`1.5px solid ${doneHard?c.correct:c.hardRed}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {doneHard?<Icon.Check size={20} color={c.correct}/>:<Icon.Skull size={20} color={c.hardRed}/>}
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:doneHard?c.correct:c.hardRed}}>Hard Mode</div>
                <div style={{fontSize:11,color:c.textMuted,marginTop:1}}>{doneHard?`${modeScores.hard.score} pts`:hasHardGroups?"Counts for groups":"For fun"}</div>
              </div>
            </button>
          </div>
        )}
      </Card>

      {/* ── Group participation ── */}
      <GroupsToday groups={groups} modeScores={modeScores} onOpenGroups={onOpenGroups} c={c}/>

      {/* ── This Week ── */}
      <div style={{margin:"20px 20px 28px"}}>
        <SectionLabel text="This Week" c={c}/>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
          {DAYS.map((d,i)=>{
            const TI=THEME_ICONS[d],isToday=d===day,isPast=i<todayIdx;
            return(
              <button key={d} onClick={()=>onSelectDay(d)} style={{minWidth:58,textAlign:"center",padding:"10px 6px",borderRadius:10,background:isToday?c.accentBg:c.surface,border:`1.5px solid ${isToday?c.accent:c.border}`,opacity:isPast?0.55:1,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer"}}>
                <TI size={20} color={isToday?c.accent:c.textMuted}/>
                <div style={{fontSize:10,fontWeight:600,color:isToday?c.accentText:c.textMuted}}>{d.slice(0,3)}</div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// ── GROUPS MANAGER ─────────────────────────────────────────────────────────
function GroupsScreen({groups,onBack,onAddGroup,onLeaveGroup,onOpenSettings,onSwitchGroup,c}){
  const [mode,setMode]=useState(null);
  const [newName,setNewName]=useState("");
  const [joinCode,setJoinCode]=useState("");
  const [error,setError]=useState("");

  function handleCreate(){
    if(groups.length>=20){setError("You've reached the 20 group limit.");return;}
    if(!newName.trim()){setError("Please enter a group name.");return;}
    onAddGroup({id:"g"+Date.now(),name:newName.trim(),code:genCode(),isCreator:true,hardMode:false,members:[{name:"You",score:null,done:false}],weekly:[{name:"You",scores:[null,null,null,null]}],messages:[{id:1,type:"chat",author:"You",text:"Just created this group! Share the code to invite friends.",time:"Now",reactions:{}}]});
    setNewName("");setMode(null);
  }
  function handleJoin(){
    if(groups.length>=20){setError("You've reached the 20 group limit.");return;}
    const code=joinCode.trim().toUpperCase();
    if(!code){setError("Please enter a group code.");return;}
    onAddGroup({id:"g"+Date.now(),name:`Group ${code}`,code,isCreator:false,hardMode:false,members:[{name:"You",score:null,done:false},{name:"Alex",score:380,done:true}],weekly:[{name:"You",scores:[null,null,null,null]},{name:"Alex",scores:[380,null,null,null]}],messages:[{id:1,type:"chat",author:"Alex",text:"Welcome to the group!",time:"Now",reactions:{}}]});
    setJoinCode("");setMode(null);
  }

  return(
    <div style={{minHeight:"100vh",background:c.bg}}>
      <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:`1.5px solid ${c.border}`,background:c.surface}}>
        <button onClick={onBack} style={{width:44,height:44,borderRadius:"50%",border:`1.5px solid ${c.border}`,background:c.surface2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Icon.Back size={20} color={c.text}/></button>
        <div style={{fontSize:18,fontWeight:700,color:c.text}}>My Groups <span style={{fontSize:13,fontWeight:500,color:c.textMuted}}>({groups.length}/20)</span></div>
      </div>
      <div style={{padding:"20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          <Btn label="Create Group" icon={<Icon.Add size={18} color="#fff"/>} onClick={()=>{setMode("create");setError("");}} variant="primary" c={c} style={{minHeight:48,fontSize:14}}/>
          <Btn label="Join Group" icon={<Icon.Key size={18} color={c.accent}/>} onClick={()=>{setMode("join");setError("");}} variant="secondary" c={c} style={{minHeight:48,fontSize:14}}/>
        </div>
        {mode==="create"&&(
          <Card c={c} style={{marginBottom:16}}>
            <div style={{fontSize:15,fontWeight:700,color:c.text,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>Create a Group<button onClick={()=>setMode(null)} style={{background:"none",border:"none",cursor:"pointer"}}><Icon.Close size={20} color={c.textMuted}/></button></div>
            <div style={{fontSize:13,color:c.textMuted,marginBottom:10}}>All groups are private — members join by invite code only.</div>
            <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Group name (e.g. Family Trivia)" style={{width:"100%",padding:"12px 14px",borderRadius:10,fontSize:15,background:c.surface2,border:`1.5px solid ${error?c.wrong:c.border}`,color:c.text,outline:"none",boxSizing:"border-box",marginBottom:8}}/>
            {error&&<div style={{fontSize:13,color:c.wrong,marginBottom:8}}>{error}</div>}
            <Btn label="Create" onClick={handleCreate} variant="primary" c={c} style={{minHeight:46,fontSize:15}}/>
          </Card>
        )}
        {mode==="join"&&(
          <Card c={c} style={{marginBottom:16}}>
            <div style={{fontSize:15,fontWeight:700,color:c.text,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>Join a Group<button onClick={()=>setMode(null)} style={{background:"none",border:"none",cursor:"pointer"}}><Icon.Close size={20} color={c.textMuted}/></button></div>
            <div style={{fontSize:13,color:c.textMuted,marginBottom:10}}>Enter the invite code shared by your group's creator.</div>
            <input value={joinCode} onChange={e=>setJoinCode(e.target.value)} placeholder="e.g. FNC-4829" style={{width:"100%",padding:"12px 14px",borderRadius:10,fontSize:15,background:c.surface2,border:`1.5px solid ${error?c.wrong:c.border}`,color:c.text,outline:"none",boxSizing:"border-box",marginBottom:8}}/>
            {error&&<div style={{fontSize:13,color:c.wrong,marginBottom:8}}>{error}</div>}
            <Btn label="Join" onClick={handleJoin} variant="primary" c={c} style={{minHeight:46,fontSize:15}}/>
          </Card>
        )}
        <SectionLabel text={`You're in ${groups.length} group${groups.length!==1?"s":""}`} c={c}/>
        {groups.map(g=>(
          <Card key={g.id} c={c} style={{marginBottom:10,padding:0,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
              <div style={{width:44,height:44,borderRadius:10,background:c.accentBg,border:`1.5px solid ${c.accent}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon.Groups size={24} color={c.accent}/></div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{fontSize:16,fontWeight:700,color:c.text}}>{g.name}</div>
                  {g.hardMode&&<HardBadge c={c} small/>}
                </div>
                <div style={{fontSize:13,color:c.textMuted,marginTop:1}}>{g.members.length} member{g.members.length!==1?"s":""} · <Icon.Lock size={12} color={c.textMuted}/> Private</div>
              </div>
            </div>
            <Divider c={c}/>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",background:c.surface2}}>
              <Icon.Key size={16} color={c.textMuted}/>
              <span style={{fontSize:13,color:c.textMuted,flex:1}}>Code: <strong style={{color:c.accent,fontSize:14}}>{g.code}</strong></span>
              <button style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:8,border:`1.5px solid ${c.border}`,background:c.surface,cursor:"pointer",fontSize:13,color:c.text}}><Icon.Copy size={14} color={c.accent}/>Copy</button>
            </div>
            <Divider c={c}/>
            <div style={{display:"flex"}}>
              <button onClick={()=>onOpenSettings(g.id)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"12px",background:"none",border:"none",borderRight:`1px solid ${c.border}`,cursor:"pointer",fontSize:13,color:c.textMuted}}><Icon.Settings size={16} color={c.textMuted}/>Settings</button>
              <button onClick={()=>{onSwitchGroup(g.id);onBack();}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"12px",background:"none",border:"none",borderRight:`1px solid ${c.border}`,cursor:"pointer",fontSize:13,color:c.accent,fontWeight:600}}><Icon.Chat size={16} color={c.accent}/>Open Chat</button>
              {!g.isCreator
                ?<button onClick={()=>onLeaveGroup(g.id)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"12px",background:"none",border:"none",cursor:"pointer",fontSize:13,color:c.wrong}}><Icon.Leave size={16} color={c.wrong}/>Leave</button>
                :<button disabled style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"12px",background:"none",border:"none",cursor:"default",fontSize:13,color:c.textMuted,opacity:0.5}}>Creator</button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── GROUP SETTINGS ─────────────────────────────────────────────────────────
function GroupSettingsScreen({group,onBack,onToggleHard,c}){
  const [showConfirm,setShowConfirm]=useState(false);
  const [pendingHard,setPendingHard]=useState(group.hardMode);
  return(
    <div style={{minHeight:"100vh",background:c.bg}}>
      <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:`1.5px solid ${c.border}`,background:c.surface}}>
        <button onClick={onBack} style={{width:44,height:44,borderRadius:"50%",border:`1.5px solid ${c.border}`,background:c.surface2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Icon.Back size={20} color={c.text}/></button>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:c.text}}>Group Settings</div>
          <div style={{fontSize:13,color:c.textMuted}}>{group.name}</div>
        </div>
      </div>
      <div style={{padding:"20px"}}>
        <SectionLabel text="Difficulty" c={c}/>
        <Card c={c} style={{marginBottom:8}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <Icon.Brain size={20} color={group.hardMode?c.hardRed:c.accent}/>
                <span style={{fontSize:15,fontWeight:700,color:c.text}}>Hard Mode</span>
                {group.hardMode&&<HardBadge c={c} small/>}
              </div>
              <div style={{fontSize:14,color:c.textMuted,lineHeight:1.5}}>{group.hardMode?"College-level questions.":"High-school level. Challenging but approachable."}</div>
            </div>
            <div onClick={()=>{if(group.isCreator){setPendingHard(!group.hardMode);setShowConfirm(true);}}} style={{width:52,height:30,borderRadius:15,cursor:group.isCreator?"pointer":"not-allowed",flexShrink:0,background:group.hardMode?c.hardRed:c.border,position:"relative",transition:"background 0.25s",opacity:group.isCreator?1:0.5}}>
              <div style={{position:"absolute",top:3,left:group.hardMode?25:3,width:24,height:24,borderRadius:"50%",background:"#fff",transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.25)"}}/>
            </div>
          </div>
          {!group.isCreator&&<div style={{marginTop:10,fontSize:13,color:c.textMuted,display:"flex",alignItems:"center",gap:4}}><Icon.Info size={14} color={c.textMuted}/>Only the group creator can change difficulty.</div>}
        </Card>
        <div style={{display:"flex",alignItems:"flex-start",gap:6,padding:"10px 12px",borderRadius:8,background:c.surface2,border:`1px solid ${c.border}`,marginBottom:24}}>
          <Icon.Info size={16} color={c.textMuted}/>
          <span style={{fontSize:13,color:c.textMuted,lineHeight:1.5}}>Changes take effect tomorrow. Today's difficulty is locked once the first member plays.</span>
        </div>
        <SectionLabel text="Members" c={c}/>
        <Card c={c} style={{marginBottom:14,padding:0,overflow:"hidden"}}>
          {group.members.map((m,i)=>(
            <div key={i}>
              {i>0&&<Divider c={c}/>}
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px"}}>
                <Avatar name={m.name} size={38}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:m.name==="You"?700:500,color:c.text}}>{m.name}</div>
                  {m.name==="You"&&group.isCreator&&<div style={{fontSize:12,color:c.accent,fontWeight:600}}>Group Creator</div>}
                </div>
                {m.name!=="You"&&group.isCreator&&<button style={{padding:"6px 14px",borderRadius:8,border:`1.5px solid ${c.border}`,background:"transparent",color:c.textMuted,fontSize:13,cursor:"pointer"}}>Remove</button>}
              </div>
            </div>
          ))}
        </Card>
        <SectionLabel text="Invite Code" c={c}/>
        <Card c={c}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:15,fontWeight:600,color:c.text}}>Share with friends</div>
              <div style={{fontSize:14,color:c.textMuted,marginTop:2}}>Code: <strong style={{color:c.accent,fontSize:16}}>{group.code}</strong></div>
            </div>
            <Btn label="Copy" icon={<Icon.Copy size={16} color="#fff"/>} onClick={()=>{}} variant="primary" c={c} style={{width:"auto",padding:"10px 18px",minHeight:44}}/>
          </div>
        </Card>
      </div>
      {showConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:500}}>
          <div style={{width:"100%",maxWidth:430,background:c.surface,borderRadius:"20px 20px 0 0",padding:"28px 24px 36px",border:`1.5px solid ${c.border}`}}>
            <div style={{textAlign:"center",marginBottom:16}}>{pendingHard?<Icon.Skull size={48} color={c.hardRed}/>:<Icon.Brain size={48} color={c.accent}/>}</div>
            <div style={{fontSize:20,fontWeight:800,color:c.text,textAlign:"center",marginBottom:8}}>{pendingHard?"Enable Hard Mode?":"Switch to Normal Mode?"}</div>
            <div style={{fontSize:15,color:c.textMuted,textAlign:"center",lineHeight:1.6,marginBottom:28}}>{pendingHard?"Tomorrow's puzzle will use college-level questions. All members will be notified.":"Tomorrow's puzzle will return to standard difficulty."}</div>
            <Btn label={pendingHard?"Enable Hard Mode":"Switch to Normal"} icon={pendingHard?<Icon.Skull size={18} color="#fff"/>:null} onClick={()=>{onToggleHard(pendingHard);setShowConfirm(false);}} variant={pendingHard?"danger":"primary"} c={c} style={{marginBottom:10}}/>
            <Btn label="Cancel" onClick={()=>setShowConfirm(false)} variant="ghost" c={c}/>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PUZZLE SCREEN ──────────────────────────────────────────────────────────
function PuzzleScreen({onComplete,hardMode,day,c,user}){
  const [apiQuestions,setApiQuestions]=useState(null);
  const [puzzleId,setPuzzleId]=useState(null);
  const [loadingPuzzle,setLoadingPuzzle]=useState(true);
  const fallbackQuestions=ALL_PUZZLES[day]?ALL_PUZZLES[day][hardMode?"hard":"normal"]:ALL_PUZZLES["Wednesday"][hardMode?"hard":"normal"];
  const questions=apiQuestions||fallbackQuestions;
  const [qIdx,setQIdx]=useState(0);

  useEffect(()=>{
    setLoadingPuzzle(true);
    api.getPuzzleToday(hardMode?"hard":"normal")
      .then(data=>{
        if(data.questions&&data.questions.length>0){
          const qs=data.questions.map(q=>({
            id:q.id,
            type:q.type,
            question:q.question,
            options:q.options?JSON.parse(typeof q.options==="string"?q.options:JSON.stringify(q.options)):null,
            time_limit:q.time_limit,
          }));
          setApiQuestions(qs);
          setPuzzleId(data.puzzle.id);
        }
      })
      .catch(e=>console.warn("Failed to load puzzle from API, using fallback:",e.message))
      .finally(()=>setLoadingPuzzle(false));
  },[hardMode]);
  const [selected,setSelected]=useState(null);
  const [typedAnswer,setTypedAnswer]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const [timeLeft,setTimeLeft]=useState(null);
  const [scores,setScores]=useState([]);
  const [streak,setStreak]=useState(0);
  const [resultAnim,setResultAnim]=useState(null);
  const timerRef=useRef(null);
  const answersRef=useRef({});
  const q=questions[qIdx];
  const isLast=qIdx===questions.length-1;
  const ThemeIcon=THEME_ICONS[day];

  useEffect(()=>{setSelected(null);setTypedAnswer("");setSubmitted(false);setResultAnim(null);setTimeLeft(q.time_limit||null);},[qIdx]);
  useEffect(()=>{
    if(timeLeft===null||submitted) return;
    if(timeLeft<=0){handleSubmit(true);return;}
    timerRef.current=setTimeout(()=>setTimeLeft(t=>t-1),1000);
    return()=>clearTimeout(timerRef.current);
  },[timeLeft,submitted]);

  function handleSubmit(timedOut=false){
    if(submitted) return;
    setSubmitted(true);clearTimeout(timerRef.current);
    const userAns=timedOut?null:(q.type==="type_in"?typedAnswer:selected);
    if(q.id) answersRef.current[q.id]=userAns||"";
    const correct=q.type==="type_in"?fuzzyMatch(userAns||"",q.answer):userAns===q.answer;
    const pts=calcScore(correct,timeLeft??0,q.time_limit??0,streak);
    const newScores=[...scores,{correct,pts}];
    setScores(newScores);setStreak(correct?streak+1:0);setResultAnim(correct?"correct":"wrong");
    setTimeout(()=>{if(isLast) onComplete(newScores.reduce((a,b)=>a+b.pts,0),newScores,puzzleId,answersRef.current); else setQIdx(i=>i+1);},1400);
  }

  const timerDanger=timeLeft!==null&&timeLeft<=Math.ceil((q.time_limit||1)*0.3);
  const runningScore=scores.reduce((a,b)=>a+b.pts,0);

  if(loadingPuzzle) return(
    <div style={{minHeight:"100vh",background:c.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center",color:c.textMuted}}><div style={{fontSize:15}}>Loading puzzle...</div></div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:c.bg}}>
      <div style={{padding:"16px 20px 12px",background:c.surface,borderBottom:`1.5px solid ${c.border}`,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:10,background:c.accentBg,border:`1.5px solid ${c.accent}`,display:"flex",alignItems:"center",justifyContent:"center"}}><ThemeIcon size={22} color={c.accent}/></div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,color:c.textMuted}}>{DAY_THEMES[day].name}{hardMode?" · Hard Mode":""}</div>
          <div style={{display:"flex",gap:4,marginTop:4}}>
            {questions.map((_,i)=><div key={i} style={{width:28,height:6,borderRadius:3,background:i<qIdx?c.accent:i===qIdx?(submitted?(resultAnim==="correct"?c.correct:c.wrong):c.accent):c.border,transition:"background 0.3s"}}/>)}
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:11,color:c.textMuted}}>Score</div>
          <div style={{fontSize:18,fontWeight:800,color:c.text}}>{runningScore}</div>
        </div>
      </div>

      <div style={{padding:"20px 20px 0"}}>
        <Card c={c} style={{marginBottom:16,background:submitted?(resultAnim==="correct"?c.correctBg:c.wrongBg):c.surface,border:`1.5px solid ${submitted?(resultAnim==="correct"?c.correct:c.wrong):c.border}`,transition:"all 0.3s",position:"relative"}}>
          {submitted&&<div style={{position:"absolute",top:16,right:16}}>{resultAnim==="correct"?<Icon.Check size={32} color={c.correct}/>:<Icon.Cross size={32} color={c.wrong}/>}</div>}
          <div style={{fontSize:12,fontWeight:600,color:c.textMuted,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
            {q.type==="timed"&&<Icon.Lightning size={14} color={c.accent}/>}
            Question {qIdx+1} of {questions.length}
            {hardMode&&<HardBadge c={c} small/>}
          </div>
          <div style={{fontSize:18,fontWeight:600,color:c.text,lineHeight:1.5}}>{q.question}</div>
          {q.time_limit&&<><TimerBar total={q.time_limit} current={timeLeft??0} c={c}/><div style={{fontSize:22,fontWeight:800,color:timerDanger?c.wrong:c.accent,display:"flex",alignItems:"center",gap:6}}><Icon.Clock size={20} color={timerDanger?c.wrong:c.accent}/>{timeLeft}s</div></>}
        </Card>

        {streak>1&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12,padding:"8px 12px",background:c.surface,borderRadius:8,border:`1.5px solid ${c.border}`}}><Icon.Flame size={18} color={c.streakOrange}/><span style={{fontSize:14,fontWeight:600,color:c.streakOrange}}>{streak} in a row!</span></div>}

        {(q.type==="multiple_choice"||q.type==="timed")&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {q.options.map(opt=>{
              const isSel=selected===opt,isCorr=submitted&&opt===q.answer,isWrong=submitted&&isSel&&opt!==q.answer;
              return (
                <button key={opt} onClick={()=>!submitted&&setSelected(opt)} style={{padding:"16px 18px",borderRadius:10,border:`2px solid ${isCorr?c.correct:isWrong?c.wrong:isSel?c.accent:c.border}`,background:isCorr?c.correctBg:isWrong?c.wrongBg:isSel?c.accentBg:c.surface,color:c.text,fontSize:16,fontWeight:isSel?600:400,cursor:submitted?"default":"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,minHeight:56,transition:"all 0.15s"}}>
                  {submitted&&isCorr&&<Icon.Check size={20} color={c.correct}/>}
                  {submitted&&isWrong&&<Icon.Cross size={20} color={c.wrong}/>}
                  {!submitted&&isSel&&<div style={{width:20,height:20,borderRadius:"50%",background:c.accent,flexShrink:0}}/>}
                  {!submitted&&!isSel&&<div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${c.border}`,flexShrink:0}}/>}
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {q.type==="true_false"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {["True","False"].map(opt=>{
              const isSel=selected===opt,isCorr=submitted&&opt===q.answer,isWrong=submitted&&isSel&&opt!==q.answer;
              return (
                <button key={opt} onClick={()=>!submitted&&setSelected(opt)} style={{padding:"24px 0",borderRadius:10,border:`2px solid ${isCorr?c.correct:isWrong?c.wrong:isSel?c.accent:c.border}`,background:isCorr?c.correctBg:isWrong?c.wrongBg:isSel?c.accentBg:c.surface,color:isCorr?c.correct:isWrong?c.wrong:isSel?c.accentText:c.text,fontSize:18,fontWeight:700,cursor:submitted?"default":"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,transition:"all 0.15s"}}>
                  {opt==="True"?<Icon.Check size={28} color={isCorr?c.correct:isSel?c.accent:c.textMuted}/>:<Icon.Cross size={28} color={isWrong?c.wrong:isSel?c.accent:c.textMuted}/>}
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {q.type==="type_in"&&(
          <div>
            <input type="text" value={typedAnswer} onChange={e=>!submitted&&setTypedAnswer(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!submitted&&typedAnswer.trim()&&handleSubmit()} placeholder="Type your answer here…"
              style={{width:"100%",padding:"16px 18px",borderRadius:10,fontSize:16,background:c.surface,border:`2px solid ${submitted?(scores.at(-1)?.correct?c.correct:c.wrong):c.border}`,color:c.text,outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"}}
              autoFocus disabled={submitted}/>
            {submitted&&<div style={{marginTop:8,fontSize:14,color:c.textMuted}}>Accepted answer: <strong style={{color:c.correct}}>{q.answer}</strong></div>}
          </div>
        )}

        {!submitted&&(selected||typedAnswer.trim())&&<div style={{marginTop:16}}><Btn label="Submit Answer" onClick={()=>handleSubmit()} variant={hardMode?"danger":"primary"} c={c}/></div>}
      </div>
    </div>
  );
}

// ── RESULTS SCREEN ─────────────────────────────────────────────────────────
function ResultsScreen({modeScores,currentMode,nextMode,onNextPuzzle,onViewLeaderboard,onOpenChat,groups,day,c,profile,prevBadges}){
  const showingMode=currentMode||(modeScores.hard?"hard":"normal");
  const ms=modeScores[showingMode]||{score:0,breakdown:[]};
  const totalScore=ms.score, breakdown=ms.breakdown;
  const correct=breakdown.filter(b=>b.correct).length;
  const perfect=correct===breakdown.length&&breakdown.length>0;
  const hardMode=showingMode==="hard";
  const questions=ALL_PUZZLES[day][hardMode?"hard":"normal"];
  const xpGained=XP_PER_PUZZLE+(correct*XP_PER_CORRECT);
  const newBadges=profile&&prevBadges?BADGE_DEFS.filter(b=>profile.badges.includes(b.id)&&!prevBadges.includes(b.id)):[];
  const hasBoth=modeScores.normal&&modeScores.hard;
  const matchingGroups=groups.filter(g=>g.hardMode===(showingMode==="hard"));
  return(
    <div style={{minHeight:"100vh",background:c.bg,padding:"0 20px 40px"}}>
      <div style={{paddingTop:48,textAlign:"center",marginBottom:20}}>
        {nextMode&&<div style={{marginBottom:12,padding:"8px 16px",borderRadius:20,background:c.hardBg,border:`1.5px solid ${c.hardRed}`,display:"inline-block",fontSize:13,fontWeight:700,color:c.hardRed}}>Round 1 done · Hard Mode next</div>}
        {hasBoth&&!nextMode&&<div style={{marginBottom:12,padding:"8px 16px",borderRadius:20,background:c.accentBg,border:`1.5px solid ${c.accent}`,display:"inline-block",fontSize:13,fontWeight:700,color:c.accent}}>All puzzles complete!</div>}
        <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
          {perfect?<Icon.Crown size={64} color={c.gold}/>:hardMode?<Icon.Skull size={64} color={c.hardRed}/>:<Icon.Trophy size={64} color={c.accent}/>}
        </div>
        <div style={{fontSize:14,fontWeight:700,color:c.textMuted,marginBottom:8}}>{perfect?"Perfect Score!":hardMode?"Hard Mode Complete":"Puzzle Complete"}</div>
        {hardMode&&<div style={{marginBottom:8,display:"flex",justifyContent:"center"}}><HardBadge c={c}/></div>}
        <div style={{fontSize:64,fontWeight:900,color:c.text,lineHeight:1}}>{totalScore}</div>
        <div style={{fontSize:15,color:c.textMuted,marginTop:6}}>{correct} of {breakdown.length} correct</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:10,padding:"6px 14px",borderRadius:20,background:c.surface,border:`1.5px solid ${c.border}`}}>
          <Icon.XP size={16} color={c.accent}/>
          <span style={{fontSize:13,fontWeight:700,color:c.accent}}>+{xpGained} XP earned</span>
        </div>
      </div>

      {hasBoth&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div style={{padding:"12px",borderRadius:10,background:c.surface,border:`1.5px solid ${c.border}`,textAlign:"center"}}>
            <div style={{fontSize:11,fontWeight:700,color:c.textMuted,marginBottom:4}}>NORMAL</div>
            <div style={{fontSize:24,fontWeight:900,color:c.text}}>{modeScores.normal.score}</div>
            <div style={{fontSize:12,color:c.textMuted}}>pts</div>
          </div>
          <div style={{padding:"12px",borderRadius:10,background:c.hardBg,border:`1.5px solid ${c.hardRed}`,textAlign:"center"}}>
            <div style={{fontSize:11,fontWeight:700,color:c.hardRed,marginBottom:4}}>HARD</div>
            <div style={{fontSize:24,fontWeight:900,color:c.text}}>{modeScores.hard.score}</div>
            <div style={{fontSize:12,color:c.textMuted}}>pts</div>
          </div>
        </div>
      )}

      {newBadges.map(b=>(
        <div key={b.id} style={{background:`${b.color}18`,border:`1.5px solid ${b.color}`,borderRadius:12,padding:"12px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:10,background:`${b.color}28`,border:`1.5px solid ${b.color}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BadgeIcon badge={b} size={22}/></div>
          <div><div style={{fontSize:11,fontWeight:700,color:b.color,textTransform:"uppercase",letterSpacing:1}}>New Badge!</div><div style={{fontSize:14,fontWeight:700,color:c.text}}>{b.label}</div><div style={{fontSize:12,color:c.textMuted}}>{b.desc}</div></div>
        </div>
      ))}

      <Card c={c} style={{marginBottom:12,background:c.accentBg,border:`1.5px solid ${c.accent}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:matchingGroups.length>0?10:0}}>
          <Icon.Check size={22} color={c.accentText}/>
          <div style={{fontSize:15,fontWeight:700,color:c.accentText}}>Score posted to {matchingGroups.length} {hardMode?"hard":"normal"} group{matchingGroups.length!==1?"s":""}!</div>
        </div>
        {matchingGroups.length>0&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
          {matchingGroups.map(g=>{
            const allScores=[...g.members.filter(m=>m.done&&m.name!=="You").map(m=>m.score),totalScore].sort((a,b)=>b-a);
            const rank=allScores.indexOf(totalScore)+1;
            const sfx=rank===1?"st":rank===2?"nd":rank===3?"rd":"th";
            return(
              <div key={g.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,background:c.surface}}>
                <Icon.Groups size={16} color={c.accent}/>
                <span style={{flex:1,fontSize:14,color:c.text,fontWeight:500}}>{g.name}</span>
                <span style={{fontSize:13,fontWeight:700,color:rank===1?c.gold:c.textSub}}>{rank}{sfx} place</span>
                {g.hardMode&&<HardBadge c={c} small/>}
              </div>
            );
          })}
        </div>}
      </Card>

      <Card c={c} style={{marginBottom:20,padding:0,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",borderBottom:`1.5px solid ${c.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:14,fontWeight:700,color:c.text}}>Question Breakdown</div>
          <div style={{fontSize:12,color:c.textMuted}}>{correct}/{breakdown.length} correct</div>
        </div>
        {breakdown.map((b,i)=>{
          const q=questions[i];
          return(
            <div key={i} style={{padding:"14px 16px",borderTop:i>0?`1px solid ${c.border}`:"none",background:b.correct?c.correctBg:c.wrongBg}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{flexShrink:0,marginTop:2}}>{b.correct?<Icon.Check size={20} color={c.correct}/>:<Icon.Cross size={20} color={c.wrong}/>}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,color:c.textSub,lineHeight:1.4,marginBottom:4}}>{q?q.question:`Question ${i+1}`}</div>
                  {!b.correct&&q&&<div style={{fontSize:12,color:c.correct,fontWeight:600}}>✓ {q.answer}</div>}
                </div>
                <span style={{fontSize:15,fontWeight:700,color:b.correct?c.correct:c.wrong,flexShrink:0}}>{b.correct?`+${b.pts}`:"0"}</span>
              </div>
            </div>
          );
        })}
      </Card>

      {nextMode&&<Btn label="Play Hard Mode Now" icon={<Icon.Skull size={18} color="#fff"/>} onClick={onNextPuzzle} variant="danger" c={c} style={{marginBottom:10}}/>}
      <Btn label="See Group Reactions" icon={<Icon.Chat size={18} color="#fff"/>} onClick={onOpenChat} variant={nextMode?"secondary":"primary"} c={c} style={{marginBottom:10}}/>
      <Btn label="View Leaderboards" icon={<Icon.Trophy size={18} color={c.accent}/>} onClick={onViewLeaderboard} variant="secondary" c={c}/>
    </div>
  );
}

// ── LEADERBOARD ────────────────────────────────────────────────────────────
// ── MOCK GLOBAL LEADERBOARD DATA ──────────────────────────────────────────
// In production this would come from the backend. Names are public anon names.
const GLOBAL_DAILY=[
  {name:"swift-ember-falcon",score:980},{name:"pale-frost-jaguar",score:940},
  {name:"dark-tide-lynx",score:920},{name:"bright-ocean-hawk",score:895},
  {name:"iron-dawn-raven",score:870},{name:"golden-storm-bear",score:845},
  {name:"lost-river-cobra",score:820},{name:"mighty-shadow-elk",score:800},
  {name:"calm-winter-owl",score:775},{name:"fierce-amber-wolf",score:750},
];
const GLOBAL_WEEKLY=[
  {name:"pale-frost-jaguar",score:5820},{name:"swift-ember-falcon",score:5640},
  {name:"iron-dawn-raven",score:5200},{name:"golden-storm-bear",score:4980},
  {name:"dark-tide-lynx",score:4750},{name:"fierce-amber-wolf",score:4520},
  {name:"bright-ocean-hawk",score:4310},{name:"lost-river-cobra",score:4100},
  {name:"calm-winter-owl",score:3870},{name:"mighty-shadow-elk",score:3650},
];
const GLOBAL_ALLTIME=[
  {name:"iron-dawn-raven",score:142800},{name:"pale-frost-jaguar",score:138500},
  {name:"swift-ember-falcon",score:129600},{name:"golden-storm-bear",score:121400},
  {name:"fierce-amber-wolf",score:118700},{name:"dark-tide-lynx",score:112300},
  {name:"bright-ocean-hawk",score:105900},{name:"lost-river-cobra",score:98400},
  {name:"mighty-shadow-elk",score:91200},{name:"calm-winter-owl",score:84700},
];
// Simulated rank for the signed-in user when not in top 10
const USER_GLOBAL_RANK={daily:47,weekly:83,alltime:312};
const USER_GLOBAL_SCORE={daily:610,weekly:3240,alltime:42100};

function RankBadge({rank,size=26,c}){
  if(rank===0) return <Icon.Trophy size={size} color={c.gold}/>;
  if(rank===1) return <Icon.Trophy size={size} color={c.silver}/>;
  if(rank===2) return <Icon.Trophy size={size} color={c.bronze}/>;
  return <span style={{fontSize:13,fontWeight:700,color:c.textMuted}}>#{rank+1}</span>;
}

function GlobalRow({entry,rank,isYou,pts,ptsLabel,c}){
  return(
    <div style={{display:"flex",alignItems:"center",padding:"11px 14px",borderRadius:10,
      background:isYou?c.youBg:c.surface,
      border:`1.5px solid ${isYou?c.youBorder:c.border}`,
      marginBottom:7,gap:10}}>
      <div style={{width:32,display:"flex",justifyContent:"center",flexShrink:0}}>
        <RankBadge rank={rank} c={c}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:isYou?700:500,color:isYou?c.accent:c.text,
          fontFamily:"monospace",letterSpacing:0.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {entry.name}
        </div>
        {isYou&&<div style={{fontSize:10,color:c.accentText,fontWeight:600,marginTop:1}}>YOU</div>}
      </div>
      <div style={{textAlign:"right",flexShrink:0}}>
        <div style={{fontSize:16,fontWeight:800,color:rank===0?c.gold:isYou?c.accent:c.text}}>
          {pts.toLocaleString()}
        </div>
        <div style={{fontSize:10,color:c.textMuted}}>{ptsLabel}</div>
      </div>
    </div>
  );
}

function UserOutOfTop({rank,score,ptsLabel,publicName,c}){
  return(
    <>
      <div style={{textAlign:"center",padding:"4px 0 6px",color:c.textMuted,fontSize:18,lineHeight:1}}>· · ·</div>
      <div style={{display:"flex",alignItems:"center",padding:"11px 14px",borderRadius:10,
        background:c.youBg,border:`2px solid ${c.youBorder}`,marginBottom:4,gap:10}}>
        <div style={{width:32,display:"flex",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:13,fontWeight:700,color:c.accent}}>#{rank}</span>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:c.accent,fontFamily:"monospace",
            letterSpacing:0.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {publicName}
          </div>
          <div style={{fontSize:10,color:c.accentText,fontWeight:600,marginTop:1}}>YOU</div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontSize:16,fontWeight:800,color:c.accent}}>{score.toLocaleString()}</div>
          <div style={{fontSize:10,color:c.textMuted}}>{ptsLabel}</div>
        </div>
      </div>
    </>
  );
}

function LeaderboardScreen({groups,activeGroupId,onSwitchGroup,modeScores,hardMode,day,c,user}){
  const [section,setSection]=useState("global"); // "global" | "groups"
  const [tab,setTab]=useState("daily");

  const publicName=user?.publicName||"you";

  // Compute user's today score (any mode)
  const todayScore=modeScores.normal?.score||modeScores.hard?.score||0;
  // Check if user is in top 10 for each period
  const userInGlobalDaily=todayScore>=(GLOBAL_DAILY[9]?.score||0)&&todayScore>0;
  const userInGlobalWeekly=false; // user never in weekly top 10 in mock
  const userInGlobalAlltime=false;

  // Build global lists with user injected if they qualify
  function buildGlobalList(base,userScore,inTop){
    if(!inTop||userScore===0) return base.slice(0,10);
    const list=[...base,{name:publicName,score:userScore,isYou:true}]
      .sort((a,b)=>b.score-a.score).slice(0,10);
    return list;
  }
  const globalDaily=buildGlobalList(GLOBAL_DAILY,todayScore,userInGlobalDaily);
  const globalWeekly=buildGlobalList(GLOBAL_WEEKLY,0,false);
  const globalAlltime=buildGlobalList(GLOBAL_ALLTIME,0,false);

  const globalList=tab==="daily"?globalDaily:tab==="weekly"?globalWeekly:globalAlltime;
  const ptsLabel=tab==="alltime"?"pts total":tab==="weekly"?"this week":"today";

  // Group leaderboard
  const group=groups.find(g=>g.id===activeGroupId)||groups[0];
  const groupScore=modeScores[group.hardMode?"hard":"normal"]?.score??0;
  const daily=[...group.members].map(m=>m.name==="You"&&groupScore>0?{...m,score:groupScore,done:true}:m).filter(m=>m.done).sort((a,b)=>b.score-a.score);
  const weekly=group.weekly.map(m=>({...m,total:(m.name==="You"?[...m.scores.slice(0,-1),groupScore]:m.scores).filter(Boolean).reduce((a,b)=>a+b,0)})).sort((a,b)=>b.total-a.total);
  const allTime=group.weekly.map(m=>({name:m.name,total:m.scores.filter(Boolean).reduce((a,b)=>a+b,0)+(m.name==="You"&&groupScore>0?groupScore:0)})).sort((a,b)=>b.total-a.total);

  return(
    <div style={{minHeight:"calc(100vh - 64px)",background:c.bg,paddingBottom:24}}>

      {/* Header */}
      <div style={{padding:"18px 20px 14px",background:c.surface,borderBottom:`1px solid ${c.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <Icon.Trophy size={24} color={c.gold}/>
          <div style={{fontSize:22,fontWeight:800,color:c.text}}>Leaderboard</div>
        </div>
        {/* Global / Groups toggle */}
        <div style={{display:"flex",background:c.surface2,borderRadius:10,padding:3,gap:3}}>
          {[["global","🌍  Global"],["groups","👥  Groups"]].map(([key,label])=>(
            <button key={key} onClick={()=>setSection(key)} style={{flex:1,padding:"10px 0",borderRadius:8,border:"none",cursor:"pointer",
              background:section===key?c.accent:"transparent",
              color:section===key?"#fff":c.textMuted,
              fontSize:14,fontWeight:section===key?700:500,transition:"all 0.18s"}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Time-period tabs */}
      <div style={{display:"flex",margin:"12px 20px 0",background:c.surface2,borderRadius:10,padding:3,gap:3}}>
        {[["daily","Today"],["weekly","This Week"],["alltime","All-Time"]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{flex:1,padding:"10px 0",borderRadius:8,border:"none",cursor:"pointer",
            background:tab===key?c.surface:"transparent",
            color:tab===key?c.text:c.textMuted,
            fontSize:13,fontWeight:tab===key?700:500,
            boxShadow:tab===key?"0 1px 4px rgba(0,0,0,0.10)":"none",
            transition:"all 0.18s"}}>
            {label}
          </button>
        ))}
      </div>

      {/* ── GLOBAL SECTION ── */}
      {section==="global"&&(
        <div style={{padding:"14px 20px 0"}}>
          {/* Anon name callout */}
          <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",borderRadius:10,
            background:c.surface,border:`1.5px solid ${c.border}`,marginBottom:14}}>
            <Icon.Info size={15} color={c.accent} style={{flexShrink:0,marginTop:1}}/>
            <div style={{fontSize:12,color:c.textMuted,lineHeight:1.5}}>
              Global rankings use your anonymous name.{" "}
              <span style={{fontFamily:"monospace",color:c.accent,fontWeight:600}}>{publicName}</span>
              {" "}is how the world sees you.
            </div>
          </div>

          {/* Top 10 */}
          {globalList.map((entry,i)=>{
            const isYou=entry.isYou||(entry.name===publicName);
            const pts=tab==="daily"?entry.score:entry.score;
            return <GlobalRow key={i} entry={entry} rank={i} isYou={isYou} pts={pts} ptsLabel={ptsLabel} c={c}/>;
          })}

          {/* User row if outside top 10 */}
          {!globalList.some(e=>e.name===publicName||e.isYou)&&(
            <UserOutOfTop
              rank={USER_GLOBAL_RANK[tab]}
              score={tab==="daily"?USER_GLOBAL_SCORE.daily:tab==="weekly"?USER_GLOBAL_SCORE.weekly:USER_GLOBAL_SCORE.alltime}
              ptsLabel={ptsLabel}
              publicName={publicName}
              c={c}
            />
          )}

          {/* Reset cadence note */}
          <div style={{marginTop:12,textAlign:"center",fontSize:11,color:c.textMuted}}>
            {tab==="daily"&&"Resets at midnight · Scores update after you play"}
            {tab==="weekly"&&"Resets every Monday · Cumulative weekly scores"}
            {tab==="alltime"&&"Never resets · Total lifetime score"}
          </div>
        </div>
      )}

      {/* ── GROUPS SECTION ── */}
      {section==="groups"&&(
        <div style={{padding:"14px 20px 0"}}>
          {/* Group switcher */}
          <div style={{marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            <GroupSwitcher groups={groups} activeId={activeGroupId} onSwitch={onSwitchGroup} c={c}/>
            {group.hardMode&&<HardBadge c={c} small/>}
          </div>

          {tab==="daily"&&(
            <>
              {daily.length===0&&<div style={{textAlign:"center",padding:32,color:c.textMuted,fontSize:14}}>No scores yet today.</div>}
              {daily.map((m,i)=>{
                const isYou=m.name==="You";
                return(
                  <div key={i} style={{display:"flex",alignItems:"center",padding:"11px 14px",borderRadius:10,
                    background:isYou?c.youBg:c.surface,border:`1.5px solid ${isYou?c.youBorder:c.border}`,marginBottom:7,gap:10}}>
                    <div style={{width:32,display:"flex",justifyContent:"center",flexShrink:0}}><RankBadge rank={i} c={c}/></div>
                    <Avatar name={m.name} size={34}/>
                    <div style={{flex:1,fontSize:14,fontWeight:isYou?700:500,color:c.text}}>{isYou?"You ("+user?.handle+")":m.name}</div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:17,fontWeight:800,color:i===0?c.gold:isYou?c.accent:c.text}}>{m.score}</div>
                      <div style={{fontSize:10,color:c.textMuted}}>pts</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {tab==="weekly"&&(
            <>
              {weekly.map((m,i)=>{
                const isYou=m.name==="You";
                const ds=m.name==="You"?[...m.scores.slice(0,-1),groupScore]:m.scores;
                return(
                  <div key={i} style={{padding:"11px 14px",borderRadius:10,background:isYou?c.youBg:c.surface,
                    border:`1.5px solid ${isYou?c.youBorder:c.border}`,marginBottom:7}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <div style={{width:24,display:"flex",justifyContent:"center"}}><RankBadge rank={i} c={c}/></div>
                      <Avatar name={m.name} size={28}/>
                      <span style={{flex:1,fontSize:14,fontWeight:isYou?700:500,color:c.text}}>{isYou?"You ("+user?.handle+")":m.name}</span>
                      <span style={{fontSize:15,fontWeight:800,color:i===0?c.gold:isYou?c.accent:c.text}}>{m.total} pts</span>
                    </div>
                    <div style={{display:"flex",gap:3}}>
                      {ds.map((s,j)=>(
                        <div key={j} style={{flex:1,height:26,borderRadius:5,background:s?c.accentBg:c.surface2,
                          border:`1px solid ${s?c.accent:c.border}`,display:"flex",alignItems:"center",
                          justifyContent:"center",fontSize:10,fontWeight:700,color:s?c.accentText:c.textMuted}}>
                          {s||"–"}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {tab==="alltime"&&(
            <>
              {allTime.map((m,i)=>{
                const isYou=m.name==="You";
                return(
                  <div key={i} style={{display:"flex",alignItems:"center",padding:"11px 14px",borderRadius:10,
                    background:isYou?c.youBg:c.surface,border:`1.5px solid ${isYou?c.youBorder:c.border}`,marginBottom:7,gap:10}}>
                    <div style={{width:32,display:"flex",justifyContent:"center",flexShrink:0}}><RankBadge rank={i} c={c}/></div>
                    <Avatar name={m.name} size={34}/>
                    <div style={{flex:1,fontSize:14,fontWeight:isYou?700:500,color:c.text}}>{isYou?"You ("+user?.handle+")":m.name}</div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:17,fontWeight:800,color:i===0?c.gold:isYou?c.accent:c.text}}>{m.total.toLocaleString()}</div>
                      <div style={{fontSize:10,color:c.textMuted}}>pts total</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* All Groups summary strip */}
          <div style={{marginTop:16}}>
            <SectionLabel text="All My Groups" c={c}/>
            {groups.map(g=>{
              const gScore=modeScores[g.hardMode?"hard":"normal"]?.score??null;
              const gDaily=[...g.members].map(m=>m.name==="You"&&gScore!=null?{...m,score:gScore,done:true}:m).filter(m=>m.done).sort((a,b)=>b.score-a.score);
              const myRank=gDaily.findIndex(m=>m.name==="You")+1;
              return(
                <button key={g.id} onClick={()=>onSwitchGroup(g.id)} style={{width:"100%",display:"flex",alignItems:"center",
                  gap:12,padding:"11px 14px",borderRadius:10,
                  background:g.id===activeGroupId?c.accentBg:c.surface,
                  border:`1.5px solid ${g.id===activeGroupId?c.accent:c.border}`,
                  marginBottom:7,cursor:"pointer",textAlign:"left"}}>
                  <Icon.Groups size={20} color={g.id===activeGroupId?c.accent:c.textMuted}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:c.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</div>
                    <div style={{fontSize:11,color:c.textMuted}}>{gDaily.length}/{g.members.length} played</div>
                  </div>
                  {gScore!=null&&myRank>0&&(
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:14,fontWeight:800,color:myRank===1?c.gold:c.text}}>
                        {myRank===1?"1st":myRank===2?"2nd":myRank===3?"3rd":`#${myRank}`}
                      </div>
                      <div style={{fontSize:10,color:c.textMuted}}>place</div>
                    </div>
                  )}
                  {g.hardMode&&<HardBadge c={c} small/>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── BADGE ICON ─────────────────────────────────────────────────────────────
function BadgeIcon({badge,size=22}){
  const Ic=Icon[badge.iconName]||Icon.Star;
  return <Ic size={size} color={badge.color}/>;
}

// ── SCORE GRAPH ───────────────────────────────────────────────────────────
const MOCK_DAILY_SCORES=[
  {day:"Mon",normal:720,hard:0},{day:"Tue",normal:810,hard:940},
  {day:"Wed",normal:650,hard:0},{day:"Thu",normal:880,hard:860},
  {day:"Fri",normal:760,hard:0},{day:"Sat",normal:920,hard:980},
  {day:"Sun",normal:840,hard:0},
];
const MOCK_WEEKLY_SCORES=[
  {week:"W1",total:4820},{week:"W2",total:5310},{week:"W3",total:4990},
  {week:"W4",total:5640},{week:"W5",total:5200},{week:"W6",total:5880},
];

function ScoreGraph({c}){
  const [view,setView]=useState("daily");
  const data=view==="daily"?MOCK_DAILY_SCORES:MOCK_WEEKLY_SCORES;
  const maxVal=view==="daily"
    ?Math.max(...data.map(d=>Math.max(d.normal||0,d.hard||0)),1)
    :Math.max(...data.map(d=>d.total||0),1);
  const W=340,H=130,PAD={t:10,r:8,b:28,l:36};
  const chartW=W-PAD.l-PAD.r,chartH=H-PAD.t-PAD.b;
  const cols=data.length;
  const barW=view==="daily"?chartW/cols*0.35:chartW/cols*0.5;

  function barX(i,offset=0){return PAD.l+i*(chartW/cols)+(chartW/cols)*0.15+offset;}
  function barY(val){return PAD.t+chartH-(val/maxVal)*chartH;}
  function barH(val){return(val/maxVal)*chartH;}

  // Y-axis ticks
  const ticks=[0,0.5,1].map(f=>Math.round(maxVal*f));

  return(
    <div style={{background:c.surface,border:`1.5px solid ${c.border}`,borderRadius:14,padding:"14px 16px",marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:13,fontWeight:700,color:c.text}}>Score History</span>
        <div style={{display:"flex",background:c.surface2,borderRadius:8,padding:2,gap:2}}>
          {[["daily","Daily"],["weekly","Weekly"]].map(([k,l])=>(
            <button key={k} onClick={()=>setView(k)} style={{padding:"4px 12px",borderRadius:6,border:"none",cursor:"pointer",
              background:view===k?c.accent:"transparent",
              color:view===k?"#fff":c.textMuted,fontSize:12,fontWeight:view===k?700:500}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
        {/* Grid lines */}
        {ticks.map((t,i)=>{
          const y=PAD.t+chartH-(t/maxVal)*chartH;
          return(
            <g key={i}>
              <line x1={PAD.l} y1={y} x2={W-PAD.r} y2={y} stroke={c.border} strokeWidth="1" strokeDasharray="3,3"/>
              <text x={PAD.l-4} y={y+4} textAnchor="end" fontSize="8" fill={c.textMuted}>{t>=1000?`${(t/1000).toFixed(1)}k`:t}</text>
            </g>
          );
        })}

        {/* Bars */}
        {view==="daily"&&data.map((d,i)=>(
          <g key={i}>
            {d.normal>0&&(
              <rect x={barX(i)} y={barY(d.normal)} width={barW} height={barH(d.normal)}
                fill={c.accent} rx="3" opacity="0.9"/>
            )}
            {d.hard>0&&(
              <rect x={barX(i,barW+2)} y={barY(d.hard)} width={barW} height={barH(d.hard)}
                fill={c.hardRed} rx="3" opacity="0.85"/>
            )}
            <text x={barX(i)+(barW)} y={H-PAD.b+10} textAnchor="middle" fontSize="8" fill={c.textMuted}>{d.day}</text>
          </g>
        ))}

        {view==="weekly"&&data.map((d,i)=>(
          <g key={i}>
            <rect x={barX(i)} y={barY(d.total)} width={barW*2} height={barH(d.total)}
              fill={c.accent} rx="3" opacity="0.9"/>
            <text x={barX(i)+barW} y={H-PAD.b+10} textAnchor="middle" fontSize="8" fill={c.textMuted}>{d.week}</text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      {view==="daily"&&(
        <div style={{display:"flex",gap:16,marginTop:4,justifyContent:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:10,height:10,borderRadius:2,background:c.accent}}/>
            <span style={{fontSize:11,color:c.textMuted}}>Normal</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:10,height:10,borderRadius:2,background:c.hardRed}}/>
            <span style={{fontSize:11,color:c.textMuted}}>Hard</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PROFILE SCREEN ────────────────────────────────────────────────────────
function ProfileScreen({profile,groups,onBack,c,user,onUpdateUser}){
  const level=xpLevel(profile.totalXP);
  const prog=xpPct(profile.totalXP);
  const nextXP=xpNextThreshold(profile.totalXP);
  const earnedBadges=BADGE_DEFS.filter(b=>profile.badges.includes(b.id));
  const lockedBadges=BADGE_DEFS.filter(b=>!profile.badges.includes(b.id));

  const [editingName,setEditingName]=useState(false);
  const [nameInput,setNameInput]=useState(user?.handle||"");
  const [nameError,setNameError]=useState("");

  function saveHandle(){
    const v=nameInput.trim();
    if(v.length<2){setNameError("At least 2 characters.");return;}
    if(v.length>24){setNameError("Max 24 characters.");return;}
    if(!/^[a-zA-Z0-9_\-. ]+$/.test(v)){setNameError("Letters, numbers, _ - . only.");return;}
    onUpdateUser({...user,handle:v});
    setEditingName(false);setNameError("");
  }

  return(
    <div style={{minHeight:"100vh",background:c.bg}}>
      {/* Header */}
      <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:`1.5px solid ${c.border}`,background:c.surface}}>
        <button onClick={onBack} style={{width:40,height:40,borderRadius:"50%",border:`1.5px solid ${c.border}`,background:c.surface2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <Icon.Back size={20} color={c.text}/>
        </button>
        <div style={{fontSize:18,fontWeight:700,color:c.text}}>My Profile</div>
      </div>

      <div style={{padding:"20px 20px 48px"}}>

        {/* ── Hero card ── */}
        <div style={{background:c.surface,border:`1.5px solid ${c.border}`,borderRadius:16,padding:"18px",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <div style={{position:"relative",flexShrink:0}}>
              <Avatar name="You" size={60}/>
              <div style={{position:"absolute",bottom:-4,right:-4,background:c.gold,borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${c.surface}`}}>
                <span style={{fontSize:9,fontWeight:900,color:"#fff"}}>{level}</span>
              </div>
            </div>
            <div style={{flex:1,minWidth:0}}>
              {/* Editable name */}
              {editingName?(
                <div>
                  <input
                    value={nameInput}
                    onChange={e=>{setNameInput(e.target.value);setNameError("");}}
                    onKeyDown={e=>{if(e.key==="Enter")saveHandle();if(e.key==="Escape"){setEditingName(false);setNameError("");}}}
                    maxLength={24}
                    autoFocus
                    style={{width:"100%",padding:"6px 10px",borderRadius:8,border:`1.5px solid ${nameError?c.wrong:c.accent}`,background:c.surface2,color:c.text,fontSize:16,fontWeight:700,outline:"none"}}
                  />
                  {nameError&&<div style={{fontSize:11,color:c.wrong,marginTop:3}}>{nameError}</div>}
                  <div style={{display:"flex",gap:6,marginTop:6}}>
                    <button onClick={saveHandle} style={{padding:"5px 14px",borderRadius:7,background:c.accent,border:"none",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>Save</button>
                    <button onClick={()=>{setEditingName(false);setNameError("");setNameInput(user?.handle||"");}} style={{padding:"5px 12px",borderRadius:7,background:c.surface2,border:`1px solid ${c.border}`,color:c.textMuted,fontSize:12,cursor:"pointer"}}>Cancel</button>
                  </div>
                </div>
              ):(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{fontSize:19,fontWeight:800,color:c.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.handle||"You"}</div>
                    <button onClick={()=>{setEditingName(true);setNameInput(user?.handle||"");}} style={{background:"none",border:"none",cursor:"pointer",padding:2,flexShrink:0}}>
                      <Icon.Edit size={15} color={c.textMuted}/>
                    </button>
                  </div>
                  <div style={{fontSize:12,color:c.textMuted}}>Level {level} · Trivia Player</div>
                </div>
              )}
              {!editingName&&(
                <div style={{display:"flex",alignItems:"center",gap:4,marginTop:5}}>
                  <Icon.Flame size={15} color={c.streakOrange}/>
                  <span style={{fontSize:13,fontWeight:700,color:c.streakOrange}}>{profile.streak} day streak</span>
                </div>
              )}
            </div>
          </div>

          {/* Anonymous name */}
          <div style={{background:c.surface2,borderRadius:10,padding:"9px 12px",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
            <Icon.Person size={14} color={c.textMuted}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:10,fontWeight:700,color:c.textMuted,textTransform:"uppercase",letterSpacing:1}}>Global leaderboard name</div>
              <div style={{fontSize:13,fontFamily:"monospace",color:c.accent,fontWeight:600,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.publicName||"—"}</div>
            </div>
            <div style={{fontSize:10,color:c.textMuted,flexShrink:0}}>read-only</div>
          </div>

          {/* XP bar */}
          <div style={{marginBottom:4,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:11,fontWeight:600,color:c.textMuted}}>XP Progress</span>
            <span style={{fontSize:11,color:c.textMuted}}>{profile.totalXP.toLocaleString()} / {nextXP?.toLocaleString()||"MAX"} XP</span>
          </div>
          <div style={{height:9,background:c.surface2,borderRadius:5,overflow:"hidden",border:`1px solid ${c.border}`}}>
            <div style={{height:"100%",width:`${Math.min(prog*100,100)}%`,background:c.accent,borderRadius:5}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
            <span style={{fontSize:10,color:c.textMuted}}>Lv.{level}</span>
            {nextXP&&<span style={{fontSize:10,color:c.textMuted}}>{(nextXP-profile.totalXP).toLocaleString()} XP to Lv.{level+1}</span>}
          </div>
        </div>

        {/* ── Stat tiles ── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
          {[
            {label:"Groups",val:groups.length,ico:"Groups"},
            {label:"Puzzles",val:profile.history.length+14,ico:"Trophy"},
            {label:"Badges",val:earnedBadges.length,ico:"Badge"},
          ].map(s=>{
            const SIco=Icon[s.ico]||Icon.Star;
            return(
              <div key={s.label} style={{background:c.surface,border:`1.5px solid ${c.border}`,borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:4}}><SIco size={18} color={c.accent}/></div>
                <div style={{fontSize:20,fontWeight:800,color:c.text}}>{s.val}</div>
                <div style={{fontSize:11,color:c.textMuted}}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* ── Score graph ── */}
        <ScoreGraph c={c}/>

        {/* ── Badges earned ── */}
        <SectionLabel text={`Badges (${earnedBadges.length})`} c={c}/>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {earnedBadges.map(b=>(
            <div key={b.id} style={{background:c.surface,border:`1.5px solid ${c.border}`,borderRadius:12,padding:"11px 14px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:10,background:`${b.color}22`,border:`1.5px solid ${b.color}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BadgeIcon badge={b} size={20}/></div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:c.text}}>{b.label}</div><div style={{fontSize:12,color:c.textMuted}}>{b.desc}</div></div>
              <Icon.Check size={16} color={b.color}/>
            </div>
          ))}
        </div>

        {/* ── Locked badges ── */}
        {lockedBadges.length>0&&<SectionLabel text={`Locked (${lockedBadges.length})`} c={c}/>}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
          {lockedBadges.map(b=>(
            <div key={b.id} style={{background:c.surface2,border:`1.5px solid ${c.border}`,borderRadius:12,padding:"11px 14px",display:"flex",alignItems:"center",gap:12,opacity:0.55}}>
              <div style={{width:40,height:40,borderRadius:10,background:c.surface,border:`1.5px solid ${c.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon.Lock size={18} color={c.textMuted}/></div>
              <div><div style={{fontSize:14,fontWeight:600,color:c.textMuted}}>{b.label}</div><div style={{fontSize:12,color:c.textMuted}}>{b.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── NAV BAR ────────────────────────────────────────────────────────────────
function NavBar({active,onNav,unread,c}){
  const tabs=[{id:"home",label:"Home",Ico:Icon.Home},{id:"chat",label:"Chat",Ico:Icon.Chat,badge:unread},{id:"leaderboard",label:"Ranks",Ico:Icon.Trophy},{id:"profile",label:"Profile",Ico:Icon.Person}];
  return(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:c.navBg,borderTop:`1.5px solid ${c.navBorder}`,display:"flex",zIndex:300}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onNav(t.id)} aria-label={t.label} style={{flex:1,padding:"12px 0 10px",border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:"relative",minHeight:64}}>
          {active===t.id&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:32,height:3,borderRadius:"0 0 4px 4px",background:c.accent}}/>}
          <t.Ico size={24} color={active===t.id?c.accent:c.textMuted}/>
          <span style={{fontSize:11,fontWeight:active===t.id?700:500,color:active===t.id?c.accent:c.textMuted}}>{t.label}</span>
          {t.badge>0&&<div style={{position:"absolute",top:8,right:"calc(50% - 22px)",width:18,height:18,borderRadius:"50%",background:c.accent,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{t.badge}</div>}
        </button>
      ))}
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────
// ── ONBOARDING SCREEN ─────────────────────────────────────────────────────
function OnboardingScreen({onComplete}){
  const [step,setStep]=useState("welcome");
  const [handle,setHandle]=useState("");
  const [error,setError]=useState("");
  const [publicName]=useState(generatePublicName);
  const [revealed,setRevealed]=useState(false);
  const BG={background:"linear-gradient(160deg,#0d1b2a 0%,#1a3040 60%,#0d2535 100%)",minHeight:"100vh"};

  const [loading,setLoading]=useState(false);
  async function handleContinue(){
    const trimmed=handle.trim();
    if(!trimmed){setError("Please enter a name.");return;}
    if(trimmed.length<2){setError("Must be at least 2 characters.");return;}
    if(trimmed.length>24){setError("Max 24 characters.");return;}
    if(!/^[a-zA-Z0-9_\-. ]+$/.test(trimmed)){setError("Letters, numbers, spaces, _ - . only.");return;}
    setError("");
    if(!revealed){setRevealed(true);return;}
    setLoading(true);
    try{
      const data=await api.signup(null,null,trimmed);
      onComplete({id:data.user.id,handle:data.user.handle||trimmed,publicName:data.user.public_name||publicName});
    }catch(e){
      console.warn("Signup API failed, using local-only mode:",e.message);
      onComplete({handle:trimmed,publicName});
    }finally{setLoading(false);}
  }

  if(step==="welcome"){
    return(
      <div style={{...BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 28px"}}>
        <div style={{marginBottom:28}}><AppLogo size={130}/></div>
        <div style={{fontSize:32,fontWeight:900,color:"#EEEEEE",letterSpacing:-0.5,marginBottom:8,textAlign:"center"}}>Trivia Daily</div>
        <div style={{fontSize:15,color:"#9CA3AF",textAlign:"center",marginBottom:48,lineHeight:1.6,maxWidth:280}}>Daily puzzles. Group bragging rights. One question at a time.</div>
        <button onClick={()=>setStep("name")} style={{width:"100%",maxWidth:320,padding:"16px 0",borderRadius:12,background:"#00ADB5",border:"none",color:"#fff",fontSize:17,fontWeight:700,cursor:"pointer",letterSpacing:0.2,boxShadow:"0 4px 20px rgba(0,173,181,0.4)"}}>Get Started</button>
        <div style={{marginTop:16,fontSize:13,color:"#6B7280",textAlign:"center"}}>No email. No phone. Just a name.</div>
      </div>
    );
  }

  return(
    <div style={{...BG,display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 24px 40px"}}>
      <div style={{marginBottom:24}}><AppLogo size={80}/></div>
      <div style={{fontSize:24,fontWeight:900,color:"#EEEEEE",marginBottom:6}}>What should we call you?</div>
      <div style={{fontSize:14,color:"#9CA3AF",marginBottom:32,textAlign:"center",lineHeight:1.5,maxWidth:300}}>This is the name your group members will see. Choose something they'll recognise.</div>
      <div style={{width:"100%",maxWidth:360,marginBottom:8}}>
        <input
          value={handle}
          onChange={e=>{setHandle(e.target.value);setError("");setRevealed(false);}}
          onKeyDown={e=>e.key==="Enter"&&handleContinue()}
          placeholder="e.g. Jordan, Coach K, The Riddler…"
          maxLength={24}
          autoFocus
          style={{width:"100%",padding:"15px 18px",borderRadius:12,border:"2px solid "+(error?"#EF4444":"#2D4A5A"),background:"#0d2535",color:"#EEEEEE",fontSize:16,outline:"none",boxSizing:"border-box",caretColor:"#00ADB5"}}
        />
        {error&&<div style={{color:"#EF4444",fontSize:13,marginTop:6,paddingLeft:4}}>{error}</div>}
        <div style={{fontSize:12,color:"#4A6070",marginTop:6,paddingLeft:4,textAlign:"right"}}>{handle.trim().length}/24</div>
      </div>
      {revealed&&(
        <div style={{width:"100%",maxWidth:360,background:"#0d2535",border:"1.5px solid #2D4A5A",borderRadius:12,padding:"16px 18px",marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:"#00ADB5",textTransform:"uppercase",letterSpacing:1.5,marginBottom:8}}>Your anonymous leaderboard name</div>
          <div style={{fontSize:20,fontWeight:800,color:"#EEEEEE",fontFamily:"monospace",letterSpacing:1,marginBottom:8}}>{publicName}</div>
          <div style={{fontSize:12,color:"#6B7280",lineHeight:1.5}}>This appears on global leaderboards — your real handle stays private to your groups only.</div>
        </div>
      )}
      <button
        onClick={handleContinue}
        style={{width:"100%",maxWidth:360,padding:"15px 0",borderRadius:12,background:handle.trim().length>=2?"#00ADB5":"#1a3a45",border:"none",color:handle.trim().length>=2?"#fff":"#4A6070",fontSize:16,fontWeight:700,cursor:handle.trim().length>=2?"pointer":"default",transition:"all 0.2s",marginBottom:16}}
      >
        {revealed?"Let's Play \u2192":"Continue"}
      </button>
      {!revealed&&<div style={{fontSize:13,color:"#6B7280",textAlign:"center",maxWidth:300,lineHeight:1.5}}>We'll show you your anonymous leaderboard name on the next step.</div>}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state={hasError:false,error:null,info:null}; }
  componentDidCatch(error,info){
    console.error("=== TRIVIA ERROR BOUNDARY ===");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Component stack:", info.componentStack);
    this.setState({hasError:true,error,info});
  }
  render(){
    if(this.state.hasError){
      return(
        <div style={{padding:20,fontFamily:"monospace",background:"#1a0000",color:"#ff6b6b",minHeight:"100vh"}}>
          <div style={{fontSize:16,fontWeight:700,marginBottom:12}}>💥 Runtime Error (check console for full stack)</div>
          <div style={{fontSize:13,marginBottom:8,color:"#ffaaaa"}}>{this.state.error&&this.state.error.message}</div>
          <pre style={{fontSize:11,whiteSpace:"pre-wrap",color:"#ff9999",background:"#2a0000",padding:12,borderRadius:8,marginBottom:12}}>{this.state.error&&this.state.error.stack}</pre>
          <div style={{fontSize:12,color:"#ffcccc",fontWeight:600,marginBottom:4}}>Component Stack:</div>
          <pre style={{fontSize:11,whiteSpace:"pre-wrap",color:"#ffbbbb",background:"#2a0000",padding:12,borderRadius:8}}>{this.state.info&&this.state.info.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

window.TriviaApp = function App(){
  const [user,setUser]=useState(null);
  const [screen,setScreen]=useState("home");
  const [settingsGroupId,setSettingsGroupId]=useState(null);
  const [unread,setUnread]=useState(3);
  const [isDark,setIsDark]=useState(false);
  const [groups,setGroups]=useState(INIT_GROUPS);
  const [activeGroupId,setActiveGroupId]=useState("g1");
  const [day,setDay]=useState(()=>{const d=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];return d[new Date().getDay()];});
  const [profile,setProfile]=useState(INIT_PROFILE);
  const [prevBadges,setPrevBadges]=useState(INIT_PROFILE.badges);

  // Puzzle queue: [{hardMode:bool}] — one entry per distinct mode the user must play
  const [puzzleQueue,setPuzzleQueue]=useState([]);
  // Scores keyed by mode: {normal: {score,breakdown}, hard: {score,breakdown}}
  const [modeScores,setModeScores]=useState({});
  // Which mode is currently being played
  const [currentMode,setCurrentMode]=useState(null);

  const c=isDark?DARK:LIGHT;
  const showNav=["home","chat","leaderboard","profile"].includes(screen);
  const activeGroup=groups.find(g=>g.id===activeGroupId)||groups[0];

  // Derive whether user has fully played (all required modes done)
  const hasHardGroups=groups.some(g=>g.hardMode);
  const hasNormalGroups=groups.some(g=>!g.hardMode);
  const needsNormal=hasNormalGroups;
  const needsHard=hasHardGroups; // affects score posting & fullyPlayed only
  // Hard button always visible — anyone can play hard even without hard groups
  const hardAvailable=true;
  const doneNormal=!!modeScores.normal;
  const doneHard=!!modeScores.hard;
  const fullyPlayed=(needsNormal?doneNormal:true)&&(needsHard?doneHard:true);

  // For HomeScreen: show combined score summary or pending status
  const userScore=fullyPlayed?(doneNormal&&doneHard?modeScores.normal.score+modeScores.hard.score:doneNormal?modeScores.normal.score:modeScores.hard.score):null;

  function updateGroup(id,fn){setGroups(gs=>gs.map(g=>g.id===id?fn(g):g));}

  function handleDayChange(newDay){
    setDay(newDay);setModeScores({});setPuzzleQueue([]);setCurrentMode(null);setGroups(INIT_GROUPS);
  }

  function startPuzzles(forceHard=null){
    // If forceHard is explicitly passed, play just that mode
    if(forceHard!==null){
      setCurrentMode(forceHard);
      setPuzzleQueue([]);
      setScreen("puzzle");
      return;
    }
    // Otherwise build queue of all remaining modes needed, normal first
    const queue=[];
    if(needsNormal&&!doneNormal) queue.push({hardMode:false});
    if(needsHard&&!doneHard) queue.push({hardMode:true});
    if(queue.length===0) return;
    setPuzzleQueue(queue.slice(1));
    setCurrentMode(queue[0].hardMode);
    setScreen("puzzle");
  }

  function handlePuzzleComplete(score,bd,puzzleId,answers){
    const hard=currentMode;
    const correct=bd.filter(b=>b.correct).length;
    const xpGained=XP_PER_PUZZLE+(correct*XP_PER_CORRECT);
    const newModeScores={...modeScores,[hard?"hard":"normal"]:{score,breakdown:bd}};
    setModeScores(newModeScores);

    // Submit to API for server-side scoring
    if(user&&user.id&&puzzleId&&answers){
      api.submitPuzzle(user.id,puzzleId,answers,null,hard?"hard":"normal")
        .then(data=>console.log("Score submitted to API:",data.score))
        .catch(e=>console.warn("API submit failed (local score kept):",e.message));
    }

    // Post score only to groups matching this mode
    setGroups(gs=>gs.map(g=>{
      if(g.hardMode!==hard) return g;
      return {
        ...g,
        members:g.members.map(m=>m.name==="You"?{...m,score,done:true}:m),
        weekly:g.weekly.map(m=>m.name==="You"?{...m,scores:[...m.scores.slice(0,-1),score]}:m),
      };
    }));

    setProfile(p=>{
      setPrevBadges(p.badges);
      const newStreak=p.streak+1;
      const newXP=p.totalXP+xpGained;
      const nb=[...p.badges];
      if(!nb.includes("first_play")) nb.push("first_play");
      if(hard&&!nb.includes("hard_finisher")) nb.push("hard_finisher");
      if(newStreak>=7&&!nb.includes("streak_7")) nb.push("streak_7");
      if(newStreak>=30&&!nb.includes("streak_30")) nb.push("streak_30");
      if(groups.length>=3&&!nb.includes("social")) nb.push("social");
      const np={...p.themePerfects};
      if(correct===bd.length){np[day]=(np[day]||0)+1;if(np[day]>=5&&!nb.includes("theme_master"))nb.push("theme_master");}
      return{...p,streak:newStreak,totalXP:newXP,badges:nb,themePerfects:np,history:[...p.history,{day,score,correct,total:bd.length,hard}]};
    });

    // If more puzzles queued, go to a between-round results screen then next puzzle
    if(puzzleQueue.length>0){
      const next=puzzleQueue[0];
      setPuzzleQueue(q=>q.slice(1));
      setCurrentMode(next.hardMode);
      setScreen("results"); // show partial results with "next puzzle" CTA
    } else {
      setCurrentMode(null);
      setScreen("results");
    }
  }

  function nav(s){if(s==="chat") setUnread(0); setScreen(s);}

  return(
    <ErrorBoundary>
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${c.bg};font-family:'Roboto',sans-serif;-webkit-font-smoothing:antialiased;}
        input,button,textarea{font-family:'Roboto',sans-serif;}
        input::placeholder{color:${c.textMuted};}
        ::-webkit-scrollbar{width:0;height:0;}
        button{-webkit-tap-highlight-color:transparent;}
        @keyframes popIn{0%{transform:scale(0.7);opacity:0}70%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
      `}</style>
      {!user&&(
        <OnboardingScreen c={c} onComplete={u=>{setUser(u);setScreen("home");}}/>
      )}
      {user&&<div style={{maxWidth:430,margin:"0 auto",paddingBottom:showNav?64:0,minHeight:"100vh",background:c.bg}}>
        {screen==="home"        &&<ErrorBoundary><HomeScreen groups={groups} activeGroupId={activeGroupId} onSwitchGroup={setActiveGroupId} onStartNormal={()=>startPuzzles(false)} onStartHard={()=>startPuzzles(true)} alreadyPlayed={fullyPlayed} modeScores={modeScores} needsHard={needsHard} needsNormal={needsNormal} hasHardGroups={hasHardGroups} userScore={userScore} onOpenChat={()=>nav("chat")} totalUnread={unread} onOpenSettings={()=>{setSettingsGroupId(activeGroupId);setScreen("settings");}} c={c} onToggleDark={()=>setIsDark(d=>!d)} isDark={isDark} onOpenGroups={()=>setScreen("groups")} day={day} onSelectDay={handleDayChange} streak={profile.streak}/></ErrorBoundary>}
        {screen==="puzzle"      &&<ErrorBoundary><PuzzleScreen onComplete={handlePuzzleComplete} hardMode={currentMode} day={day} c={c} user={user}/></ErrorBoundary>}
        {screen==="results"     &&<ErrorBoundary><ResultsScreen modeScores={modeScores} currentMode={currentMode} nextMode={puzzleQueue.length>0?puzzleQueue[0].hardMode:null} onNextPuzzle={()=>setScreen("puzzle")} onViewLeaderboard={()=>nav("leaderboard")} onOpenChat={()=>nav("chat")} groups={groups} day={day} c={c} profile={profile} prevBadges={prevBadges}/></ErrorBoundary>}
        {screen==="chat"        &&<ErrorBoundary><ChatScreen group={activeGroup} onUpdateGroup={updateGroup} hardMode={activeGroup.hardMode} userScore={modeScores[activeGroup.hardMode?"hard":"normal"]?.score??null} userPlayed={!!(modeScores[activeGroup.hardMode?"hard":"normal"])} day={day} c={c} groups={groups} onSwitchGroup={setActiveGroupId}/></ErrorBoundary>}
        {screen==="leaderboard" &&<ErrorBoundary><LeaderboardScreen groups={groups} activeGroupId={activeGroupId} onSwitchGroup={setActiveGroupId} modeScores={modeScores} hardMode={activeGroup.hardMode} day={day} c={c} user={user}/></ErrorBoundary>}
        {screen==="groups"      &&<ErrorBoundary><GroupsScreen groups={groups} onBack={()=>setScreen("home")} onAddGroup={g=>setGroups(gs=>[...gs,g])} onLeaveGroup={id=>setGroups(gs=>gs.filter(g=>g.id!==id))} onOpenSettings={id=>{setSettingsGroupId(id);setScreen("settings");}} onSwitchGroup={id=>{setActiveGroupId(id);setScreen("chat");}} c={c}/></ErrorBoundary>}
        {screen==="settings"    &&<ErrorBoundary><GroupSettingsScreen group={groups.find(g=>g.id===settingsGroupId)||groups[0]} onBack={()=>setScreen("home")} onToggleHard={v=>updateGroup(settingsGroupId,g=>({...g,hardMode:v}))} c={c}/></ErrorBoundary>}
        {screen==="profile"     &&<ErrorBoundary><ProfileScreen profile={profile} groups={groups} onBack={()=>nav("home")} c={c} user={user} onUpdateUser={setUser}/></ErrorBoundary>}
        {showNav&&<NavBar active={screen} onNav={nav} unread={unread} c={c}/>}
      </div>}
    </>
    </ErrorBoundary>
  );
}
