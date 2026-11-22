// Mobile navigation: opens, closes after choosing a page, and supports Escape.
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
if (menuToggle && mainNav) {
  const setMenu = (open) => {
    mainNav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Tutup navigasi" : "Buka navigasi");
  };
  menuToggle.addEventListener("click", () => setMenu(!mainNav.classList.contains("open")));
  mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });
  document.addEventListener("click", (event) => {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
  });
}

// Kuis demo frontend: jawaban dan skor hanya tersimpan selama halaman terbuka.
const questions = [
  { kana: "あ", answer: "a", choices: ["A. A", "B. I", "C. U", "D. E"] },
  { kana: "い", answer: "i", choices: ["A. O", "B. I", "C. E", "D. A"] },
  { kana: "う", answer: "u", choices: ["A. U", "B. A", "C. O", "D. I"] },
  { kana: "え", answer: "e", choices: ["A. I", "B. U", "C. E", "D. O"] },
  { kana: "お", answer: "o", choices: ["A. E", "B. A", "C. O", "D. U"] }
];
let currentQuestion = 0;
let score = 0;
let answered = false;
const kanaEl = document.getElementById("quizKana");
if (kanaEl) {
  const answerGrid = document.getElementById("answerGrid");
  const feedback = document.getElementById("quizFeedback");
  const nextButton = document.getElementById("nextQuestion");
  const countEl = document.getElementById("questionCount");
  const progressEl = document.getElementById("quizProgress");
  const scoreEl = document.getElementById("scoreText");

  function renderQuestion() {
    const q = questions[currentQuestion];
    kanaEl.textContent = q.kana;
    countEl.textContent = `${String(currentQuestion + 1).padStart(2, "0")} / ${questions.length}`;
    progressEl.style.width = `${(currentQuestion / questions.length) * 100}%`;
    feedback.textContent = "Pilih satu jawaban untuk melanjutkan.";
    feedback.className = "quiz-feedback";
    nextButton.disabled = true;
    nextButton.textContent = currentQuestion === questions.length - 1 ? "Lihat hasil →" : "Berikutnya →";
    answered = false;
    [...answerGrid.children].forEach((button, index) => {
      button.textContent = q.choices[index];
      button.disabled = false;
      button.className = "answer-option";
      button.dataset.answer = q.choices[index].slice(3).toLowerCase();
    });
  }

  answerGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-answer]");
    if (!button || answered) return;
    answered = true;
    const correct = button.dataset.answer === questions[currentQuestion].answer;
    if (correct) score++;
    button.classList.add(correct ? "correct" : "incorrect");
    [...answerGrid.children].forEach((item) => {
      item.disabled = true;
      if (item.dataset.answer === questions[currentQuestion].answer) item.classList.add("correct");
    });
    feedback.textContent = correct ? "Benar! よくできました (yoku dekimashita) — bagus!" : `Belum tepat. Jawaban yang benar: ${questions[currentQuestion].answer.toUpperCase()}.`;
    feedback.className = `quiz-feedback ${correct ? "is-correct" : "is-wrong"}`;
    scoreEl.textContent = `Skor: ${score}`;
    nextButton.disabled = false;
    progressEl.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  });

  nextButton.addEventListener("click", () => {
    if (!answered) return;
    currentQuestion++;
    if (currentQuestion >= questions.length) {
      document.getElementById("quizBox").innerHTML = `
        <div class="result-screen"><div class="result-symbol">達</div>
        <div class="eyebrow">LATIHAN SELESAI</div><h2>よくできました！</h2>
        <p>Kamu menyelesaikan latihan pengenalan Hiragana.</p>
        <div class="result-score">${score}<small> / ${questions.length} benar</small></div>
        <button class="btn btn-primary" id="restartQuiz">Ulangi latihan ↻</button></div>`;
      document.getElementById("restartQuiz").addEventListener("click", () => window.location.reload());
    } else {
      renderQuestion();
    }
  });
  renderQuestion();
}


