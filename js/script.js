/* =========================================================
   AI CLASSROOM LAB
   All application logic lives in this file.
   Change COLLEGE_NAME below to personalize the project.
   ========================================================= */

const COLLEGE_NAME = "Student Innovation Studio";
// Example: "Maharishi Markandeshwar University"
// The UI will use the value above in the header/sidebar.

const state = {
  apiKey: sessionStorage.getItem("acl_gemini_key") || "",
  model: sessionStorage.getItem("acl_gemini_model") || "gemini-3.8-flash",
  chat: [],
  flashcards: [],
  quiz: [],
  quizAnswered: new Set(),
  quizScore: 0,
  slideIndex: 0,
  slides: []
};

const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // PERSONALIZE COLLEGE / INSTITUTE NAME
  // =========================================================

  $("collegeName").textContent = COLLEGE_NAME;
  $("sidebarCollege").textContent = COLLEGE_NAME;
  $("collegeShort").textContent = "AI Classroom Lab";

  // =========================================================
  // RESTORE API SETTINGS
  // =========================================================

  $("apiKey").value = state.apiKey;
  $("model").value = state.model;

  updateKeyUI();

  // =========================================================
  // NAVIGATION
  // =========================================================
  // This works for all 10 AI tools + About + Contact.
  // Each navigation button uses data-tool="name".

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      showTool(button.dataset.tool);

      // Close mobile sidebar after selecting a section.
      $("sidebar").classList.remove("open");
    });
  });

  // Mobile menu
  $("mobileMenu").addEventListener("click", () => {
    $("sidebar").classList.toggle("open");
  });

  // =========================================================
  // API KEY CONTROLS
  // =========================================================

  $("saveKey").addEventListener("click", saveKey);
  $("clearKey").addEventListener("click", clearKey);

  // =========================================================
  // TASK 1 - RESUME BUILDER
  // =========================================================

  $("generateResume").addEventListener("click", generateResume);
  $("downloadResume").addEventListener("click", downloadResume);

  // =========================================================
  // TASK 2 - NOTES GENERATOR
  // =========================================================

  $("generateNotes").addEventListener("click", generateNotes);
  $("copyNotes").addEventListener("click", copyNotes);
  $("downloadNotes").addEventListener("click", downloadNotes);

  // =========================================================
  // TASK 3 - PRESENTATION GENERATOR
  // =========================================================

  $("generateSlides").addEventListener("click", generateSlides);

  $("printSlides").addEventListener("click", () => {
    window.print();
  });

  // =========================================================
  // TASK 4 - MIND MAP
  // =========================================================

  $("generateMindmap").addEventListener("click", generateMindmap);

  // =========================================================
  // TASK 5 - GOOGLE SHEETS
  // =========================================================

  $("readSheet").addEventListener("click", readSheet);
  $("writeSheet").addEventListener("click", writeSheet);

  // =========================================================
  // TASK 6 - QUIZ
  // =========================================================

  $("generateQuiz").addEventListener("click", generateQuiz);

  // =========================================================
  // TASK 7 - DOUBT TUTOR
  // =========================================================

  $("sendChat").addEventListener("click", sendChat);

  $("clearChat").addEventListener("click", clearChat);

  $("chatInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendChat();
    }
  });

  // =========================================================
  // TASK 8 - FLASHCARDS
  // =========================================================

  $("generateFlashcards").addEventListener(
    "click",
    generateFlashcards
  );

  $("shuffleCards").addEventListener(
    "click",
    shuffleFlashcards
  );

  // =========================================================
  // TASK 9 - STUDY PLANNER
  // =========================================================

  $("generatePlan").addEventListener(
    "click",
    generatePlan
  );

  // =========================================================
  // TASK 10 - OCR
  // =========================================================

  $("runOCR").addEventListener("click", runOCR);

  $("summarizeOCR").addEventListener(
    "click",
    summarizeOCR
  );

  $("ocrFile").addEventListener(
    "change",
    previewOCR
  );

  // =========================================================
  // DEFAULT STUDY PLANNER DATE
  // =========================================================

  $("planDate").value = new Date()
    .toISOString()
    .slice(0, 10);
});


