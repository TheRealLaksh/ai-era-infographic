# DeepSeek: The Anatomy of AI (Live Edition)

An interactive, single-page infographic that provides a deep dive into the architecture of a modern AI. This version features a prompt-first workflow, a fully functional code editor, a dynamic "data stream" background, and a real-time code generation simulation.

## ✨ Features

-   **Intuitive User Flow:** Select a task from the "Prompt" section first, then generate the code into the live editor directly below.
-   **Live Code Editor (Ace):** View, edit, and run code in a professional editor environment with syntax highlighting.
-   **Dynamic "Digital Stream" Background:** A generative, constantly moving background that makes the entire page feel alive.
-   **Real-Time Code Generation:** After selecting a prompt, click "Generate" to watch the AI write the code line-by-line in the editor.
-   **Advanced Data Visualizations (D3.js):**
    -   An interactive sunburst chart to explore the AI's training data.
    -   An animated bar chart comparing model performance on benchmarks.
-   **Interactive Architecture:** Toggle model components on/off to see how it affects the "AI's" output.

## 🛠️ Tech Stack

-   **Core:** HTML5, CSS3, JavaScript (ES6+)
-   **Code Editor:** [Ace Editor](https://ace.c9.io/)
-   **Animation:** [GSAP](https://gsap.com/)
-   **Data Visualization:** [D3.js](https://d3js.org/)

## 🚀 How to Run (Very Important!)

1.  Create a project folder. Inside it, create `index.html`, a `css` folder, and a `js` folder.
2.  Place the code for `style.css` inside the `css` folder.
3.  Place the code for `live-background.js`, `data.js`, `visualizations.js`, and `main.js` inside the `js` folder.
4.  **You must run this project from a local server.**
    * **Easy Method (VS Code):** Install the "Live Server" extension. Right-click on `index.html` and choose "Open with Live Server."
    * **Python Method:** In your terminal, navigate to the project folder and run `python -m http.server`. Then open `http://localhost:8000` in your browser.