let questions = [];
let i = 0;
let score = 0;

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
  if (i >= questions.length) {
  document.getElementById("q").textContent =
  `Fertig! Du hast ${score} von ${questions.length} Punkten erreicht 🎉`;

  document.getElementById("opts").innerHTML = "";
  document.getElementById("res").textContent = "";
  const img = document.getElementById("qimg");
  img.style.display = "none";
  return;
}

  const q = questions[i];
  document.getElementById("q").textContent = q.question;
  const img = document.getElementById("qimg");
if (q.image) {
  img.src = q.image;
  img.style.display = "block";
} else {
  img.style.display = "none";
  img.src = "";
}
  const d = document.getElementById("opts");
  d.innerHTML = "";
  
  q.options.forEach((o, idx) => {
    const b = document.createElement("button");
    b.textContent = o;
    b.onclick = () => {
  const correct = idx === q.correctIndex;

  if (correct) score++;
  document.getElementById("score").textContent = "Punkte: " + score;

  document.getElementById("res").textContent = correct ? "✅ Richtig" : "❌ Falsch";

  i++;
  setTimeout(show, 800);
};

    d.appendChild(b);
  });
}