// Kana Learning Lab: 46 karakter dasar untuk Hiragana dan Katakana.
const kanaSets = {
  hiragana: [
    ["あ","a"],["い","i"],["う","u"],["え","e"],["お","o"],
    ["か","ka"],["き","ki"],["く","ku"],["け","ke"],["こ","ko"],
    ["さ","sa"],["し","shi"],["す","su"],["せ","se"],["そ","so"],
    ["た","ta"],["ち","chi"],["つ","tsu"],["て","te"],["と","to"],
    ["な","na"],["に","ni"],["ぬ","nu"],["ね","ne"],["の","no"],
    ["は","ha"],["ひ","hi"],["ふ","fu"],["へ","he"],["ほ","ho"],
    ["ま","ma"],["み","mi"],["む","mu"],["め","me"],["も","mo"],
    ["や","ya"],["ゆ","yu"],["よ","yo"],
    ["ら","ra"],["り","ri"],["る","ru"],["れ","re"],["ろ","ro"],
    ["わ","wa"],["を","wo"],["ん","n"]
  ],
  katakana: [
    ["ア","a"],["イ","i"],["ウ","u"],["エ","e"],["オ","o"],
    ["カ","ka"],["キ","ki"],["ク","ku"],["ケ","ke"],["コ","ko"],
    ["サ","sa"],["シ","shi"],["ス","su"],["セ","se"],["ソ","so"],
    ["タ","ta"],["チ","chi"],["ツ","tsu"],["テ","te"],["ト","to"],
    ["ナ","na"],["ニ","ni"],["ヌ","nu"],["ネ","ne"],["ノ","no"],
    ["ハ","ha"],["ヒ","hi"],["フ","fu"],["ヘ","he"],["ホ","ho"],
    ["マ","ma"],["ミ","mi"],["ム","mu"],["メ","me"],["モ","mo"],
    ["ヤ","ya"],["ユ","yu"],["ヨ","yo"],
    ["ラ","ra"],["リ","ri"],["ル","ru"],["レ","re"],["ロ","ro"],
    ["ワ","wa"],["ヲ","wo"],["ン","n"]
  ]
};
const kanaRows = ["あいうえお","かきくけこ","さしすせそ","たちつてと","なにぬねの","はひふへほ","まみむめも","や ゆ よ","らりるれろ","わ を ん"];
let activeKanaScript = "hiragana";
let selectedKana = ["あ","a"];

