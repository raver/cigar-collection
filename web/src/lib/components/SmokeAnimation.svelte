<script lang="ts">
  import { onMount } from 'svelte';

  let canvasEl: HTMLCanvasElement;

  onMount(() => {
    const canvas = canvasEl;
    const ctx = canvas.getContext('2d')!;
    let animationId: number;
    let isNight = false;

    // --- Perlin noise (3D) ---
    function createNoise(seed = 42) {
      const p = new Uint8Array(512);
      let s = seed;
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 255; i > 0; i--) {
        s = (s * 16807) % 2147483647;
        const j = s % (i + 1);
        [p[i], p[j]] = [p[j], p[i]];
      }
      for (let i = 0; i < 256; i++) p[i + 256] = p[i];

      function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
      function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
      function grad(hash: number, x: number, y: number, z: number) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
      }

      return function(x: number, y: number, z: number) {
        const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
        x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
        const u = fade(x), v = fade(y), w = fade(z);
        const A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z;
        const B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
        return (lerp(
          lerp(lerp(grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z), u),
               lerp(grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z), u), v),
          lerp(lerp(grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1), u),
               lerp(grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1), u), v), w) + 1) / 2;
      };
    }

    const noise = createNoise(42);

    // --- Mouse tracking ---
    let mouseX = -9999;
    let mouseY = -9999;

    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
    function onMouseLeave() {
      mouseX = -9999;
      mouseY = -9999;
    }
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    // --- Resize ---
    function resize() {
      const parent = canvas.parentElement!;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // --- Theme detection ---
    function checkTheme() {
      isNight = document.documentElement.getAttribute('data-theme') === 'night';
    }
    checkTheme();

    const observer = new MutationObserver(() => checkTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // --- Smoke particle ---
    const PARTICLE_COUNT = 90;

    class Smoke {
      x: number;
      y: number;
      baseSize: number;
      size: number;
      maxAlpha: number;
      alpha: number;
      vy: number;
      drift: number;
      noiseOff: number;
      life: number;
      maxLife: number;
      fadeIn: number;
      fadeOutStart: number;
      growRate: number;

      constructor(stagger = false) {
        this.x = 0;
        this.y = 0;
        this.baseSize = 0;
        this.size = 0;
        this.maxAlpha = 0;
        this.alpha = 0;
        this.vy = 0;
        this.drift = 0;
        this.noiseOff = 0;
        this.life = 0;
        this.maxLife = 0;
        this.fadeIn = 0;
        this.fadeOutStart = 0;
        this.growRate = 0;
        this.reset();
        if (stagger) {
          this.y = Math.random() * (-canvas.height * 0.3) + Math.random() * canvas.height;
          this.life = Math.random() * this.maxLife * 0.7;
          if (this.life > this.fadeIn) this.alpha = this.maxAlpha;
        }
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 120;
        this.baseSize = 30 + Math.random() * 50;
        this.size = this.baseSize;
        this.maxAlpha = (12 + Math.random() * 23) / 255;
        this.alpha = 0;
        this.vy = 0.2 + Math.random() * 0.5;
        this.drift = (Math.random() - 0.5) * 0.4;
        this.noiseOff = Math.random() * 1000;
        this.life = 0;
        this.maxLife = 250 + Math.random() * 250;
        this.fadeIn = 40 + Math.random() * 40;
        this.fadeOutStart = this.maxLife - (50 + Math.random() * 50);
        this.growRate = 1.0005 + Math.random() * 0.0015;
      }

      update() {
        this.life++;
        const nx = noise(this.x * 0.002, this.y * 0.002, this.noiseOff) - 0.5;
        this.x += this.drift + nx * 1.2;
        this.y -= this.vy;
        this.size *= this.growRate;

        if (this.life < this.fadeIn) {
          this.alpha = (this.life / this.fadeIn) * this.maxAlpha;
        } else if (this.life > this.fadeOutStart) {
          this.alpha = ((this.maxLife - this.life) / (this.maxLife - this.fadeOutStart)) * this.maxAlpha;
        } else {
          this.alpha = this.maxAlpha;
        }

        const d = Math.sqrt((this.x - mouseX) ** 2 + (this.y - mouseY) ** 2);
        if (d < 100) {
          const angle = Math.atan2(this.y - mouseY, this.x - mouseX);
          const force = (100 - d) * 0.015;
          this.x += Math.cos(angle) * force;
          this.y += Math.sin(angle) * force;
        }

        if (this.life >= this.maxLife || this.y < -this.size) {
          this.reset();
        }
      }

      draw() {
        const c = isNight ? [180, 200, 180] : [210, 225, 215];
        for (let i = 3; i >= 1; i--) {
          const s = this.size * (1 + i * 0.25);
          ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${this.alpha * 0.3 / i})`;
          ctx.beginPath();
          ctx.ellipse(this.x, this.y, s, s * 0.75, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${this.alpha})`;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size, this.size * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- Create particles ---
    const particles: Smoke[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Smoke(true));
    }

    // --- Animation loop ---
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.update();
        p.draw();
      }
      animationId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      observer.disconnect();
    };
  });
</script>

<canvas
  bind:this={canvasEl}
  class="absolute inset-0 w-full h-full pointer-events-auto"
  aria-hidden="true"
></canvas>