// =========================================================
// NAVIGATION SYSTEM
// =========================================================

function showTool(name) {

  // Activate selected navigation item.
  document
    .querySelectorAll(".nav-item")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.tool === name
      );
    });

  // Show selected page.
  document
    .querySelectorAll(".tool-page")
    .forEach((page) => {
      page.classList.toggle(
        "active",
        page.id === `tool-${name}`
      );
    });

  // Scroll to top.
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// =========================================================
// API STATUS
// =========================================================

function setStatus(message, type = "") {

  $("apiStatus").textContent = message;

  $("apiStatus").className =
    `api-status ${type}`;
}


// =========================================================
// UPDATE API KEY UI
// =========================================================

function updateKeyUI() {

  if (state.apiKey) {

    $("keyState").textContent =
      "Gemini connected";

    $("keyDot").classList.add("ok");

    setStatus(
      `Connected to ${state.model}. Your key is kept only in this browser session.`,
      "ok"
    );

  } else {

    $("keyState").textContent =
      "Key not connected";

    $("keyDot").classList.remove("ok");

    setStatus(
      "No key connected yet."
    );
  }
}


// =========================================================
// SAVE GEMINI API KEY
// =========================================================

function saveKey() {

  const key =
    $("apiKey").value.trim();

  if (!key) {

    return setStatus(
      "Please paste a Gemini API key first.",
      "error"
    );
  }

  state.apiKey = key;
  state.model = $("model").value;

  sessionStorage.setItem(
    "acl_gemini_key",
    state.apiKey
  );

  sessionStorage.setItem(
    "acl_gemini_model",
    state.model
  );

  updateKeyUI();
}


// =========================================================
// CLEAR GEMINI API KEY
// =========================================================

function clearKey() {

  state.apiKey = "";

  sessionStorage.removeItem(
    "acl_gemini_key"
  );

  sessionStorage.removeItem(
    "acl_gemini_model"
  );

  $("apiKey").value = "";

  updateKeyUI();
}


// =========================================================
// CHECK API KEY
// =========================================================

function requireKey() {

  if (!state.apiKey) {

    setStatus(
      "Connect your Gemini API key before using an AI tool.",
      "error"
    );

    return false;
  }

  return true;
}


// =========================================================
// BUTTON LOADING STATE
// =========================================================

function setBusy(
  button,
  busy,
  text = "Working..."
) {

  if (!button) return;

  if (busy) {

    button.dataset.oldText =
      button.textContent;

    button.textContent = text;

    button.disabled = true;

  } else {

    button.textContent =
      button.dataset.oldText ||
      button.textContent;

    button.disabled = false;
  }
}


// =========================================================
// GEMINI API FUNCTION
// =========================================================