function speakKana(character) {
  if (!("speechSynthesis" in window)) {
    window.alert("Text-to-speech belum didukung browser ini.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(character);
  utterance.lang = "ja-JP";
  utterance.rate = 0.78;
  window.speechSynthesis.speak(utterance);
}

const kanaChart = document.getElementById("kanaChart");
if (kanaChart) {
  const tabs = [...document.querySelectorAll(".kana-tab")];
  const search = document.getElementById("kanaSearch");
  const detailCharacter = document.getElementById("detailCharacter");
  const detailRomaji = document.getElementById("detailRomaji");
  const detailHint = document.getElementById("detailHint");
  const descriptions = {
    hiragana: ["HIRAGANA • ひらがな","Huruf dasar Hiragana","Hiragana digunakan untuk menulis kata asli Jepang, akhiran kata, dan unsur tata bahasa."],
    katakana: ["KATAKANA • カタカナ","Huruf dasar Katakana","Katakana sering digunakan untuk kata serapan, nama asing, dan penekanan."]
  };

  function selectKana(item) {
    selectedKana = item;
    detailCharacter.textContent = item[0];
    detailRomaji.textContent = item[1];
    detailHint.textContent = `Karakter ${item[0]} dibaca “${item[1]}”. Dengarkan pelafalannya untuk membantu mengingat bunyi.`;
    document.querySelectorAll(".kana-cell").forEach((cell) => {
      cell.classList.toggle("selected", cell.dataset.character === item[0]);
    });
  }

  function renderKana() {
    const query = (search.value || "").trim().toLowerCase();
    const all = kanaSets[activeKanaScript];
    const filtered = all.filter(([character, romaji]) => character.includes(query) || romaji.includes(query));
    document.getElementById("scriptLabel").textContent = descriptions[activeKanaScript][0];
    document.getElementById("scriptTitle").textContent = descriptions[activeKanaScript][1];
    document.getElementById("scriptDescription").textContent = descriptions[activeKanaScript][2];
    document.getElementById("visibleCount").textContent = filtered.length;
    kanaChart.innerHTML = "";
    filtered.forEach((item) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "kana-cell";
      cell.dataset.character = item[0];
      cell.innerHTML = `<span class="kana-cell-symbol">${item[0]}</span><span class="kana-cell-romaji">${item[1]}</span>`;
      cell.addEventListener("click", () => { selectKana(item); speakKana(item[0]); if(window.jlTrackActivity) jlTrackActivity("kana",1); });
      kanaChart.appendChild(cell);
    });
    document.getElementById("kanaEmpty").hidden = filtered.length !== 0;
    if (filtered.length) selectKana(filtered[0]);
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => {
    activeKanaScript = tab.dataset.script;
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    renderKana();
  }));
  search.addEventListener("input", renderKana);
  document.getElementById("detailSound").addEventListener("click", () => { speakKana(selectedKana[0]); if(window.jlTrackActivity) jlTrackActivity("speak",1); });
  document.getElementById("soundAll").addEventListener("click", async () => {
    const visible = [...kanaChart.querySelectorAll(".kana-cell")].map((cell) => cell.dataset.character);
    for (const character of visible) {
      speakKana(character);
      await new Promise((resolve) => setTimeout(resolve, 650));
    }
  });
  renderKana();

  // Quiz interaktif 10 soal acak, hasil hanya tersimpan di memori halaman.
  let practiceScript = "hiragana";
  let quizItems = [];
  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;
  document.querySelectorAll(".practice-script").forEach((button) => button.addEventListener("click", () => {
    practiceScript = button.dataset.practice;
    document.querySelectorAll(".practice-script").forEach((item) => item.classList.toggle("active", item === button));
  }));
  const start = document.getElementById("startKanaQuiz");
  const quizArea = document.getElementById("kanaQuizArea");
  const placeholder = document.querySelector(".kana-quiz-placeholder");
  const result = document.getElementById("kanaQuizResult");
  const options = document.getElementById("kanaQuizOptions");
  const next = document.getElementById("kanaQuizNext");

  function renderKanaQuestion() {
    const current = quizItems[quizIndex];
    document.getElementById("kanaQuizCount").textContent = `${String(quizIndex + 1).padStart(2,"0")} / ${quizItems.length}`;
    document.getElementById("kanaQuizProgress").style.width = `${(quizIndex / quizItems.length) * 100}%`;
    document.getElementById("kanaQuizCharacter").textContent = current[0];
    document.getElementById("kanaQuizFeedback").textContent = "Pilih romaji yang sesuai.";
    document.getElementById("kanaQuizFeedback").className = "quiz-feedback";
    next.disabled = true;
    next.textContent = quizIndex === quizItems.length - 1 ? "Lihat hasil →" : "Berikutnya →";
    quizAnswered = false;
    const choices = [current[1]];
    while (choices.length < 4) {
      const candidate = kanaSets[practiceScript][Math.floor(Math.random() * 46)][1];
      if (!choices.includes(candidate)) choices.push(candidate);
    }
    choices.sort(() => Math.random() - 0.5);
    options.innerHTML = "";
    choices.forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-option";
      button.textContent = choice;
      button.addEventListener("click", () => {
        if (quizAnswered) return;
        quizAnswered = true;
        const correct = choice === current[1];
        if (correct) quizScore++;
        button.classList.add(correct ? "correct" : "incorrect");
        [...options.children].forEach((other) => {
          other.disabled = true;
          if (other.textContent === current[1]) other.classList.add("correct");
        });
        const feedback = document.getElementById("kanaQuizFeedback");
        feedback.textContent = correct ? "Tepat! よくできました！" : `Belum tepat. Jawaban: ${current[1]}.`;
        feedback.className = `quiz-feedback ${correct ? "is-correct" : "is-wrong"}`;
        next.disabled = false;
        document.getElementById("kanaQuizProgress").style.width = `${((quizIndex + 1) / quizItems.length) * 100}%`;
      });
      options.appendChild(button);
    });
  }
  start.addEventListener("click", () => {
    quizItems = [...kanaSets[practiceScript]].sort(() => Math.random() - 0.5).slice(0,10);
    quizIndex = 0;
    quizScore = 0;
    placeholder.hidden = true;
    result.hidden = true;
    quizArea.hidden = false;
    renderKanaQuestion();
  });
  next.addEventListener("click", () => {
    if (!quizAnswered) return;
    quizIndex++;
    if (quizIndex < quizItems.length) {
      renderKanaQuestion();
    } else {
      quizArea.hidden = true;
      result.hidden = false;
      document.getElementById("kanaQuizCount").textContent = "SELESAI";
      document.getElementById("kanaQuizProgress").style.width = "100%";
      result.innerHTML = `<div class="result-symbol">達</div><h3>Latihan selesai!</h3><p>Skor kamu</p><strong>${quizScore} <small>/ 10</small></strong><p>${quizScore >= 8 ? "Hebat! Pertahankan konsistensimu." : "Terus berlatih. Sedikit demi sedikit akan semakin hafal."}</p><button class="btn btn-primary btn-small" id="retryKanaQuiz">Ulangi latihan ↻</button>`;
      document.getElementById("retryKanaQuiz").addEventListener("click", () => start.click());
    }
  });
}


// Shared learning passport: lightweight, privacy-friendly browser storage.
const JL_STORE = "jlearn-passport-v1";
function jlRead(){try{return JSON.parse(localStorage.getItem(JL_STORE))||{xp:0,sessions:0,bestQuiz:0,words:[],days:{},quizHistory:[]}}catch(e){return {xp:0,sessions:0,bestQuiz:0,words:[],days:{},quizHistory:[]}}}
function jlSave(data){localStorage.setItem(JL_STORE,JSON.stringify(data))}
function jlAward(xp,activity){const d=jlRead();d.xp+=xp;d.sessions+=1;const day=new Date().toISOString().slice(0,10);d.days[day]=(d.days[day]||0)+1;d.lastActivity=activity;jlSave(d)}

