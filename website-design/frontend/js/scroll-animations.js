/**
 * 精密仪器公司官网 - 滚动触发动画
 * Animation Developer
 * 使用 Intersection Observer API 实现高性能滚动动画
 */

(function() {
  'use strict';

  // ========================================
  // 配置
  // ========================================
  const CONFIG = {
    // Intersection Observer 选项
    observerOptions: {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    },
    // 动画类名
    animationClasses: {
      fadeIn: 'anim-fade-in',
      slideUp: 'anim-slide-up',
      slideLeft: 'anim-slide-left',
      slideRight: 'anim-slide-right',
      scaleIn: 'anim-scale-in',
      visible: 'visible'
    },
    // 计数动画持续时间（毫秒）
    counterDuration: 2000,
    // 进度条动画持续时间（毫秒）
    progressDuration: 1500
  };

  // ========================================
  // Intersection Observer 实例
  // ========================================
  let observer = null;

  // ========================================
  // 初始化
  // ========================================
  function init() {
    // 检查是否支持 Intersection Observer
    if (!('IntersectionObserver' in window)) {
      // 降级处理：直接显示所有元素
      showAllElements();
      return;
    }

    // 创建 Observer
    observer = new IntersectionObserver(handleIntersection, CONFIG.observerOptions);

    // 初始化各类动画元素
    initFadeAnimations();
    initSlideAnimations();
    initScaleAnimations();
    initCounterAnimations();
    initProgressAnimations();
    initStaggerAnimations();

    // 监听自定义事件
    document.addEventListener('refreshAnimations', refreshAnimations);
  }

  // ========================================
  // 处理交叉观察
  // ========================================
  function handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // 添加可见类触发 CSS 动画
        element.classList.add(CONFIG.animationClasses.visible);
        
        // 处理特殊动画类型
        if (element.classList.contains('counter-number')) {
          animateCounter(element);
        }
        
        if (element.classList.contains('progress-bar-fill')) {
          animateProgress(element);
        }
        
        if (element.classList.contains('stagger-list')) {
          animateStaggerList(element);
        }

        // 停止观察已动画的元素（一次性动画）
        if (!element.dataset.repeat) {
          observer.unobserve(element);
        }
      } else if (entry.target.dataset.repeat) {
        // 如果设置了重复动画，移出视口时重置
        entry.target.classList.remove(CONFIG.animationClasses.visible);
      }
    });
  }

  // ========================================
  // 淡入动画
  // ========================================
  function initFadeAnimations() {
    const elements = document.querySelectorAll('[data-animate="fade-in"]');
    elements.forEach(el => {
      el.classList.add(CONFIG.animationClasses.fadeIn);
      observer.observe(el);
    });
  }

  // ========================================
  // 滑动动画
  // ========================================
  function initSlideAnimations() {
    // 从下方滑入
    const slideUpElements = document.querySelectorAll('[data-animate="slide-up"]');
    slideUpElements.forEach(el => {
      el.classList.add(CONFIG.animationClasses.slideUp);
      observer.observe(el);
    });

    // 从左侧滑入
    const slideLeftElements = document.querySelectorAll('[data-animate="slide-left"]');
    slideLeftElements.forEach(el => {
      el.classList.add(CONFIG.animationClasses.slideLeft);
      observer.observe(el);
    });

    // 从右侧滑入
    const slideRightElements = document.querySelectorAll('[data-animate="slide-right"]');
    slideRightElements.forEach(el => {
      el.classList.add(CONFIG.animationClasses.slideRight);
      observer.observe(el);
    });
  }

  // ========================================
  // 缩放动画
  // ========================================
  function initScaleAnimations() {
    const elements = document.querySelectorAll('[data-animate="scale-in"]');
    elements.forEach(el => {
      el.classList.add(CONFIG.animationClasses.scaleIn);
      observer.observe(el);
    });
  }

  // ========================================
  // 数字计数动画
  // ========================================
  function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter-number');
    counters.forEach(counter => {
      // 保存目标值
      const target = parseInt(counter.textContent.replace(/[^\d]/g, ''), 10) || 0;
      counter.dataset.target = target;
      counter.dataset.suffix = counter.textContent.replace(/[\d]/g, '');
      counter.textContent = '0' + counter.dataset.suffix;
      observer.observe(counter);
    });
  }

  function animateCounter(element) {
    const target = parseInt(element.dataset.target, 10);
    const suffix = element.dataset.suffix || '';
    const duration = parseInt(element.dataset.duration, 10) || CONFIG.counterDuration;
    
    if (target === 0) return;

    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用 easeOutExpo 缓动函数
      const easeProgress = 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
      
      element.textContent = currentValue.toLocaleString() + suffix;
      element.classList.add('counting');
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString() + suffix;
        element.classList.remove('counting');
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // ========================================
  // 进度条动画
  // ========================================
  function initProgressAnimations() {
    const progressBars = document.querySelectorAll('.progress-bar-fill[data-progress]');
    progressBars.forEach(bar => {
      observer.observe(bar);
    });
  }

  function animateProgress(element) {
    const targetProgress = element.dataset.progress || '0%';
    const duration = parseInt(element.dataset.duration, 10) || CONFIG.progressDuration;
    
    element.style.setProperty('--progress', targetProgress);
    
    // 使用 setTimeout 确保 CSS transition 触发
    setTimeout(() => {
      element.classList.add('animate');
    }, 100);
  }

  // ========================================
  // 错开动画（列表项依次显示）
  // ========================================
  function initStaggerAnimations() {
    const staggerLists = document.querySelectorAll('.stagger-list');
    staggerLists.forEach(list => {
      observer.observe(list);
    });
  }

  function animateStaggerList(list) {
    const items = list.children;
    Array.from(items).forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('visible');
      }, index * 100);
    });
  }

  // ========================================
  // 刷新动画（用于动态加载内容后）
  // ========================================
  function refreshAnimations() {
    // 重新初始化所有动画
    initFadeAnimations();
    initSlideAnimations();
    initScaleAnimations();
    initCounterAnimations();
    initProgressAnimations();
    initStaggerAnimations();
  }

  // ========================================
  // 降级处理
  // ========================================
  function showAllElements() {
    const animatedElements = document.querySelectorAll(
      '[data-animate], .counter-number, .progress-bar-fill, .stagger-list, .stagger-list > *'
    );
    animatedElements.forEach(el => {
      el.classList.add(CONFIG.animationClasses.visible);
      if (el.classList.contains('stagger-list')) {
        Array.from(el.children).forEach(child => child.classList.add('visible'));
      }
    });
  }

  // ========================================
  // 平滑滚动到锚点
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ========================================
  // 导航栏滚动效果
  // ========================================
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
      const currentScrollY = window.scrollY;
      
      // 添加/移除滚动类
      if (currentScrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }

      // 隐藏/显示导航栏（向下滚动隐藏，向上滚动显示）
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.classList.add('navbar-hidden');
      } else {
        navbar.classList.remove('navbar-hidden');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
  }

  // ========================================
  // 视差滚动效果
  // ========================================
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrollY * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });

      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ========================================
  // 返回顶部按钮
  // ========================================
  function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    let ticking = false;

    function toggleBackToTop() {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(toggleBackToTop);
        ticking = true;
      }
    }, { passive: true });

    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ========================================
  // 启动
  // ========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      init();
      initSmoothScroll();
      initNavbarScroll();
      initParallax();
      initBackToTop();
    });
  } else {
    init();
    initSmoothScroll();
    initNavbarScroll();
    initParallax();
    initBackToTop();
  }

  // 暴露全局 API
  window.ScrollAnimations = {
    refresh: refreshAnimations,
    observe: function(element) {
      if (observer) {
        observer.observe(element);
      }
    },
    unobserve: function(element) {
      if (observer) {
        observer.unobserve(element);
      }
    }
  };
})();