async function gemini(
  prompt,
  json = false
) {

  if (!requireKey()) {
    throw new Error(
      "Gemini API key is missing."
    );
  }

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      state.model
    )}:generateContent`;

  const body = {

    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]

  };

  // Request JSON when needed.
  if (json) {

    body.generationConfig = {
      responseMimeType: "application/json"
    };
  }

  const response =
    await fetch(endpoint, {

      method: "POST",

      headers: {

        "Content-Type":
          "application/json",

        "x-goog-api-key":
          state.apiKey

      },

      body: JSON.stringify(body)
    });

  let data = {};

  try {

    data = await response.json();

  } catch (_) {

    data = {};
  }

  if (!response.ok) {

    throw new Error(
      data?.error?.message ||
      `Gemini request failed (${response.status}).`
    );
  }

  const text =
    data?.candidates?.[0]
      ?.content?.parts
      ?.map((part) => part.text || "")
      .join("") || "";

  if (!text) {

    throw new Error(
      "Gemini returned an empty response."
    );
  }

  return text;
}


// =========================================================
// PARSE JSON FROM AI RESPONSE
// =========================================================

function parseJSON(text) {

  // Direct JSON
  try {

    return JSON.parse(text);

  } catch (_) {}

  // JSON inside markdown code block.
  const fenced =
    text.match(
      /```(?:json)?\s*([\s\S]*?)```/i
    );

  if (fenced) {

    return JSON.parse(
      fenced[1]
    );
  }

  // Try array.
  const startArray =
    text.indexOf("[");

  const endArray =
    text.lastIndexOf("]");

  if (
    startArray >= 0 &&
    endArray > startArray
  ) {

    return JSON.parse(
      text.slice(
        startArray,
        endArray + 1
      )
    );
  }

  // Try object.
  const startObj =
    text.indexOf("{");

  const endObj =
    text.lastIndexOf("}");

  if (
    startObj >= 0 &&
    endObj > startObj
  ) {

    return JSON.parse(
      text.slice(
        startObj,
        endObj + 1
      )
    );
  }

  throw new Error(
    "The AI response was not valid JSON. Please try again."
  );
}


// =========================================================
// MARKDOWN RENDERING
// =========================================================

function markdown(text) {

  return window.marked
    ? marked.parse(text)
    : escapeHTML(text)
        .replace(/\n/g, "<br>");
}


// =========================================================
// HTML ESCAPE
// =========================================================

function escapeHTML(value) {

  return String(value ?? "")
    .replace(
      /[&<>"']/g,
      (character) => ({

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"

      }[character])
    );
}


// =========================================================
// SET RESULT
// =========================================================

function setResult(id, html) {

  $(id).innerHTML = html;
}


// =========================================================
// SHOW ERROR
// =========================================================

function showError(
  id,
  error
) {

  setResult(
    id,
    `<div class="notice">${escapeHTML(
      error.message ||
      String(error)
    )}</div>`
  );
}


/* =========================================================
   TASK 1
   AI RESUME BUILDER
   ========================================================= */

async function generateResume() {

  const button =
    $("generateResume");

  if (!requireKey()) return;

  setBusy(
    button,
    true,
    "Generating..."
  );

  setResult(
    "resumeOut",
    "<p>Generating your resume...</p>"
  );

  const prompt = `
Create a professional one-page student resume in Markdown.

Use ONLY the facts supplied below.

Do not invent:
- dates
- companies
- grades
- achievements
- skills

Keep the wording concise and professional.

Name:
${$("rName").value}

Contact:
${$("rContact").value}

Education:
${$("rEducation").value}

Skills:
${$("rSkills").value}

Experience / projects:
${$("rExperience").value}

Career objective:
${$("rObjective").value}
`;

  try {

    const result =
      await gemini(prompt);

    setResult(
      "resumeOut",
      `<div class="markdown-result">
        ${markdown(result)}
      </div>`
    );

  } catch (error) {

    showError(
      "resumeOut",
      error
    );

  } finally {

    setBusy(
      button,
      false,
      "Generate Resume"
    );
  }
}


// =========================================================
// DOWNLOAD RESUME PDF
// =========================================================

function downloadResume() {

  const text =
    $("resumeOut")
      .innerText
      .trim();

  if (
    !text ||
    text.includes(
      "Your generated resume will appear here."
    )
  ) {

    return alert(
      "Generate the resume first."
    );
  }

  if (!window.jspdf) {

    return alert(
      "PDF library is still loading. Try again."
    );
  }

  const {
    jsPDF
  } = window.jspdf;

  const doc =
    new jsPDF();

  const lines =
    doc.splitTextToSize(
      text,
      178
    );

  let y = 15;

  lines.forEach((line) => {

    if (y > 280) {

      doc.addPage();

      y = 15;
    }

    doc.text(
      line,
      16,
      y
    );

    y += 6;
  });

  doc.save(
    "AI_Resume.pdf"
  );
}


/* =========================================================
   TASK 2
   AI NOTES GENERATOR
   ========================================================= */

async function generateNotes() {

  const button =
    $("generateNotes");

  if (!requireKey()) return;

  const source =
    $("notesInput")
      .value
      .trim();

  if (!source) {

    return alert(
      "Paste some study material first."
    );
  }

  setBusy(
    button,
    true,
    "Generating..."
  );

  setResult(
    "notesOut",
    "<p>Creating structured notes...</p>"
  );

  try {

    const result =
      await gemini(`
