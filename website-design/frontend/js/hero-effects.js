/**
 * 精密仪器公司官网 - Hero区特效
 * Animation Developer
 * 包含：背景渐变动画、装饰元素浮动、文字逐字显示
 */

(function() {
  'use strict';

  // ========================================
  // 配置
  // ========================================
  const CONFIG = {
    // 文字逐字显示速度（毫秒/字符）
    typeSpeed: 50,
    // 删除速度（毫秒/字符）
    deleteSpeed: 30,
    // 打字前延迟
    typeDelay: 500,
    // 删除前延迟
    deleteDelay: 2000,
    // 粒子数量
    particleCount: 50,
    // 粒子颜色
    particleColors: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd']
  };

  // ========================================
  // 初始化
  // ========================================
  function init() {
    initGradientBackground();
    initFloatingElements();
    initTypewriter();
    initParticleBackground();
    initParallaxHero();
    initScrollReveal();
  }

  // ========================================
  // 背景渐变动画
  // ========================================
  function initGradientBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // 添加渐变动画类
    hero.classList.add('hero-gradient-animate');

    // 鼠标跟随渐变效果
    hero.addEventListener('mousemove', function(e) {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      hero.style.setProperty('--gradient-x', `${x}%`);
      hero.style.setProperty('--gradient-y', `${y}%`);
    });
  }

  // ========================================
  // 装饰元素浮动效果
  // ========================================
  function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.float-element, [data-float]');
    
    floatingElements.forEach((el, index) => {
      // 添加基础浮动类
      el.classList.add('float-element');
      
      // 根据索引添加不同的延迟
      const delayClass = `float-delay-${(index % 4) + 1}`;
      el.classList.add(delayClass);
      
      // 添加随机浮动速度变化
      const randomDuration = 5 + Math.random() * 4;
      el.style.animationDuration = `${randomDuration}s`;
    });

    // 装饰性形状
    initDecorativeShapes();
  }

  // 装饰性形状
  function initDecorativeShapes() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // 创建装饰元素容器
    const decorContainer = document.createElement('div');
    decorContainer.className = 'hero-decorations';
    decorContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    `;

    // 创建圆形装饰
    for (let i = 0; i < 5; i++) {
      const circle = document.createElement('div');
      const size = 100 + Math.random() * 200;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      circle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%);
        left: ${posX}%;
        top: ${posY}%;
        transform: translate(-50%, -50%);
      `;
      circle.classList.add('float-element');
      decorContainer.appendChild(circle);
    }

    // 创建线条装饰
    for (let i = 0; i < 3; i++) {
      const line = document.createElement('div');
      const posY = 20 + Math.random() * 60;
      
      line.style.cssText = `
        position: absolute;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.2), transparent);
        left: 0;
        top: ${posY}%;
      `;
      decorContainer.appendChild(line);
    }

    hero.insertBefore(decorContainer, hero.firstChild);
  }

  // ========================================
  // 文字逐字显示效果（打字机效果）
  // ========================================
  function initTypewriter() {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(el => {
      const text = el.textContent;
      const texts = el.dataset.typewriter.split('|');
      
      if (texts.length > 1) {
        // 多文本循环打字
        startMultiTypewriter(el, texts);
      } else {
        // 单文本打字
        startTypewriter(el, text);
      }
    });
  }

  function startTypewriter(element, text) {
    element.textContent = '';
    element.classList.add('typewriter');
    
    // 添加光标
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    element.appendChild(cursor);

    let charIndex = 0;
    
    setTimeout(() => {
      function type() {
        if (charIndex < text.length) {
          cursor.before(text.charAt(charIndex));
          charIndex++;
          setTimeout(type, CONFIG.typeSpeed);
        }
      }
      type();
    }, CONFIG.typeDelay);
  }

  function startMultiTypewriter(element, texts) {
    element.textContent = '';
    element.classList.add('typewriter');
    
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    element.appendChild(cursor);

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        // 删除模式
        if (charIndex > 0) {
          const textNodes = Array.from(element.childNodes).filter(n => n !== cursor);
          if (textNodes.length > 0) {
            element.removeChild(textNodes[textNodes.length - 1]);
          }
          charIndex--;
          setTimeout(type, CONFIG.deleteSpeed);
        } else {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(type, CONFIG.typeDelay);
        }
      } else {
        // 打字模式
        if (charIndex < currentText.length) {
          cursor.before(currentText.charAt(charIndex));
          charIndex++;
          setTimeout(type, CONFIG.typeSpeed);
        } else {
          // 完成打字，等待后删除
          setTimeout(() => {
            isDeleting = true;
            type();
          }, CONFIG.deleteDelay);
        }
      }
    }

    setTimeout(type, CONFIG.typeDelay);
  }

  // ========================================
  // 粒子背景效果
  // ========================================
  function initParticleBackground() {
    const hero = document.querySelector('.hero[data-particles]');
    if (!hero) return;

    // 创建 canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-particles';
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
    
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    let isActive = true;

    // 设置 canvas 尺寸
    function resizeCanvas() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    // 创建粒子
    function createParticles() {
      particles = [];
      const count = parseInt(hero.dataset.particles, 10) || CONFIG.particleCount;
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: CONFIG.particleColors[Math.floor(Math.random() * CONFIG.particleColors.length)],
          alpha: Math.random() * 0.5 + 0.2
        });
      }
    }

    // 绘制粒子
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        // 更新位置
        p.x += p.vx;
        p.y += p.vy;

        // 边界检测
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // 绘制连线
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - distance / 100) * 0.2;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
    }

    // 动画循环
    function animate() {
      if (!isActive) return;
      drawParticles();
      animationId = requestAnimationFrame(animate);
    }

    // 使用 IntersectionObserver 优化性能
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isActive = true;
          animate();
        } else {
          isActive = false;
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
        }
      });
    }, { threshold: 0.1 });

    observer.observe(hero);

    // 初始化
    resizeCanvas();
    createParticles();
    animate();

    // 响应窗口大小变化
    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
  }

  // ========================================
  // Hero区视差效果
  // ========================================
  function initParallaxHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const parallaxElements = hero.querySelectorAll('.hero-content, .hero-image');
    
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;
      
      if (scrollY < heroHeight) {
        const progress = scrollY / heroHeight;
        
        parallaxElements.forEach((el, index) => {
          const speed = (index + 1) * 0.3;
          const yPos = scrollY * speed;
          el.style.transform = `translateY(${yPos}px)`;
          el.style.opacity = 1 - (progress * 0.5);
        });
      }
      
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ========================================
  // 滚动显示效果
  // ========================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.hero [data-reveal]');
    
    revealElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 300 + (index * 100));
    });
  }

  // ========================================
  // 启动
  // ========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 暴露全局 API
  window.HeroEffects = {
    refresh: init,
    startTypewriter: startTypewriter
  };
})();
