// Wait for the DOM to load before running scripts
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set initial canvas dimensions
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let mouse = { x: null, y: null };
  let particles = [];
  const particleCount = 150;
  const connectionDistance = 100;
  const mouseInteractionRadius = 100;
  
  // Debounce function to limit resize events
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  // Particle class definition with mouse interaction
  class Particle {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.radius = 2;
    }
    update() {
      // Mouse interaction: repulsion force when near the cursor
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouseInteractionRadius && distance > 0) {
          // Calculate normalized direction vector
          const forceMagnitude = (mouseInteractionRadius - distance) / mouseInteractionRadius;
          const forceX = (dx / distance) * forceMagnitude;
          const forceY = (dy / distance) * forceMagnitude;
          // Adjust velocities by the force
          this.vx += forceX;
          this.vy += forceY;
        }
      }
      
      // Update position with velocity
      this.x += this.vx * 0.5;
      this.y += this.vy * 0.5;
      
      // Reverse direction on hitting canvas boundaries
      if (this.x <= 0 || this.x >= width) this.vx *= -1;
      if (this.y <= 0 || this.y >= height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      // In light mode, use default styling
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.fillStyle = "rgb(150, 0, 255)";
      ctx.fill();
    }
  }
  
  // Create initial particles
  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const vx = (Math.random() - 0.5) * 2;
      const vy = (Math.random() - 0.5) * 2;
      particles.push(new Particle(x, y, vx, vy));
    }
  }
  
  createParticles();
  
  // Connect particles that are close to each other
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < connectionDistance) {
          ctx.strokeStyle = "rgba(150, 0, 255, 0.5)";
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Animation loop for particle movement
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Update mouse position on movement
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  // Adjust canvas size on window resize using debounce
  window.addEventListener('resize', debounce(() => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }, 250));
  
  // Simulate advancing to the next page when advance button is clicked
  function advance() {
    console.log("Advance button clicked. Navigating to next page...");
    window.location.href = "next.html";
  }
  
  // Attach event listener to advance button
  document.getElementById("advance").addEventListener("click", advance);
});