Convert the following study material into concise exam-friendly notes.

Use:
- clear headings
- bullet points
- definitions
- examples only where supported by the source

Do not invent facts.

STUDY MATERIAL:

${source}
`);

    setResult(
      "notesOut",
      markdown(result)
    );

  } catch (error) {

    showError(
      "notesOut",
      error
    );

  } finally {

    setBusy(
      button,
      false,
      "Generate Notes"
    );
  }
}


// =========================================================
// COPY NOTES
// =========================================================

async function copyNotes() {

  const text =
    $("notesOut")
      .innerText
      .trim();

  if (!text) {

    return alert(
      "Generate notes first."
    );
  }

  await navigator.clipboard
    .writeText(text);

  alert(
    "Notes copied."
  );
}


// =========================================================
// DOWNLOAD NOTES
// =========================================================

function downloadNotes() {

  const text =
    $("notesOut")
      .innerText
      .trim();

  if (!text) {

    return alert(
      "Generate notes first."
    );
  }

  downloadTextFile(
    "AI_Notes.txt",
    text
  );
}


/* =========================================================
   TASK 3
   AI PRESENTATION GENERATOR
   ========================================================= */

async function generateSlides() {

  const button =
    $("generateSlides");

  if (!requireKey()) return;

  const topic =
    $("pptTopic")
      .value
      .trim();

  if (!topic) {

    return alert(
      "Enter a presentation topic."
    );
  }

  setBusy(
    button,
    true,
    "Building..."
  );

  setResult(
    "slidesOut",
    "<p>Building your slide deck...</p>"
  );

  try {

    const slides =
      parseJSON(
        await gemini(
          `
Create 6 presentation slides about "${topic}".

Return ONLY a JSON array.

Each item must have:

{
  "title": "string",
  "bullets": [
    "string",
    "string",
    "string",
    "string"
  ]
}

Keep each bullet short and presentation-friendly.
`,
          true
        )
      );

    state.slideIndex = 0;

    renderSlides(
      slides
    );

  } catch (error) {

    showError(
      "slidesOut",
      error
    );

  } finally {

    setBusy(
      button,
      false,
      "Generate Slides"
    );
  }
}


// =========================================================
// RENDER SLIDES
// =========================================================

function renderSlides(
  slides
) {

  state.slides =
    slides;

  const deck =
    slides
      .map(
        (slide, index) => `
          <div class="slide ${
            index === 0
              ? "active"
              : ""
          }">

            <p class="eyebrow">
              SLIDE ${index + 1}
            </p>

            <h2>
              ${escapeHTML(
                slide.title
              )}
            </h2>

            <ul>
              ${(slide.bullets || [])
                .map(
                  (bullet) =>
                    `<li>${escapeHTML(
                      bullet
                    )}</li>`
                )
                .join("")}
            </ul>

            <div class="slide-meta">
              ${index + 1} / ${slides.length}
            </div>

          </div>
        `
      )
      .join("");

  setResult(
    "slidesOut",
    `
      <div
        class="slide-deck"
        id="slideDeck"
      >
        ${deck}
      </div>

      <div class="actions">

        <button
          class="btn btn-light"
          id="prevSlide"
        >
          ← Previous
        </button>

        <button
          class="btn btn-accent"
          id="nextSlide"
        >
          Next →
        </button>

      </div>
    `
  );

  $("prevSlide")
    .addEventListener(
      "click",
      () => moveSlide(-1)
    );

  $("nextSlide")
    .addEventListener(
      "click",
      () => moveSlide(1)
    );
}


// =========================================================
// MOVE SLIDE
// =========================================================

function moveSlide(
  direction
) {

  const slides =
    [
      ...document.querySelectorAll(
        "#slideDeck .slide"
      )
    ];

  if (!slides.length) return;

  slides[
    state.slideIndex
  ].classList.remove(
    "active"
  );

  state.slideIndex =
    (
      state.slideIndex +
      direction +
      slides.length
    ) %
    slides.length;

  slides[
    state.slideIndex
  ].classList.add(
    "active"
  );
}


/* =========================================================
   TASK 4
   AI MIND MAP
   ========================================================= */

async function generateMindmap() {

  const button =
    $("generateMindmap");

  if (!requireKey()) return;

  const source =
    $("mindInput")
      .value
      .trim();

  if (!source) {

    return alert(
      "Paste your syllabus first."
    );
  }

  setBusy(
    button,
    true,
    "Mapping..."
  );

  setResult(
    "mindOut",
    "<p>Creating your hierarchy...</p>"
  );

  try {

    const data =
      parseJSON(
        await gemini(
          `
