const canvas = document.getElementById('live-background');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let columns = Math.floor(canvas.width / 20);
let drops = Array(columns).fill(1);
const chars = '01'; 
function drawBackground() {
    ctx.fillStyle = document.body.classList.contains('dark') ? 'rgba(2, 4, 20, 0.05)' : 'rgba(238, 242, 249, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = document.body.classList.contains('dark') ? '#00c7ff' : '#0ea5e9';
    ctx.font = '15px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * 20, drops[i] * 20);
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
let animationInterval = setInterval(drawBackground, 50);
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / 20);
    drops = Array(columns).fill(1);
});