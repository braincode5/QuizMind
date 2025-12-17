let questions = [];
let i = 0;
let score = 0;

let timerId = null;
let timeLeft = 10;
let answered = false;

document.getElementById("start").onclick = async () => {
  const level = document.getElementById("level").value;

  const r = await fetch(`/api/questions?level=${level}`);
  const data = await r.json();

  questions = data.questions || [];
  i = 0;
  score = 0;

  document.getElementById("score").textContent = "Punkte: " + score;
  document.getElementById("res").textContent = "";

  show();
};

function show() {
  if (timerId) clearInterval(timerId);

  if (!questions || questions.length === 0) {
    document.getElementById("q").textContent = "Keine Fragen gefunden.";
    document.getElementById("opts").innerHTML = "";
    document.getElementById("res").textContent = "";
    document.getElementById("timer").textContent = "";
    const img = document.getElementById("qimg");
    img.style.display = "none";
    return;
  }

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
  timeLeft = 10;

  const q = questions[i];

  document.getElementById("q").textContent = q.question ?? "";
  document.getElementById("res").textContent = "";

  const img = document.getElementById("qimg");
  if (q.image) {
    img.src = q.image;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  const wrongRaw = q.wrong ?? q.wrongs ?? q.wrong_answers ?? [];
  const wrong = Array.isArray(wrongRaw) ? wrongRaw : [String(wrongRaw)];
  let answers = [q.correct, ...wrong].filter(Boolean);

  answers = answers.sort(() => Math.random() - 0.5);

  const opts = document.getElementById("opts");
  opts.innerHTML = "";

  answers.forEach((a) => {
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

  document.getElementById("timer").textContent = `Zeit: ${timeLeft}s`;

  timerId = setInterval(() => {
    if (answered) return;

    timeLeft--;
    document.getElementById("timer").textContent = `Zeit: ${timeLeft}s`;

    if (timeLeft <= 0) {
      answered = true;
      clearInterval(timerId);

      document.getElementById("res").textContent = "⏰ Zeit abgelaufen!";

      document.querySelectorAll("#opts button").forEach((btn) => {
        btn.disabled = true;
      });

      i++;
      setTimeout(show, 800);
    }
  }, 1000);
}