Turn this syllabus into a structured mind-map.

Return ONLY valid JSON:

{
  "root": "Main Topic",
  "branches": [
    {
      "name": "Unit 1",
      "children": [
        "topic",
        "topic"
      ]
    }
  ]
}

Do not invent topics not supported by the syllabus.

SYLLABUS:

${source}
`,
          true
        )
      );

    setResult(
      "mindOut",
      `
        <div class="mind-root">
          ${escapeHTML(
            data.root
          )}
        </div>

        ${(data.branches || [])
          .map(
            (branch) => `
              <div
                style="
                  margin:15px 0 0 20px;
                  padding:12px;
                  border-left:3px solid #b9cdbd;
                  background:#f3f6ef;
                  border-radius:0 10px 10px 0
                "
              >

                <b
                  style="color:#355942"
                >
                  ${escapeHTML(
                    branch.name
                  )}
                </b>

                <ul>
                  ${(branch.children || [])
                    .map(
                      (item) =>
                        `<li>${escapeHTML(
                          item
                        )}</li>`
                    )
                    .join("")}
                </ul>

              </div>
            `
          )
          .join("")}
      `
    );

  } catch (error) {

    showError(
      "mindOut",
      error
    );

  } finally {

    setBusy(
      button,
      false,
      "Generate Mind Map"
    );
  }
}


/* =========================================================
   TASK 5
   GOOGLE SHEETS BACKEND
   ========================================================= */

async function readSheet() {

  const url =
    $("sheetUrl")
      .value
      .trim();

  if (!url) {

    return alert(
      "Enter your Apps Script Web App URL."
    );
  }

  const button =
    $("readSheet");

  setBusy(
    button,
    true,
    "Reading..."
  );

  setResult(
    "sheetOut",
    "<p>Reading sheet data...</p>"
  );

  try {

    const response =
      await fetch(url);

    if (!response.ok) {

      throw new Error(
        `Sheet endpoint returned ${response.status}.`
      );
    }

    const data =
      await response.json();

    setResult(
      "sheetOut",
      `<pre>${escapeHTML(
        JSON.stringify(
          data,
          null,
          2
        )
      )}</pre>`
    );

  } catch (error) {

    showError(
      "sheetOut",
      error
    );

  } finally {

    setBusy(
      button,
      false,
      "Read Data"
    );
  }
}


// =========================================================
// WRITE GOOGLE SHEETS
// =========================================================

async function writeSheet() {

  const url =
    $("sheetUrl")
      .value
      .trim();

  if (!url) {

    return alert(
      "Enter your Apps Script Web App URL."
    );
  }

  let body;

  try {

    body =
      JSON.parse(
        $("sheetJson").value
      );

  } catch (_) {

    return alert(
      "Enter valid JSON first."
    );
  }

  const button =
    $("writeSheet");

  setBusy(
    button,
    true,
    "Sending..."
  );

  setResult(
    "sheetOut",
    "<p>Sending row...</p>"
  );

  try {

    const response =
      await fetch(
        url,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body: JSON.stringify(body)
        }
      );

    const text =
      await response.text();

    if (!response.ok) {

      throw new Error(
        `Sheet endpoint returned ${response.status}.`
      );
    }

    setResult(
      "sheetOut",
      `<pre>${escapeHTML(
        text
      )}</pre>`
    );

  } catch (error) {

    showError(
      "sheetOut",
      error
    );

  } finally {

    setBusy(
      button,
      false,
      "Send Row"
    );
  }
}


/* =========================================================
   TASK 6
   AI QUIZ / MCQ GENERATOR
   ========================================================= */

async function generateQuiz() {

  const button =
    $("generateQuiz");

  if (!requireKey()) return;

  const topic =
    $("quizTopic")
      .value
      .trim();

  if (!topic) {

    return alert(
      "Enter a quiz topic."
    );
  }

  setBusy(
    button,
    true,
    "Creating..."
  );

  setResult(
    "quizOut",
    "<p>Generating questions...</p>"
  );

  try {

    state.quiz =
      parseJSON(
        await gemini(
          `
