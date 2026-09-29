# AI Classroom Lab

AI Classroom Lab is a student-focused web application that combines 10 small AI-powered classroom tools into one workspace.

The project demonstrates how HTML, CSS, JavaScript, Gemini API, browser-based OCR, and Google Apps Script can be combined to build practical AI applications.

The application is designed as a frontend project that can be run locally in VS Code and deployed publicly using GitHub Pages.

---

## Project Overview

The goal of this project is to provide students with a single website where they can perform common academic tasks using AI.

Instead of creating ten separate websites, all ten tasks are available from one dashboard.

The application follows a simple workflow:

```text
User
  ↓
Selects an AI Tool
  ↓
Enters Information
  ↓
Gemini API processes the request
  ↓
AI-generated result
  ↓
Result displayed on the webpage
```

For example:

```text
Student enters a syllabus
        ↓
AI Mind Map tool
        ↓
Gemini generates structured topics
        ↓
JavaScript processes the response
        ↓
Mind-map style result appears on screen
```

---

# Features

The project contains 10 AI-powered tools.

## 1. AI Resume Builder

The user enters:

* Name
* Contact information
* Education
* Skills
* Experience / Projects
* Career objective

The information is sent to Gemini with a resume-generation prompt.

The generated resume is displayed on the webpage and can also be downloaded as a PDF.

---

## 2. AI Notes Generator

The student can paste:

* Textbook content
* Lecture notes
* Topic explanations
* Chapter content

Gemini converts the content into structured study notes with:

* Headings
* Bullet points
* Definitions
* Important concepts
* Examples where appropriate

The generated notes can be copied or downloaded as a text file.

---

## 3. AI Presentation Generator

The student enters a presentation topic.

Gemini generates approximately six slides containing:

* Slide title
* Main points
* Supporting bullet points

The slides are displayed directly inside the website.

Previous and Next buttons allow the student to move through the presentation.

The browser print function can also be used to save the presentation as a PDF.

---

## 4. AI Mind Map Generator

The student pastes a syllabus or topic list.

Gemini converts it into a hierarchical structure:

```text
Main Topic
│
├── Unit 1
│   ├── Topic A
│   ├── Topic B
│   └── Topic C
│
├── Unit 2
│   ├── Topic A
│   └── Topic B
│
└── Unit 3
    ├── Topic A
    └── Topic B
```

JavaScript then displays this structure as a visual-style study map.

---

## 5. Google Sheets Backend

This section demonstrates how a frontend can communicate with Google Sheets through Google Apps Script.

The user provides a deployed Google Apps Script Web App URL.

The application can:

* Read data from the endpoint
* Send JSON data to the endpoint
* Display the returned response

Example data:

```json
{
  "name": "Student",
  "marks": 85
}
```

This demonstrates the concept of using Google Sheets as a lightweight backend.

---

## 6. AI Quiz / MCQ Generator

The student enters a topic.

Gemini generates multiple-choice questions in JSON format.

The website dynamically creates:

* Questions
* Four options
* Correct/incorrect feedback
* Score tracking

Example:

```text
Question:
What is SQL?

A. Programming language
B. Database query language
C. Operating system
D. Web browser
```

The student receives immediate feedback after selecting an answer.

---

## 7. AI Subject Doubt Tutor

This tool works like a simple AI tutor.

The student selects or enters a subject and asks questions.

The application maintains conversation history so follow-up questions can use the previous context.

Example:

```text
Student:
What is polymorphism?

AI:
Polymorphism means...

Student:
Give me a simple example.

AI:
Here is an example...
```

A Clear button is provided to start a new conversation.

---

## 8. AI Flashcard Generator

The student provides study material.

Gemini generates question-answer flashcards.

The cards use a browser-based flip animation.

The front contains the question:

```text
What is inheritance?
```

Clicking the card reveals the answer:

```text
Inheritance allows a class to acquire
properties and methods from another class.
```

Cards can also be shuffled for revision.

---

## 9. AI Study Planner

The student enters:

* Subjects
* Available study hours
* Exam / target date
* Preferred study time
* Weak subjects or additional requirements

Gemini generates a seven-day study timetable.

The result is displayed in a table containing:

```text
Day | Time | Subject | Task
```

This demonstrates how AI-generated structured JSON can be converted into a usable webpage interface.

---

## 10. AI Notes Summarizer from Photos

The student uploads a photo of handwritten or printed notes.

The application uses Tesseract.js to perform OCR directly in the browser.

The workflow is:

```text
Image
  ↓
Tesseract.js OCR
  ↓
Extracted Text
  ↓
Student can correct the text
  ↓
Gemini
  ↓
Concise Study Summary
```

The OCR text is displayed before summarization so the student can correct any recognition errors.

---

# Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* Responsive CSS
* DOM manipulation
* Fetch API

## AI

* Google Gemini API

## Browser Libraries

### Marked.js

Used to convert Markdown responses into formatted HTML.

### Tesseract.js

Used for browser-based OCR in the photo notes summarizer.

### jsPDF

Used for PDF generation for the resume.

### Google Fonts

Used for the application's typography.

---

# Project Structure

```text
AI-Classroom-Lab/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
└── README.md
```

---

# What Each File Does

## index.html

This is the main webpage.

It contains:

* Header
* Sidebar navigation
* Gemini API key section
* All 10 tool interfaces
* Input forms
* Buttons
* Output areas
* External library references

The HTML file connects the CSS and JavaScript files:

```html
<link rel="stylesheet" href="css/style.css">
```

and:

```html
<script src="js/app.js"></script>
```

---

## css/style.css

This file controls the complete visual design.

It contains:

