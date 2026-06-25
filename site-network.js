(() => {
  const canvas = document.getElementById("site-network");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let ratio = 1;
  let nodes = [];
  let frameId = 0;

  const settings = {
    desktopNodes: 68,
    mobileNodes: 34,
    maxDistance: 165,
    speed: 0.18
  };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    ratio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    createNodes();
  }

  function createNodes() {
    const count = width < 700 ? settings.mobileNodes : settings.desktopNodes;
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * settings.speed,
      vy: (Math.random() - 0.5) * settings.speed,
      radius: 1 + Math.random() * 1.7,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function update(node) {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x <= 0 || node.x >= width) node.vx *= -1;
    if (node.y <= 0 || node.y >= height) node.vy *= -1;
  }

  function drawConnections() {
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance > settings.maxDistance) continue;

        const opacity = (1 - distance / settings.maxDistance) * 0.14;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(111, 104, 219, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  function drawNode(node, time) {
    const pulse = 0.8 + Math.sin(time * 0.0016 + node.phase) * 0.18;
    const glowRadius = node.radius * 5;
    const glow = ctx.createRadialGradient(
      node.x, node.y, 0,
      node.x, node.y, glowRadius
    );

    glow.addColorStop(0, "rgba(145, 132, 255, 0.62)");
    glow.addColorStop(1, "rgba(145, 132, 255, 0)");

    ctx.beginPath();
    ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(150, 140, 255, 0.72)";
    ctx.fill();
  }

  function animate(time = 0) {
    ctx.clearRect(0, 0, width, height);
    nodes.forEach(update);
    drawConnections();
    nodes.forEach((node) => drawNode(node, time));
    frameId = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frameId);
    else frameId = requestAnimationFrame(animate);
  });

  resize();
  animate();
})();