Generate 8 multiple-choice questions about "${topic}".

Return ONLY valid JSON:

[
  {
    "question": "...",
    "options": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answer": 0
  }
]

The answer is the zero-based index of the correct option.
`,
          true
        )
      );

    state.quizAnswered =
      new Set();

    state.quizScore =
      0;

    renderQuiz();

  } catch (error) {

    showError(
      "quizOut",
      error
    );

  } finally {

    setBusy(
      button,
      false,
      "Generate Quiz"
    );
  }
}


// =========================================================
// RENDER QUIZ
// =========================================================

function renderQuiz() {

  setResult(
    "quizOut",
    `
      <div
        class="score"
        id="quizScore"
      >
        Score: 0 / ${state.quiz.length}
      </div>

      ${state.quiz
        .map(
          (question, index) => `
            <div
              class="quiz-question"
            >

              <b>
                ${index + 1}.
                ${escapeHTML(
                  question.question
                )}
              </b>

              <div>
                ${question.options
                  .map(
                    (option, optionIndex) => `
                      <button
                        class="quiz-option"
                        data-q="${index}"
                        data-option="${optionIndex}"
                      >
                        ${escapeHTML(
                          option
                        )}
                      </button>
                    `
                  )
                  .join("")}
              </div>

            </div>
          `
        )
        .join("")}
    `
  );

  document
    .querySelectorAll(
      ".quiz-option"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => answerQuiz(button)
        );

      }
    );
}


// =========================================================
// ANSWER QUIZ
// =========================================================

function answerQuiz(
  button
) {

  const questionIndex =
    Number(
      button.dataset.q
    );

  const optionIndex =
    Number(
      button.dataset.option
    );

  if (
    state.quizAnswered.has(
      questionIndex
    )
  ) {

    return;
  }

  state.quizAnswered.add(
    questionIndex
  );

  const correct =
    Number(
      state.quiz[
        questionIndex
      ].answer
    );

  const buttons =
    document.querySelectorAll(
      `[data-q="${questionIndex}"]`
    );

  buttons.forEach(
    (item) => {

      if (
        Number(
          item.dataset.option
        ) === correct
      ) {

        item.classList.add(
          "correct"
        );
      }

    }
  );

  if (
    optionIndex === correct
  ) {

    state.quizScore++;

  } else {

    button.classList.add(
      "wrong"
    );
  }

  $("quizScore").textContent =
    `Score: ${state.quizScore} / ${state.quiz.length}`;
}


/* =========================================================
   TASK 7
   AI DOUBT TUTOR
   ========================================================= */

async function sendChat() {

  if (!requireKey()) return;

  const input =
    $("chatInput");

  const question =
    input.value
      .trim();

  if (!question) return;

  const subject =
    $("chatSubject")
      .value
      .trim() ||
    "Computer Science";

  // Display user message.
  addChatMessage(
    "user",
    question
  );

  input.value = "";

  const history =
    state.chat
      .map(
        (item) =>
          `${item.role}: ${item.text}`
      )
      .join("\n");

  const prompt = `