* Colors
* Typography
* Sidebar design
* Cards
* Buttons
* Forms
* Responsive layout
* Chat interface
* Flashcard animation
* Presentation slides
* Tables
* Mobile layout

Keeping CSS separate makes the project easier to maintain and customize.

---

## js/app.js

This is the main application logic.

It handles:

* Gemini API communication
* API key management
* Navigation
* Resume generation
* Notes generation
* Presentation generation
* Mind map generation
* Google Sheets requests
* Quiz generation
* Chatbot conversation
* Flashcards
* Study planner
* OCR
* PDF download
* Text download

---

# Personalizing the Project

The college / institute name can be changed from one place.

Open:

```text
js/app.js
```

Find:

```javascript
const COLLEGE_NAME = "Student Innovation Studio";
```

Change it to your college name.

For example:

```javascript
const COLLEGE_NAME = "Maharishi Markandeshwar University";
```

The application automatically uses this name in the relevant UI areas.

You can also customize:

* Colors
* Logo
* Text
* Footer
* Tool names
* Descriptions

from `index.html` and `css/style.css`.

---

# Gemini API Key

This application is designed so that every user can provide their own Gemini API key.

The key is entered through the website:

```text
Gemini API Key
       ↓
Connect
       ↓
AI tools become available
```

The key is stored in:

```javascript
sessionStorage
```

for the current browser session.

A real API key should NOT be written directly inside:

```text
index.html
```

or:

```text
js/app.js
```

For example, do not do this:

```javascript
const API_KEY = "YOUR_REAL_API_KEY";
```

The website instead asks the user to enter their own key.

### Important security note

This is appropriate for a classroom / educational demonstration where users provide their own API keys.

For a production application used by the general public, API requests should normally be handled through a secure backend or server-side proxy with appropriate authentication, quota controls, and API-key restrictions.

---

# Running the Project in VS Code

## Step 1 — Open the project

Open the:

```text
AI-Classroom-Lab
```

folder in VS Code.

You should see:

```text
index.html
css/
js/
README.md
```

---

## Step 2 — Run the website

You can open:

```text
index.html
```

directly in a browser.

For development, using the VS Code Live Server extension is recommended.

For example:

```text
Right Click index.html
        ↓
Open with Live Server
```

The website should open in your browser.

---

## Step 3 — Connect Gemini

Inside the website:

1. Enter your Gemini API key.
2. Select the Gemini model.
3. Click **Connect**.
4. Open any AI tool.
5. Enter the required information.
6. Generate the result.

---

# Internet Requirement

The project requires an internet connection because it communicates with:

* Gemini API
* Marked.js CDN
* Tesseract.js CDN
* jsPDF CDN
* Google Fonts

The website itself is frontend-based, but the AI generation requires access to the Gemini API.

---

# GitHub Pages Deployment

The project can be hosted using GitHub Pages.

The repository should maintain this structure:

```text
AI-Classroom-Lab/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

## Steps

1. Create a GitHub repository.
2. Upload the complete project.
3. Make sure `index.html` is in the repository root.
4. Open repository **Settings**.
5. Open **Pages**.
6. Select deployment from the `main` branch.
7. Select the root folder.
8. Save the settings.
9. GitHub will provide the public website URL.

Example:

```text
https://yourusername.github.io/AI-Classroom-Lab/
```

Anyone with the URL can open the website.

Each person can then enter their own Gemini API key.

---

# How the Application Works

The general AI request flow is:

```text
             ┌─────────────────┐
             │     Student     │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │   HTML Form     │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │ JavaScript      │
             │ Prompt Builder  │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │  Gemini API     │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │ AI Response     │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │ JavaScript      │
             │ Response Parser │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │ Webpage Output  │
             └─────────────────┘
```

Some tools use structured JSON responses.

For example, the quiz generator requests:

```json
[
  {
    "question": "What is SQL?",
    "options": [
      "Database query language",
      "Operating system",
      "Browser",
      "Compiler"
    ],
    "answer": 0
  }
]
```

JavaScript then reads the JSON and creates the quiz interface dynamically.

---

# Learning Objectives

This project demonstrates several important web development and AI concepts:

* HTML form creation
* CSS responsive design
* JavaScript DOM manipulation
* Event handling
* Fetch API
* REST API communication
* Prompt engineering
* Structured AI responses
* JSON parsing
* Dynamic UI generation
* Browser-based OCR
* PDF generation
* Client-side storage
* Google Apps Script integration
* GitHub Pages deployment

---

# Assignment Connection

The project combines the ten classroom AI tasks into one application.

The overall concept follows the assignment pattern:

```text
User Input
    ↓
AI Prompt
    ↓
AI API
    ↓
Structured AI Output
    ↓
Dynamic Webpage
```

Instead of creating a separate webpage for each task, all tasks are accessible through the same AI Classroom Lab interface.

---

# Limitations

This project is primarily designed as a student / classroom project.

Some limitations include:

* Users must provide their own Gemini API key.
* AI responses depend on the selected Gemini model.
* Internet access is required.
* OCR accuracy depends on image quality and handwriting.
* Google Sheets functionality requires a correctly deployed Apps Script Web App.
* Public production use would require stronger backend security and API management.

---

# Future Improvements

Possible future improvements include:

* User authentication
* Database integration
* Saved notes and resumes
* Downloadable PowerPoint files
* User dashboards
* Dark mode
* More AI models
* Secure backend API proxy
* Cloud database
* AI-generated charts
* Teacher dashboard
* Student progress tracking
* Assignment history
* File upload support
* Better visual mind maps

---

# Author

**AI Classroom Lab**

A student project demonstrating practical integration of:

**Web Development + Generative AI + Browser APIs + Cloud Services**

Built for educational and classroom use.
