document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    let state = {
        promptId: null,
        disabledArchComponents: new Set()
    };

    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const suggestionContainer = document.getElementById('prompt-suggestions');
    const sandboxOutput = document.getElementById('sandbox-output');
    const generateCodeBtn = document.getElementById('generate-code-btn');
    const runCodeBtn = document.getElementById('run-code-btn');
    const shareBtn = document.getElementById('share-btn');
    const costTokens = document.getElementById('cost-tokens');
    const costHardware = document.getElementById('cost-hardware');
    const costCo2 = document.getElementById('cost-co2');

    const editor = ace.edit("code-editor");
    editor.setOptions({ fontFamily: "JetBrains Mono", fontSize: "14px", useWorker: false });

    function applyTheme(theme) {
        body.className = theme;
        localStorage.setItem('theme', theme);
        editor.setTheme(theme === 'dark' ? "ace/theme/tomorrow_night_bright" : "ace/theme/chrome");
    }
    themeToggle.addEventListener('click', () => applyTheme(body.classList.contains('dark') ? 'light' : 'dark'));
    applyTheme(localStorage.getItem('theme') || 'dark');

    function updateActivePromptButton() {
        document.querySelectorAll('#prompt-suggestions button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.promptId === state.promptId);
        });
        generateCodeBtn.classList.toggle('active', !!state.promptId);
    }

    projectData.prompts.forEach(prompt => {
        const button = document.createElement('button');
        button.textContent = prompt.name;
        button.dataset.promptId = prompt.id;
        button.onclick = () => {
            state.promptId = prompt.id;
            updateActivePromptButton();
        };
        suggestionContainer.appendChild(button);
    });
    
    function typeCode(fullCode) {
        let i = 0;
        editor.setValue('');
        const interval = setInterval(() => {
            if (i < fullCode.length) {
                editor.session.insert(editor.getCursorPosition(), fullCode[i]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 5); 
    }

    generateCodeBtn.addEventListener('click', () => {
        if (!state.promptId) return;
        const outputKey = state.disabledArchComponents.size > 0 ? 'broken' : state.promptId;
        const code = projectData.codeOutputs[outputKey] || projectData.codeOutputs.pulse;
        typeCode(code);
    });

    runCodeBtn.addEventListener('click', () => {
        const fullCode = editor.getValue();
        const htmlMatch = fullCode.match(/<!-- HTML -->([\s\S]*?)\/\* CSS \*\//);
        const cssMatch = fullCode.match(/\/\* CSS \*\/([\s\S]*?)\/\/ JavaScript/);
        const jsMatch = fullCode.match(/\/\/ JavaScript([\s\S]*)/);
        const html = htmlMatch ? htmlMatch[1].trim() : '';
        const css = cssMatch ? cssMatch[1].trim() : '';
        const js = jsMatch ? jsMatch[1].trim() : '';
        sandboxOutput.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%'; iframe.style.height = '100%'; iframe.style.border = 'none';
        sandboxOutput.appendChild(iframe);
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`<style>${css}</style><body>${html}</body><script>${js}<\/script>`);
        doc.close();
    });

    function setupArchitectureInteraction() {
        const archContainer = document.getElementById('architecture-container');
        archContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('active')) {
                const id = e.target.dataset.id;
                e.target.classList.toggle('disabled');
                state.disabledArchComponents.has(id) ? state.disabledArchComponents.delete(id) : state.disabledArchComponents.add(id);
                editor.setValue('// Architecture changed. Click "Generate Code" to see the result.');
            }
        });
    }

    shareBtn.addEventListener('click', () => {
        const url = new URL(window.location);
        if (state.promptId) url.searchParams.set('promptId', state.promptId);
        navigator.clipboard.writeText(url.toString()).then(() => {
            shareBtn.textContent = 'Copied!';
            setTimeout(() => { shareBtn.textContent = 'Share'; }, 2000);
        });
    });

    function checkURLForPrompt() {
        const params = new URLSearchParams(window.location.search);
        const sharedPromptId = params.get('promptId');
        if (sharedPromptId && projectData.prompts.find(p => p.id === sharedPromptId)) {
            state.promptId = sharedPromptId;
        }
    }

    function init() {
        checkURLForPrompt();
        updateActivePromptButton();
        editor.setValue(`// Welcome!\n// 1. Select a prompt below.\n// 2. Click "Generate Code" to begin.`);

        const costTl = gsap.timeline({ scrollTrigger: { trigger: "#cost-of-intelligence", start: "top 80%", toggleActions: "play none none none" } });
        costTl.to(costTokens, { textContent: projectData.costs.tokens, duration: 2, ease: "power1.inOut", snap: { textContent: 0.1 } });
        costTl.to(costHardware, { textContent: projectData.costs.hardware, duration: 2, ease: "power1.inOut", snap: { textContent: 1 } }, "<");
        costTl.to(costCo2, { textContent: projectData.costs.co2, duration: 2, ease: "power1.inOut", snap: { textContent: 1 } }, "<");
        
        ScrollTrigger.create({ trigger: "#training-data", start: "top 80%", onEnter: () => createSunburstChart(projectData.trainingData), once: true });
        ScrollTrigger.create({ trigger: "#architecture", start: "top 80%", onEnter: () => { createArchitectureDiagram(); setupArchitectureInteraction(); }, once: true });
        ScrollTrigger.create({ trigger: "#model-showdown", start: "top 80%", onEnter: () => createBenchmarkChart(projectData.benchmarks), once: true });

        gsap.utils.toArray('.section-container').forEach(section => {
            gsap.from(section, { opacity: 0, y: 50, duration: 1, scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' } });
        });
    }

    init();
});