const vocabData = [
 {jp:"こんにちは",romaji:"konnichiwa",meaning:"Halo / selamat siang",category:"Sapaan",example:"こんにちは、レパルさん。"},
 {jp:"ありがとう",romaji:"arigatou",meaning:"Terima kasih",category:"Sapaan",example:"ありがとう ございます。"},
 {jp:"さようなら",romaji:"sayounara",meaning:"Selamat tinggal",category:"Sapaan",example:"さようなら、また明日。"},
 {jp:"おはよう",romaji:"ohayou",meaning:"Selamat pagi",category:"Sapaan",example:"おはようございます。"},
 {jp:"すみません",romaji:"sumimasen",meaning:"Permisi / maaf",category:"Sapaan",example:"すみません、先生。"},
 {jp:"がっこう",romaji:"gakkou",meaning:"Sekolah",category:"Sekolah",example:"わたしは がっこうへ いきます。"},
 {jp:"せんせい",romaji:"sensei",meaning:"Guru",category:"Sekolah",example:"せんせい、ありがとう。"},
 {jp:"がくせい",romaji:"gakusei",meaning:"Siswa / pelajar",category:"Sekolah",example:"わたしは がくせいです。"},
 {jp:"ほん",romaji:"hon",meaning:"Buku",category:"Sekolah",example:"これは ほんです。"},
 {jp:"えんぴつ",romaji:"enpitsu",meaning:"Pensil",category:"Sekolah",example:"えんぴつを ください。"},
 {jp:"みず",romaji:"mizu",meaning:"Air",category:"Makanan",example:"みずを のみます。"},
 {jp:"ごはん",romaji:"gohan",meaning:"Nasi / makanan",category:"Makanan",example:"ごはんを たべます。"},
 {jp:"りんご",romaji:"ringo",meaning:"Apel",category:"Makanan",example:"りんごが すきです。"},
 {jp:"おちゃ",romaji:"ocha",meaning:"Teh",category:"Makanan",example:"おちゃを のみます。"},
 {jp:"さかな",romaji:"sakana",meaning:"Ikan",category:"Makanan",example:"さかなを たべます。"},
 {jp:"いち",romaji:"ichi",meaning:"Satu",category:"Angka",example:"いち、に、さん。"},
 {jp:"に",romaji:"ni",meaning:"Dua",category:"Angka",example:"りんごが にこ あります。"},
 {jp:"さん",romaji:"san",meaning:"Tiga",category:"Angka",example:"さんにん います。"},
 {jp:"よん",romaji:"yon",meaning:"Empat",category:"Angka",example:"よんじ です。"},
 {jp:"ご",romaji:"go",meaning:"Lima",category:"Angka",example:"ごふん まちます。"},
 {jp:"ねこ",romaji:"neko",meaning:"Kucing",category:"Hewan",example:"ねこが います。"},
 {jp:"いぬ",romaji:"inu",meaning:"Anjing",category:"Hewan",example:"いぬが すきです。"},
 {jp:"とり",romaji:"tori",meaning:"Burung",category:"Hewan",example:"とりが とんでいます。"},
 {jp:"うさぎ",romaji:"usagi",meaning:"Kelinci",category:"Hewan",example:"うさぎは かわいいです。"},
 {jp:"くるま",romaji:"kuruma",meaning:"Mobil",category:"Transportasi",example:"くるまで いきます。"},
 {jp:"でんしゃ",romaji:"densha",meaning:"Kereta",category:"Transportasi",example:"でんしゃに のります。"},
 {jp:"じてんしゃ",romaji:"jitensha",meaning:"Sepeda",category:"Transportasi",example:"じてんしゃで がっこうへ。"},
 {jp:"えき",romaji:"eki",meaning:"Stasiun",category:"Transportasi",example:"えきは どこですか。"},

 {jp:"おいしい",romaji:"oishii",meaning:"Enak",category:"Makanan",example:"このりんごは おいしいです。"},
 {jp:"たまご",romaji:"tamago",meaning:"Telur",category:"Makanan",example:"たまごを たべます。"},
 {jp:"にく",romaji:"niku",meaning:"Daging",category:"Makanan",example:"にくが すきです。"},
 {jp:"やさい",romaji:"yasai",meaning:"Sayuran",category:"Makanan",example:"やさいを たべます。"},
 {jp:"あさごはん",romaji:"asagohan",meaning:"Sarapan",category:"Makanan",example:"あさごはんを たべます。"},
 {jp:"ともだち",romaji:"tomodachi",meaning:"Teman",category:"Sekolah",example:"ともだちと はなします。"},
 {jp:"きょうしつ",romaji:"kyoushitsu",meaning:"Ruang kelas",category:"Sekolah",example:"きょうしつに います。"},
 {jp:"つくえ",romaji:"tsukue",meaning:"Meja",category:"Sekolah",example:"つくえの うえです。"},
 {jp:"けしごむ",romaji:"keshigomu",meaning:"Penghapus",category:"Sekolah",example:"けしごむを かします。"},
 {jp:"かばん",romaji:"kaban",meaning:"Tas",category:"Sekolah",example:"これは わたしの かばんです。"},
 {jp:"あか",romaji:"aka",meaning:"Merah",category:"Warna",example:"あかい はなです。"},
 {jp:"あお",romaji:"ao",meaning:"Biru",category:"Warna",example:"あおい そらです。"},
 {jp:"しろ",romaji:"shiro",meaning:"Putih",category:"Warna",example:"しろい ねこです。"},
 {jp:"くろ",romaji:"kuro",meaning:"Hitam",category:"Warna",example:"くろい くつです。"},
 {jp:"みどり",romaji:"midori",meaning:"Hijau",category:"Warna",example:"みどりの きです。"},
 {jp:"はな",romaji:"hana",meaning:"Bunga",category:"Alam",example:"はなが きれいです。"},
 {jp:"やま",romaji:"yama",meaning:"Gunung",category:"Alam",example:"やまへ いきます。"},
 {jp:"かわ",romaji:"kawa",meaning:"Sungai",category:"Alam",example:"かわの みずです。"},
 {jp:"そら",romaji:"sora",meaning:"Langit",category:"Alam",example:"そらが あおいです。"},
 {jp:"あめ",romaji:"ame",meaning:"Hujan",category:"Alam",example:"あめが ふっています。"},
 {jp:"きょう",romaji:"kyou",meaning:"Hari ini",category:"Waktu",example:"きょうは がっこうです。"},
 {jp:"あした",romaji:"ashita",meaning:"Besok",category:"Waktu",example:"あした またね。"},
 {jp:"きのう",romaji:"kinou",meaning:"Kemarin",category:"Waktu",example:"きのう べんきょうしました。"},
 {jp:"いま",romaji:"ima",meaning:"Sekarang",category:"Waktu",example:"いま なんじですか。"},
 {jp:"まいにち",romaji:"mainichi",meaning:"Setiap hari",category:"Waktu",example:"まいにち にほんごを べんきょうします。"},
 {jp:"おおきい",romaji:"ookii",meaning:"Besar",category:"Sifat",example:"おおきい いえです。"},
 {jp:"ちいさい",romaji:"chiisai",meaning:"Kecil",category:"Sifat",example:"ちいさい ねこです。"},
 {jp:"たのしい",romaji:"tanoshii",meaning:"Menyenangkan",category:"Sifat",example:"にほんごは たのしいです。"},
 {jp:"かわいい",romaji:"kawaii",meaning:"Lucu",category:"Sifat",example:"うさぎは かわいいです。"},
 {jp:"べんきょう",romaji:"benkyou",meaning:"Belajar",category:"Aktivitas",example:"にほんごを べんきょうします。"},
 {jp:"ねます",romaji:"nemasu",meaning:"Tidur",category:"Aktivitas",example:"じゅうじに ねます。"}
];
function vocabLab(){return {items:vocabData,categories:[...new Set(vocabData.map(x=>x.category))],category:"Semua",search:"",selected:vocabData[0],flipped:false,index:0,score:0,answered:false,chosen:"",feedback:"",finished:false,options:[],get filtered(){return this.items.filter(w=>(this.category==="Semua"||w.category===this.category)&&[w.jp,w.romaji,w.meaning].join(" ").toLowerCase().includes(this.search.toLowerCase()))},get current(){return this.quizQuestions?.[this.index]||vocabData[0]},init(){this.startQuiz()},speak(text){if(!('speechSynthesis' in window)){this.feedback="Audio tidak didukung browser ini.";return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="ja-JP";u.rate=.82;const voices=speechSynthesis.getVoices();const jp=voices.find(v=>v.lang&&v.lang.toLowerCase().startsWith("ja"));if(jp)u.voice=jp;speechSynthesis.speak(u);const d=jlRead();if(!d.words.includes(text)){d.words.push(text);jlSave(d)}if(window.jlTrackActivity)jlTrackActivity("vocab",1);if(window.jlTrackActivity)jlTrackActivity("speak",1)},nextCard(){const pool=this.filtered.length?this.filtered:this.items;let n=pool[Math.floor(Math.random()*pool.length)];if(pool.length>1&&n.jp===this.selected.jp)n=pool[(pool.indexOf(n)+1)%pool.length];this.selected=n;this.flipped=false},startQuiz(){this.quizQuestions=[...this.items].sort(()=>Math.random()-.5).slice(0,10);this.index=0;this.score=0;this.answered=false;this.chosen="";this.feedback="";this.finished=false;this.makeOptions()},makeOptions(){const q=this.current;const wrong=this.items.filter(x=>x.jp!==q.jp).sort(()=>Math.random()-.5).slice(0,3).map(x=>x.meaning);this.options=[q.meaning,...wrong].sort(()=>Math.random()-.5)},answer(option){if(this.answered)return;this.answered=true;this.chosen=option;if(option===this.current.meaning){this.score++;this.feedback="Tepat! よくできました！ 🎉"}else this.feedback="Belum tepat. Jawabannya: "+this.current.meaning+" 😭";if(window.jlTrackActivity)jlTrackActivity("vocab",1)},nextQuestion(){if(!this.answered)return;if(this.index===9){this.finished=true;const d=jlRead();d.bestQuiz=Math.max(d.bestQuiz,this.score);d.quizHistory.push({date:new Date().toISOString().slice(0,10),score:this.score});jlSave(d);jlAward(this.score*2,"vocabulary-quiz");return}this.index++;this.answered=false;this.chosen="";this.feedback="";this.makeOptions()}}}

// Memory Match: 10 progressive stages with increasing pair counts.
(function(){
 const grid=document.getElementById('matchGrid'); if(!grid)return;
 const allPairs=[['ねこ','Kucing'],['みず','Air'],['ほん','Buku'],['いぬ','Anjing'],['がっこう','Sekolah'],['でんしゃ','Kereta'],['せんせい','Guru'],['りんご','Apel'],['ともだち','Teman'],['はな','Bunga']];
 const stageNames=['Pemanasan','Kata harian','Sekolah','Makanan','Transportasi','Campuran','Alam','Warna','Aktivitas','Master'];
 const stageKey='jlearn-stage-unlocked-v1'; let unlocked=1,stage=1,deck=[],first=null,lock=false,moves=0,matched=0,seconds=0,timer=null;
 try{unlocked=Math.max(1,Number(localStorage.getItem(stageKey)||1))}catch(e){}
 const movesEl=document.getElementById('matchMoves'),pairsEl=document.getElementById('matchPairs'),timeEl=document.getElementById('matchTime'),message=document.getElementById('matchMessage'),win=document.getElementById('matchWin');
 const stageGrid=document.getElementById('stageGrid'),stageStatus=document.getElementById('stageStatus');
 function renderStages(){if(!stageGrid)return;stageGrid.innerHTML='';for(let i=1;i<=10;i++){const b=document.createElement('button');b.type='button';b.className='stage-button'+(i===stage?' active':'')+(i>unlocked?' locked':'');b.disabled=i>unlocked;b.innerHTML=`<b>${String(i).padStart(2,'0')}</b><small>${stageNames[i-1]}</small>${i>unlocked?'<em>🔒</em>':'<em>★</em>'}`;b.addEventListener('click',()=>{stage=i;renderStages();setup()});stageGrid.appendChild(b)}}
 function clock(){seconds++;timeEl.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')}
 function setup(){clearInterval(timer);timer=null;seconds=0;moves=0;matched=0;first=null;lock=false;win.hidden=true;timeEl.textContent='00:00';movesEl.textContent='0';const count=Math.min(4+Math.floor((stage-1)*.65),10);pairsEl.textContent='0/'+count;message.textContent='Stage '+stage+': cocokkan '+count+' pasangan.';if(stageStatus)stageStatus.textContent='Stage '+stage+' · '+stageNames[stage-1]+' · '+count+' pasangan';const chosen=allPairs.slice(0,count);deck=chosen.flatMap((p,i)=>[{id:i,value:p[0],kind:'jp'},{id:i,value:p[1],kind:'meaning'}]).sort(()=>Math.random()-.5);grid.innerHTML='';deck.forEach((card,i)=>{const b=document.createElement('button');b.className='match-card '+(card.kind==='meaning'?'meaning':'');b.textContent='？';b.dataset.index=i;b.addEventListener('click',()=>reveal(b,card,count));grid.appendChild(b)})}
 function reveal(button,card,count){if(lock||button.classList.contains('matched')||button.classList.contains('revealed'))return;if(!timer)timer=setInterval(clock,1000);button.textContent=card.value;button.classList.add('revealed');if(!first){first={button,card};return}moves++;movesEl.textContent=moves;if(first.card.id===card.id&&first.card.kind!==card.kind){first.button.classList.remove('revealed');first.button.classList.add('matched');button.classList.remove('revealed');button.classList.add('matched');first.button.disabled=true;button.disabled=true;matched++;pairsEl.textContent=matched+'/'+count;message.textContent='Pasangan cocok! いいね！';first=null;if(matched===count){clearInterval(timer);win.hidden=false;const reward=20+stage*5;document.getElementById('matchResult').textContent=`Stage ${stage} selesai dalam ${moves} langkah (${timeEl.textContent}). Reward: ${reward} XP.`;if(stage>=unlocked&&unlocked<10){unlocked=Math.min(10,stage+1);localStorage.setItem(stageKey,String(unlocked));renderStages()}const rewardKey='jlearn-stage-reward-'+stage;if(!localStorage.getItem(rewardKey)){jlAward(reward,'dojo-stage-'+stage);localStorage.setItem(rewardKey,'1')}if(window.jlTrackActivity)jlTrackActivity('stage',1)}}else{lock=true;message.textContent='Belum cocok. Coba ingat posisinya 😵';const previous=first;first=null;setTimeout(()=>{previous.button.textContent='？';button.textContent='？';previous.button.classList.remove('revealed');button.classList.remove('revealed');lock=false},750)}}
 document.getElementById('restartMatch').addEventListener('click',setup);document.getElementById('playAgain').addEventListener('click',setup);renderStages();setup();
})();
// Learning Passport dashboard, chart, achievements and export.
(function(){const el=document.getElementById('activityChart');if(!el)return;const d=jlRead(),xp=d.xp||0,level=Math.floor(xp/100)+1;document.getElementById('levelNumber').textContent=level;document.getElementById('xpTotal').textContent=xp;document.getElementById('xpCaption').textContent=`${xp%100}/100 XP menuju level berikutnya.`;document.getElementById('xpBar').style.width=(xp%100)+'%';document.getElementById('studySessions').textContent=d.sessions||0;document.getElementById('quizBest').textContent=d.bestQuiz===undefined||d.bestQuiz===0?'—':d.bestQuiz+'/10';document.getElementById('wordsSeen').textContent=(d.words||[]).length;const days=Object.keys(d.days||{}).filter(k=>d.days[k]>0).length;document.getElementById('streakDays').textContent=days;const labels=[],values=[];for(let i=6;i>=0;i--){const date=new Date();date.setDate(date.getDate()-i);const key=date.toISOString().slice(0,10);labels.push(date.toLocaleDateString('id-ID',{weekday:'short'}));values.push((d.days||{})[key]||0)}if(window.Chart)new Chart(el,{type:'bar',data:{labels,datasets:[{label:'Aktivitas',data:values,borderWidth:1,borderRadius:5}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{precision:0}}}}});const achievements=[['初','Langkah pertama','Kumpulkan 1 XP',xp>=1],['語','Pengamat kata','Lihat 5 kosakata',(d.words||[]).length>=5],['正','Perfect learner','Raih skor 10/10',(d.bestQuiz||0)>=10],['遊','Mind match','Selesaikan memory match',xp>=30],['百','Century club','Kumpulkan 100 XP',xp>=100]];document.getElementById('achievementList').innerHTML=achievements.map(a=>`<div class="achievement ${a[3]?'':'locked'}"><span>${a[0]}</span><div><b>${a[1]}</b><small>${a[2]}</small></div></div>`).join('');document.getElementById('exportProgress').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='jlearn-progress.json';a.click();URL.revokeObjectURL(a.href)});document.getElementById('resetProgress').addEventListener('click',()=>{if(confirm('Reset semua progres belajar di browser ini?')){localStorage.removeItem(JL_STORE);location.reload()}})})();


