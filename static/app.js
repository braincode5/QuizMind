let questions = [];
let i = 0;

document.getElementById("start").onclick = async () => {
  const level = document.getElementById("level").value;
  const r = await fetch(`/api/questions?level=${level}`);
  questions = (await r.json()).questions;
  i = 0;
  show();
};

function show() {
  if (i >= questions.length) return;
  const q = questions[i];
  document.getElementById("q").textContent = q.question;
  const d = document.getElementById("opts");
  d.innerHTML = "";
  q.options.forEach((o, idx) => {
    const b = document.createElement("button");
    b.textContent = o;
    b.onclick = () => {
      document.getElementById("res").textContent =
        idx === q.correctIndex ? "✅ Richtig" : "❌ Falsch";
      i++;
      setTimeout(show, 800);
    };
    d.appendChild(b);
  });
}