You are a helpful ${subject} tutor.

Explain simply, step by step,
using examples when useful.

Keep answers focused on the student's question.

Conversation history:

${history}

Student question:

${question}
`;

  try {

    const answer =
      await gemini(prompt);

    state.chat.push(
      {
        role: "user",
        text: question
      },
      {
        role: "assistant",
        text: answer
      }
    );

    addChatMessage(
      "ai",
      answer
    );

  } catch (error) {

    addChatMessage(
      "ai",
      `Error: ${error.message}`
    );
  }
}


// =========================================================
// ADD CHAT MESSAGE
// =========================================================

function addChatMessage(
  role,
  text
) {

  const box =
    $("chatBox");

  const empty =
    box.querySelector(
      ".chat-empty"
    );

  if (empty) {
    empty.remove();
  }

  const div =
    document.createElement(
      "div"
    );

  div.className =
    `message ${role}`;

  div.innerHTML =
    role === "ai"
      ? markdown(text)
      : escapeHTML(text);

  box.appendChild(div);

  box.scrollTop =
    box.scrollHeight;
}


// =========================================================
// CLEAR CHAT
// =========================================================

function clearChat() {

  state.chat = [];

  $("chatBox").innerHTML =
    `
      <div class="chat-empty">
        Ask your first question below.
      </div>
    `;
}


/* =========================================================
   TASK 8
   AI FLASHCARDS
   ========================================================= */

async function generateFlashcards() {

  const button =
    $("generateFlashcards");

  if (!requireKey()) return;

  const source =
    $("flashInput")
      .value
      .trim();

  if (!source) {

    return alert(
      "Paste some study material first."
    );
  }

  setBusy(
    button,
    true,
    "Creating..."
  );

  $("flashOut").innerHTML =
    "<p>Generating flashcards...</p>";

  try {

    state.flashcards =
      parseJSON(
        await gemini(
          `
Create 10 revision flashcards from this material.

Return ONLY valid JSON:

[
  {
    "question": "...",
    "answer": "..."
  }
]

Use only information supported by the material.

MATERIAL:

${source}
`,
          true
        )
      );

    renderFlashcards();

  } catch (error) {

    $("flashOut").innerHTML =
      `
        <div class="notice">
          ${escapeHTML(
            error.message
          )}
        </div>
      `;

  } finally {

    setBusy(
      button,
      false,
      "Generate Cards"
    );
  }
}


// =========================================================
// RENDER FLASHCARDS
// =========================================================

function renderFlashcards() {

  $("flashOut").innerHTML =
    state.flashcards
      .map(
        (card) => `
          <div
            class="flashcard"
            title="Click to flip"
          >

            <div
              class="flash-inner"
            >

              <div
                class="flash-face"
              >
                <b>
                  ${escapeHTML(
                    card.question
                  )}
                </b>
              </div>

              <div
                class="flash-face back"
              >
                ${escapeHTML(
                  card.answer
                )}
              </div>

            </div>

          </div>
        `
      )
      .join("");

  document
    .querySelectorAll(
      ".flashcard"
    )
    .forEach(
      (card) => {

        card.addEventListener(
          "click",
          () => {

            card.classList.toggle(
              "flipped"
            );

          }
        );

      }
    );
}


// =========================================================
// SHUFFLE FLASHCARDS
// =========================================================

function shuffleFlashcards() {

  if (
    !state.flashcards.length
  ) {

    return;
  }

  state.flashcards.sort(
    () => Math.random() - 0.5
  );

  renderFlashcards();
}


/* =========================================================
   TASK 9
   AI STUDY PLANNER
   ========================================================= */

async function generatePlan() {

  const button =
    $("generatePlan");

  if (!requireKey()) return;

  setBusy(
    button,
    true,
    "Planning..."
  );

  setResult(
    "planOut",
    "<p>Creating your timetable...</p>"
  );

  const prompt = `