/* ==================================================
   J-STUDIO - DAILY CHALLENGE SYSTEM
================================================== */

(() => {

    const root = document.querySelector("[data-daily-challenge]");

    if (!root) return;

    const title = root.querySelector("#dailyTitle");
    const task = root.querySelector("#dailyTask");
    const choices = root.querySelector("#dailyChoices");
    const feedback = root.querySelector("#dailyFeedback");

    let completed = false;

    fetch("data/daily-challenge.json")

        .then(response => {

            if (!response.ok) {
                throw new Error("Challenge unavailable");
            }

            return response.json();

        })

        .then(data => {

            title.textContent = data.title;
            task.textContent = data.task;

            data.choices.forEach(choice => {

                const button = document.createElement("button");

                button.type = "button";
                button.textContent = choice;

                button.addEventListener("click", () => {

                    if (completed) return;

                    completed = true;

                    const correct = choice === data.answer;

                    [...choices.children].forEach(item => {

                        item.disabled = true;

                        if (item.textContent === data.answer) {
                            item.classList.add("correct");
                        }

                    });

                    if (correct) {

                        feedback.textContent =
                            "正解！ " + data.explanation;

                        feedback.className =
                            "quiz-feedback is-correct";

                        /*
                         * Berikan XP satu kali per hari.
                         * Menggunakan sistem Learning Passport lama.
                         */

                        const today = new Date();

                        const dateKey =
                            today.getFullYear() + "-" +
                            String(today.getMonth() + 1).padStart(2, "0") + "-" +
                            String(today.getDate()).padStart(2, "0");

                        const rewardKey =
                            "jlearn-daily-reward-" + dateKey;

                        if (!localStorage.getItem(rewardKey)) {

                            if (typeof jlAward === "function") {
                                jlAward(10, "daily-challenge");
                            }

                            localStorage.setItem(rewardKey, "claimed");

                            feedback.textContent +=
                                " +10 XP berhasil diperoleh!";

                        } else {

                            feedback.textContent +=
                                " Tantangan hari ini sudah diberi XP.";

                        }

                    } else {

                        feedback.textContent =
                            "Belum tepat. " + data.explanation;

                        feedback.className =
                            "quiz-feedback is-wrong";

                    }

                });

                choices.appendChild(button);

            });

        })

        .catch(error => {

            console.error(error);

            title.textContent = "Tantangan belum tersedia";

            task.textContent =
                "Periksa koneksi internet lalu muat ulang halaman.";

        });

})();

