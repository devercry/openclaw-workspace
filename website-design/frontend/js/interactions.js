/**
 * 精密仪器公司官网 - 其他交互功能
 * 回到顶部、加载动画、懒加载、复制功能
 */

(function() {
  'use strict';

  const Interactions = {
    config: {
      scrollThreshold: 300,
      lazyLoadOffset: 100,
      animationDuration: 300
    },

    init() {
      this.initBackToTop();
      this.initPageLoader();
      this.initLazyLoad();
      this.initCopyFeature();
      this.initSmoothScroll();
      this.initScrollAnimations();
      console.log('[Interactions] 初始化完成');
    },

    // 回到顶部按钮
    initBackToTop() {
      if (document.getElementById('back-to-top')) return;

      const btnHTML = `<button id="back-to-top" class="back-to-top" hidden title="回到顶部">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>`;
      document.body.insertAdjacentHTML('beforeend', btnHTML);

      const btn = document.getElementById('back-to-top');
      
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > this.config.scrollThreshold) {
          btn.hidden = false;
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
          setTimeout(() => { if (!btn.classList.contains('visible')) btn.hidden = true; }, 300);
        }
      }, { passive: true });

      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },

    // 页面加载动画
    initPageLoader() {
      if (document.getElementById('page-loader')) return;

      const loaderHTML = `<div id="page-loader" class="page-loader">
        <div class="loader-spinner"></div>
        <p>加载中...</p>
      </div>`;
      document.body.insertAdjacentHTML('afterbegin', loaderHTML);

      window.addEventListener('load', () => {
        const loader = document.getElementById('page-loader');
        if (loader) {
          loader.classList.add('fade-out');
          setTimeout(() => loader.remove(), 500);
        }
      });
    },

    // 图片懒加载
    initLazyLoad() {
      const lazyImages = document.querySelectorAll('img[data-src]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              this.loadImage(img);
              imageObserver.unobserve(img);
            }
          });
        }, { rootMargin: this.config.lazyLoadOffset + 'px' });

        lazyImages.forEach(img => imageObserver.observe(img));
      } else {
        // 降级处理
        lazyImages.forEach(img => this.loadImage(img));
      }
    },

    loadImage(img) {
      const src = img.dataset.src;
      if (!src) return;

      img.classList.add('loading');
      
      const tempImg = new Image();
      tempImg.onload = () => {
        img.src = src;
        img.classList.remove('loading');
        img.classList.add('loaded');
        img.removeAttribute('data-src');
      };
      tempImg.onerror = () => {
        img.classList.remove('loading');
        img.classList.add('error');
      };
      tempImg.src = src;
    },

    // 复制功能
    initCopyFeature() {
      document.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-copy]');
        if (!btn) return;

        const target = btn.dataset.copy;
        const text = target ? document.querySelector(target)?.textContent : btn.textContent;
        
        try {
          await navigator.clipboard.writeText(text);
          this.showCopyFeedback(btn, '已复制');
        } catch (err) {
          // 降级方案
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          this.showCopyFeedback(btn, '已复制');
        }
      });
    },

    showCopyFeedback(btn, message) {
      const originalText = btn.textContent;
      btn.textContent = message;
      btn.classList.add('copied');
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('copied');
      }, 2000);
    },

    // 平滑滚动
    initSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;
          
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    },

    // 滚动动画
    initScrollAnimations() {
      const animatedElements = document.querySelectorAll('[data-animate]');
      
      if ('IntersectionObserver' in window && animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animated');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
      } else {
        animatedElements.forEach(el => el.classList.add('animated'));
      }
    }
  };

  window.Interactions = Interactions;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Interactions.init());
  } else {
    Interactions.init();
  }
})();
