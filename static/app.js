let questions = [];
let i = 0;
let score = 0;
let timerId = null;
let timeLeft = 10;
let answered = false;
function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startTimer() {
  stopTimer();

  answered = false;
  timeLeft = 10;

  const timerEl = document.getElementById("timer");
  timerEl.textContent = "Zeit: " + timeLeft;

  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = "Zeit: " + timeLeft;

    if (timeLeft <= 0) {
      stopTimer();
      if (answered) return;

      answered = true;
      document.getElementById("res").textContent = "⏰ Zeit abgelaufen!";
      i++;
      setTimeout(show, 600);
    }
  }, 1000);
}


document.getElementById("start").onclick = async () => {
  const level = document.getElementById("level").value;
  const r = await fetch(`/api/questions?level=${level}`);
  questions = (await r.json()).questions;
  i = 0;
  score = 0;
document.getElementById("score").textContent = "Punkte: " + score;

  show();
};

function show() {
  // ENDE
  if (i >= questions.length) {
    document.getElementById("q").textContent =
      `🎉 Fertig! Du hast ${score} von ${questions.length} Punkten erreicht`;
    document.getElementById("opts").innerHTML = "";
    document.getElementById("res").textContent = "";
    document.getElementById("timer").textContent = "";
    const img = document.getElementById("qimg");
    img.style.display = "none";
    return;
  }

  answered = false;

  // TIMER RESET
  if (timerId) clearInterval(timerId);
  timeLeft = 10;
  document.getElementById("timer").textContent = "Zeit: 10s";

  timerId = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = "Zeit: " + timeLeft + "s";

    if (timeLeft <= 0) {
      clearInterval(timerId);
      if (answered) return;

      answered = true;
      document.getElementById("res").textContent = "⏰ Zeit abgelaufen";
      i++;
      setTimeout(show, 800);
    }
  }, 1000);

  // FRAGE LADEN
  const q = questions[i];
  document.getElementById("q").textContent = q.question;

  const img = document.getElementById("qimg");
  if (q.image) {
    img.src = q.image;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  const opts = document.getElementById("opts");
  opts.innerHTML = "";

// WRONG kann manchmal undefined oder String sein -> wir machen es sicher
const wrongRaw = q.wrong ?? q.wrongs ?? q.wrong_answers ?? q.wrongAnswers ?? [];
const wrong = Array.isArray(wrongRaw) ? wrongRaw : [wrongRaw];

const answers = [q.correct, ...wrong].filter(Boolean);
startTimer();

  answers.forEach(a => {
    const b = document.createElement("button");
    b.textContent = a;

    b.onclick = () => {
      if (answered) return;
      answered = true;
      clearInterval(timerId);

      if (a === q.correct) {
        score++;
        document.getElementById("res").textContent = "✅ Richtig";
      } else {
        document.getElementById("res").textContent = "❌ Falsch";
      }

      document.getElementById("score").textContent = "Punkte: " + score;
      i++;
      setTimeout(show, 800);
    };

    opts.appendChild(b);
  });
}
