let questions = [];
let i = 0;
let score = 0;

let timerId = null;
let timeLeft = 10;
let answered = false;

const QUESTION_SECONDS = 10;

function setTimerText() {
  const el = document.getElementById("timer");
  if (!el) return;
  el.textContent = `Zeit: ${timeLeft}s`;
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startTimer() {
  stopTimer();
  timeLeft = QUESTION_SECONDS;
  setTimerText();

  timerId = setInterval(() => {
    timeLeft -= 1;
    setTimerText();

    if (timeLeft <= 0) {
      stopTimer();

      if (!answered) {
        answered = true;
        document.getElementById("res").textContent = "⏰ Zeit abgelaufen!";
        // Buttons deaktivieren
        document.querySelectorAll("#opts button").forEach((b) => (b.disabled = true));
        // nächste Frage
        i += 1;
        setTimeout(show, 800);
      }
    }
  }, 1000);
}

document.getElementById("start").onclick = async () => {
  const level = document.getElementById("level").value;

  const r = await fetch(`/api/questions?level=${encodeURIComponent(level)}`);
  const data = await r.json();

  questions = data.questions || [];
  i = 0;
  score = 0;

  document.getElementById("score").textContent = `Punkte: ${score} / ${questions.length}`;
  document.getElementById("res").textContent = "";

  show();
};

function show() {
  // Ende
  if (i >= questions.length) {
    stopTimer();
    document.getElementById("q").textContent = `🎉 Fertig! Du hast ${score} von ${questions.length} Punkten erreicht`;
    document.getElementById("opts").innerHTML = "";
    document.getElementById("res").textContent = "";
    document.getElementById("timer").textContent = "";
    const img = document.getElementById("qimg");
    img.style.display = "none";
    return;
  }

  answered = false;
  document.getElementById("res").textContent = "";

  const q = questions[i];

  // Frage text
  document.getElementById("q").textContent = q.question;

  // Bild
  const img = document.getElementById("qimg");
  if (q.image) {
    img.src = q.image;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  // Optionen (WICHTIG: kommt aus main.py als q.options)
  const opts = document.getElementById("opts");
  opts.innerHTML = "";

  const answers = Array.isArray(q.options) ? q.options : [];
  answers.forEach((answerText, idx) => {
    const b = document.createElement("button");
    b.textContent = answerText;

    b.onclick = () => {
      if (answered) return;
      answered = true;
      stopTimer();

      // Buttons deaktivieren
      document.querySelectorAll("#opts button").forEach((btn) => (btn.disabled = true));

      if (idx === q.correctIndex) {
        score += 1;
        document.getElementById("res").textContent = "✅ Richtig";
      } else {
        document.getElementById("res").textContent = "❌ Falsch";
      }

      document.getElementById("score").textContent = `Punkte: ${score} / ${questions.length}`;

      i += 1;
      setTimeout(show, 800);
    };

    opts.appendChild(b);
  });

  // Timer pro Frage starten
  startTimer();
}