Create a practical 7-day study timetable.

Subjects:
${$("planSubjects").value}

Hours available per day:
${$("planHours").value}

Target/exam date:
${$("planDate").value}

Preferences or weak subjects:
${$("planExtra").value}

Return ONLY valid JSON array:

[
  {
    "day": "Monday",
    "time": "7:00-8:00",
    "subject": "DBMS",
    "task": "Revise joins"
  }
]

Balance subjects and include realistic tasks.
`;

  try {

    const rows =
      parseJSON(
        await gemini(
          prompt,
          true
        )
      );

    setResult(
      "planOut",
      `
        <div class="table-wrap">

          <table>

            <thead>

              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Task</th>
              </tr>

            </thead>

            <tbody>

              ${rows
                .map(
                  (row) => `
                    <tr>

                      <td>
                        ${escapeHTML(
                          row.day
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          row.time
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          row.subject
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          row.task
                        )}
                      </td>

                    </tr>
                  `
                )
                .join("")}

            </tbody>

          </table>

        </div>
      `
    );

  } catch (error) {

    showError(
      "planOut",
      error
    );

  } finally {

    setBusy(
      button,
      false,
      "Generate Timetable"
    );
  }
}


/* =========================================================
   TASK 10
   OCR PHOTO NOTES SUMMARIZER
   ========================================================= */

// Preview selected image.
function previewOCR(
  event
) {

  const file =
    event.target.files[0];

  if (!file) return;

  const image =
    $("ocrPreview");

  image.src =
    URL.createObjectURL(
      file
    );

  image.classList.remove(
    "hidden"
  );
}


// =========================================================
// RUN OCR
// =========================================================

async function runOCR() {

  const file =
    $("ocrFile")
      .files[0];

  if (!file) {

    return alert(
      "Choose a note image first."
    );
  }

  if (!window.Tesseract) {

    return alert(
      "OCR library is still loading. Try again."
    );
  }

  $("ocrStatus").textContent =
    "OCR is running in your browser...";

  try {

    const result =
      await Tesseract.recognize(
        file,
        "eng",
        {

          logger: (info) => {

            if (info.status) {

              $("ocrStatus").textContent =
                `OCR: ${info.status} ${Math.round(
                  (info.progress || 0) * 100
                )}%`;
            }

          }

        }
      );

    $("ocrText").value =
      result.data.text;

    $("ocrStatus").textContent =
      "OCR complete. You can correct the text before summarizing.";

  } catch (error) {

    $("ocrStatus").textContent =
      `OCR failed: ${error.message}`;
  }
}


// =========================================================
// SUMMARIZE OCR TEXT WITH GEMINI
// =========================================================

async function summarizeOCR() {

  const button =
    $("summarizeOCR");

  if (!requireKey()) return;

  const text =
    $("ocrText")
      .value
      .trim();

  if (!text) {

    return alert(
      "Extract or enter text first."
    );
  }

  setBusy(
    button,
    true,
    "Summarizing..."
  );

  setResult(
    "ocrOut",
    "<p>Creating summary...</p>"
  );

  try {

    const result =
      await gemini(`
Summarize these notes into concise study points with headings and bullets.

Do not invent facts.

NOTES:

${text}
`);

    setResult(
      "ocrOut",
      markdown(result)
    );

  } catch (error) {

    showError(
      "ocrOut",
      error
    );

  } finally {

    setBusy(
      button,
      false,
      "Summarize with Gemini"
    );
  }
}


/* =========================================================
   UTILITY
   DOWNLOAD TEXT FILE
   ========================================================= */

function downloadTextFile(
  filename,
  text
) {

  const blob =
    new Blob(
      [text],
      {
        type:
          "text/plain;charset=utf-8"
      }
    );

  const link =
    document.createElement(
      "a"
    );

  link.href =
    URL.createObjectURL(
      blob
    );

  link.download =
    filename;

  link.click();

  URL.revokeObjectURL(
    link.href
  );
}