// J-Learn 2.0: reveal animations + Kitsune companion
(() => {
  const revealItems = document.querySelectorAll('.reveal');
  // Only enable hidden-before-reveal styling after JS is confirmed available.
  document.documentElement.classList.add('js-motion');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const mascotButton = document.getElementById('mascotButton');
  const mascotBubble = document.getElementById('mascotBubble');
  if (mascotButton && mascotBubble) {
    const messages = [
      ['Konnichiwa!', 'Yuk, belajar sedikit demi sedikit. Kamu pasti bisa!'],
      ['Ganbatte!', 'Coba ulangi materi yang tadi kamu pelajari, ya!'],
      ['Sugoi!', 'Setiap latihan kecil membuat kemampuanmu berkembang.'],
      ['Daijoubu!', 'Salah itu bagian dari proses belajar. Coba lagi!'],
      ['休憩しよう！', 'Jangan lupa istirahat sebentar sebelum lanjut belajar.']
    ];
    let messageIndex = 0;
    mascotButton.addEventListener('click', () => {
      const message = messages[messageIndex % messages.length];
      mascotBubble.innerHTML = `<strong>${message[0]}</strong><span>${message[1]}</span>`;
      mascotBubble.classList.add('show');
      messageIndex += 1;
      window.clearTimeout(mascotButton._bubbleTimer);
      mascotButton._bubbleTimer = window.setTimeout(() => mascotBubble.classList.remove('show'), 4800);
    });
  }
})();


