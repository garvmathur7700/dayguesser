(() => {
  "use strict";

  const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const BATCH_SIZE = 10; // how many dates we generate ahead of time at once

  // ---- Screens ----
  const setupScreen = document.getElementById("setup-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const endScreen = document.getElementById("end-screen");

  // ---- Setup ----
  const setupForm = document.getElementById("setup-form");
  const countInput = document.getElementById("count-input");
  const keepComingBox = document.getElementById("keep-coming");

  // ---- Quiz ----
  const qNumberEl = document.getElementById("q-number");
  const scoreRightEl = document.getElementById("score-right");
  const scoreTotalEl = document.getElementById("score-total");
  const dateDisplayEl = document.getElementById("date-display");
  const dayGridEl = document.getElementById("day-grid");
  const feedbackEl = document.getElementById("feedback");
  const nextBtn = document.getElementById("next-btn");
  const stopBtn = document.getElementById("stop-btn");

  // ---- End ----
  const endRightEl = document.getElementById("end-right");
  const endTotalEl = document.getElementById("end-total");
  const endNoteEl = document.getElementById("end-note");
  const restartBtn = document.getElementById("restart-btn");

  // ---- Game state ----
  let targetCount = 10;
  let infinite = false;
  let queue = [];        // upcoming Date objects, not yet asked
  let asked = 0;
  let correct = 0;
  let currentDate = null;
  let answered = false;

  function show(screen){
    [setupScreen, quizScreen, endScreen].forEach(s => s.classList.add("hidden"));
    screen.classList.remove("hidden");
  }

  // Random date anywhere in the Gregorian calendar (year 1-9999).
  // setFullYear avoids the JS "two-digit year -> 1900s" quirk.
  function randomDate(){
    const year = 1000 + Math.floor(Math.random() * 3000);
    const month = Math.floor(Math.random() * 12); // 0-11
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const day = 1 + Math.floor(Math.random() * daysInMonth);
    const d = new Date(year, month, day);
    d.setFullYear(year);
    return d;
  }

  function refillQueue(){
    const n = BATCH_SIZE;
    for (let i = 0; i < n; i++) queue.push(randomDate());
  }

  function formatDate(d){
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  function buildDayButtons(){
    dayGridEl.innerHTML = "";
    DAY_NAMES.forEach((name, idx) => {
      const btn = document.createElement("button");
      btn.className = "day-btn";
      btn.type = "button";
      btn.textContent = name;
      btn.dataset.index = idx;
      btn.addEventListener("click", () => handleAnswer(idx, btn));
      dayGridEl.appendChild(btn);
    });
  }

  function nextQuestion(){
    if (!infinite && asked >= targetCount){
      endQuiz();
      return;
    }
    if (queue.length === 0) refillQueue();

    currentDate = queue.shift();
    answered = false;

    qNumberEl.textContent = asked + 1;
    dateDisplayEl.textContent = formatDate(currentDate);
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
    nextBtn.classList.add("hidden");

    buildDayButtons();
    show(quizScreen);
  }

  function handleAnswer(chosenIdx, btnEl){
    if (answered) return;
    answered = true;

    const correctIdx = currentDate.getDay();
    const isCorrect = chosenIdx === correctIdx;

    asked += 1;
    if (isCorrect) correct += 1;

    scoreRightEl.textContent = correct;
    scoreTotalEl.textContent = asked;

    document.querySelectorAll(".day-btn").forEach(b => b.disabled = true);

    if (isCorrect){
      btnEl.classList.add("correct");
      feedbackEl.textContent = "Correct!";
      feedbackEl.classList.add("is-correct");
    } else {
      btnEl.classList.add("wrong");
      feedbackEl.textContent = `Wrong — it was ${DAY_NAMES[correctIdx]}.`;
      feedbackEl.classList.add("is-wrong");
      const correctBtn = dayGridEl.querySelector(`[data-index="${correctIdx}"]`);
      if (correctBtn) correctBtn.classList.add("reveal");
    }

    if (infinite || asked < targetCount){
      nextBtn.classList.remove("hidden");
    } else {
      setTimeout(endQuiz, 900);
    }
  }

  function endQuiz(){
    endRightEl.textContent = correct;
    endTotalEl.textContent = asked;
    const pct = asked > 0 ? Math.round((correct / asked) * 100) : 0;
    endNoteEl.textContent = asked === 0 ? "" : `${pct}% correct`;
    show(endScreen);
  }

  // ---- Events ----
  setupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = parseInt(countInput.value, 10);
    targetCount = Number.isFinite(val) && val > 0 ? val : 10;
    infinite = keepComingBox.checked;

    asked = 0;
    correct = 0;
    queue = [];
    scoreRightEl.textContent = "0";
    scoreTotalEl.textContent = "0";

    nextQuestion();
  });

  nextBtn.addEventListener("click", nextQuestion);
  stopBtn.addEventListener("click", endQuiz);
  restartBtn.addEventListener("click", () => show(setupScreen));

})();
