function createSunburstChart(data) {
    const container = d3.select("#sunburst-chart-container");
    container.html('');
    const width = container.node().getBoundingClientRect().width;
    const height = 400;
    const radius = Math.min(width, height) / 2;
    const svg = container.append("svg").attr("width", width).attr("height", height).append("g").attr("transform", `translate(${width / 2},${height / 2})`);
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateCool, data.children.length + 1));
    const hierarchy = d3.hierarchy(data).sum(d => d.value).sort((a, b) => b.value - a.value);
    const root = d3.partition().size([2 * Math.PI, hierarchy.height + 1])(hierarchy);
    root.each(d => d.current = d);
    const arc = d3.arc().startAngle(d => d.x0).endAngle(d => d.x1).padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005)).padRadius(radius * 1.5).innerRadius(d => d.y0 * radius).outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));
    const path = svg.append("g").selectAll("path").data(root.descendants().slice(1)).join("path").attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); }).attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.7 : 0.5) : 0).attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none").attr("d", d => arc(d.current));
    path.filter(d => d.children).style("cursor", "pointer").on("click", clicked);
    const label = svg.append("g").attr("pointer-events", "none").attr("text-anchor", "middle").style("user-select", "none").selectAll("text").data(root.descendants().slice(1)).join("text").attr("dy", "0.35em").attr("fill-opacity", d => +labelVisible(d.current)).attr("transform", d => labelTransform(d.current)).text(d => d.data.name);
    const parent = svg.append("circle").datum(root).attr("r", radius).attr("fill", "none").attr("pointer-events", "all").on("click", clicked);
    function clicked(event, p) {
        parent.datum(p.parent || root);
        root.each(d => d.target = { x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI, x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI, y0: Math.max(0, d.y0 - p.depth), y1: Math.max(0, d.y1 - p.depth) });
        const t = svg.transition().duration(750);
        path.transition(t).tween("data", d => { const i = d3.interpolate(d.current, d.target); return t => d.current = i(t); }).filter(function(d) { return +this.getAttribute("fill-opacity") || arcVisible(d.target); }).attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.7 : 0.5) : 0).attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none").attrTween("d", d => () => arc(d.current));
        label.filter(function(d) { return +this.getAttribute("fill-opacity") || labelVisible(d.target); }).transition(t).attr("fill-opacity", d => +labelVisible(d.target)).attrTween("transform", d => () => labelTransform(d.current));
    }
    function arcVisible(d) { return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0; }
    function labelVisible(d) { return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03; }
    function labelTransform(d) { const x = (d.x0 + d.x1) / 2 * 180 / Math.PI; const y = (d.y0 + d.y1) / 2 * radius; return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`; }
}
function createBenchmarkChart(data) {
    const container = d3.select("#benchmark-chart-container");
    container.html('');
    const margin = {top: 20, right: 30, bottom: 40, left: 90}, width = container.node().getBoundingClientRect().width - margin.left - margin.right, height = 300 - margin.top - margin.bottom;
    const svg = container.append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const y = d3.scaleBand().range([0, height]).domain(data.map(d => d.name)).padding(.1);
    svg.append("g").call(d3.axisLeft(y));
    const x = d3.scaleLinear().domain([0, 100]).range([0, width]);
    svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient").attr("id", "bar-gradient").attr("gradientTransform", "rotate(90)");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "var(--accent-color-tertiary)");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "var(--accent-color-secondary)");
    svg.selectAll("myRect").data(data).join("rect").attr("y", d => y(d.name)).attr("height", y.bandwidth()).attr("fill", (d) => d.name === "DeepSeek" ? "url(#bar-gradient)" : "var(--panel-border-hover)").attr("width", 0).transition().duration(800).delay((d, i) => i * 150).attr("width", d => x(d.value));
}
function createArchitectureDiagram() {
    const container = d3.select("#architecture-container");
    container.html(`<svg viewBox="0 0 400 200" style="width: 100%; height: auto;"><defs><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"></feGaussianBlur><feMerge><feMergeNode in="coloredBlur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><style>.comp { fill: var(--panel-bg); stroke: var(--panel-border); rx: 5; transition: all 0.3s; }.comp.active:hover { stroke: var(--accent-color); cursor: pointer; filter: url(#glow); }.comp.disabled { fill: #475569; stroke: #475569; opacity: 0.5; }.comp-text { font-family: var(--font-body); fill: var(--text-color-muted); font-size: 10px; pointer-events: none; user-select: none; }.flow-line { stroke: var(--text-color-muted); stroke-width: 1; marker-end: url(#arrow); }#arrow path { fill: var(--text-color-muted); }</style><defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs><rect id="arch-input" class="comp active" data-id="input" x="20" y="80" width="100" height="40"></rect><text class="comp-text" x="45" y="105">Input & Tokens</text><rect id="arch-attention" class="comp active" data-id="attention" x="150" y="80" width="100" height="40"></rect><text class="comp-text" x="165" y="105">Attention</text><rect id="arch-output" class="comp active" data-id="output" x="280" y="80" width="100" height="40"></rect><text class="comp-text" x="310" y="105">Output Layer</text><line class="flow-line" x1="120" y1="100" x2="150" y2="100"></line><line class="flow-line" x1="250" y1="100" x2="280" y2="100"></line></svg>`);
}