/* AUTO QUEST TRACKER: activities update missions without manual checkboxes. */
(() => {
 const now = new Date(); const dayKey = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
 const key = 'jlearn-auto-quest-' + dayKey;
 const defaults = {kana:0,vocab:0,speak:0};
 function read(){try{return {...defaults,...JSON.parse(localStorage.getItem(key)||'{}')}}catch(e){return {...defaults}}}
 function save(data){localStorage.setItem(key,JSON.stringify(data));render(data)}
 function render(data=read()){
   const root=document.getElementById('missionList'); if(!root)return;
   const goals={kana:5,vocab:5,speak:3}; let done=0;
   Object.keys(goals).forEach(name=>{
     const card=root.querySelector(`[data-mission="${name}"]`);if(!card)return;
     const value=Math.min(data[name]||0,goals[name]),complete=value>=goals[name];if(complete)done++;
     const label=card.querySelector('.mission-progress-text');if(label)label.textContent=value+'/'+goals[name]+(complete?' ✓':'');
     const bar=card.querySelector('.mission-progress-track i');if(bar)bar.style.width=(value/goals[name]*100)+'%';
     card.classList.toggle('completed',complete);
   });
   const count=root.querySelector('#missionCount');if(count)count.textContent=done+'/3 misi selesai';
   const bar=root.querySelector('#missionBar');if(bar)bar.style.width=(done/3*100)+'%';
 }
 window.jlTrackActivity=function(type,amount=1){
   const data=read();if(!(type in defaults))return;
   const goals={kana:5,vocab:5,speak:3};const before=Math.min(data[type],goals[type]);
   data[type]=Math.min(goals[type],(data[type]||0)+amount);save(data);
   if(before<goals[type]&&data[type]>=goals[type]&&!localStorage.getItem(key+'-reward-'+type)){
     localStorage.setItem(key+'-reward-'+type,'1');
     if(typeof jlAward==='function')jlAward(15,'quest-'+type);
     window.dispatchEvent(new CustomEvent('jlearn:quest-complete',{detail:{type}}));
   }
 };
 render();
})();

