const projectData = {
    prompts: [
        { id: 'pulse', name: 'Pulsing Circle' },
        { id: 'clock', name: 'Digital Clock' },
        { id: 'gradient', name: 'Gradient Button' }
    ],
    costs: { tokens: 2.0, hardware: 20, co2: 550 },
    trainingData: {
        name: "root", children: [
            { name: "Code", children: [ { name: "Python", value: 30 }, { name: "JavaScript", value: 25 }, { name: "Java", value: 15 }, { name: "C++", value: 10 }, { name: "Other", value: 20 } ] },
            { name: "Natural Language", children: [ { name: "Web Text", value: 40 }, { name: "Books", value: 20 }, { name: "Academic", value: 25 }, { name: "Conversations", value: 15 } ] }
        ]
    },
    benchmarks: [
        { name: "Model A", value: 55.2 }, { name: "Model B", value: 68.1 }, { name: "DeepSeek", value: 73.8 }, { name: "Model C", value: 82.1 }
    ],
    codeOutputs: {
        pulse: `<!-- HTML -->\n<div class="pulsing-circle"></div>\n\n/* CSS */\nbody {\n  display: grid;\n  place-items: center;\n  height: 100vh;\n  margin: 0;\n  background: transparent;\n}\n\n.pulsing-circle {\n  width: 100px;\n  height: 100px;\n  background-color: #00c7ff;\n  border-radius: 50%;\n  animation: pulse 2s infinite ease-in-out;\n}\n\n@keyframes pulse {\n  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 199, 255, 0.7); }\n  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 199, 255, 0); }\n  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 199, 255, 0); }\n}\n\n// JavaScript (Not required)`,
        clock: `<!-- HTML -->\n<div id="clock-display"></div>\n\n/* CSS */\nbody { display: grid; place-items: center; height: 100vh; margin: 0; background: transparent; }\n\n#clock-display {\n  font-family: 'JetBrains Mono', monospace;\n  font-size: 4rem;\n  color: #e2e8f0;\n  text-shadow: 0 0 10px #00c7ff;\n}\n\n.light #clock-display { color: #1e293b; }\n\n// JavaScript\nfunction updateClock() {\n  const now = new Date();\n  const timeString = now.toLocaleTimeString();\n  document.getElementById('clock-display').textContent = timeString;\n}\n\nsetInterval(updateClock, 1000);\nupdateClock();`,
        gradient: `<!-- HTML -->\n<button class="gradient-btn">Hover Me</button>\n\n/* CSS */\nbody { display: grid; place-items: center; height: 100vh; margin: 0; background: transparent; }\n\n.gradient-btn {\n  background-image: linear-gradient(to right, #00c7ff 0%, #a78bfa 51%, #f471b5 100%);\n  border: none;\n  color: white;\n  padding: 15px 32px;\n  font-size: 16px;\n  border-radius: 8px;\n  transition: all 0.4s ease;\n  background-size: 200% auto;\n  font-family: 'Satoshi', sans-serif;\n  font-weight: 700;\n  cursor: pointer;\n}\n\n.gradient-btn:hover {\n  background-position: right center;\n  transform: scale(1.1);\n  box-shadow: 0 10px 20px rgba(0,0,0,0.2);\n}\n\n// JavaScript (Not required)`,
        broken: `<!-- HTML -->\n<div class="glitch">Error</div>\n\n/* CSS */\n.glitch { color: #f471b5; font-weight: bold; animation: glitch 1s linear infinite; }\n\n@keyframes glitch{\n  0%,100%{transform:translate(0)}\n  20%,60%{transform:translate(-2px,2px)}\n  40%,80%{transform:translate(2px,-2px)}\n}\n\n// JavaScript\nconsole.error("Model component disabled.");`
    }
};