window.jlSpeak = function(text){
 if(!('speechSynthesis' in window)){alert('Browser ini belum mendukung audio otomatis.');return}
 window.speechSynthesis.cancel();
 const utterance=new SpeechSynthesisUtterance(text);
 utterance.lang='ja-JP';utterance.rate=.78;utterance.pitch=1.02;
 const choose=()=>{const voices=window.speechSynthesis.getVoices();const jp=voices.find(v=>/^ja(-|_)/i.test(v.lang));if(jp)utterance.voice=jp;window.speechSynthesis.speak(utterance)};
 if(window.speechSynthesis.getVoices().length)choose();else{window.speechSynthesis.onvoiceschanged=()=>choose()}
};


// Static Edition: local study tips (no Flask/HTMX backend required).
(() => {
  const button = document.getElementById("studyTipButton");
  const target = document.getElementById("studyTip");
  if (!button || !target) return;
  const tips = [
    "Baca kana dengan suara pelan. Mengucapkan membantu menguatkan ingatan.",
    "Coba ingat arti kata sebelum membalik flashcard.",
    "Belajar 10 menit secara konsisten lebih mudah dijaga daripada maraton semalam.",
    "Tulis satu contoh kalimat sederhana dari kosakata yang baru kamu pelajari."
  ];
  button.addEventListener("click", () => {
    const tip = tips[Math.floor(Math.random() * tips.length)];
    target.innerHTML = `<div class=\"htmx-tip\"><b>STUDY TIP</b><span>${tip}</span></div>`;
  });
})();
