/**
 * 精密仪器公司官网 - 主逻辑模块
 * 页面交互、滚动动画、移动端菜单等
 */

(function() {
  'use strict';

  /**
   * 主应用对象
   */
  const App = {
    /**
     * 初始化应用
     */
    init() {
      this.initNavigation();
      this.initScrollEffects();
      this.initRevealAnimations();
      this.initBackToTop();
      this.initMobileMenu();
      this.initSmoothScroll();
      this.initCounters();
      this.initSearch();
      this.initForms();
      
      console.log('[App] 应用初始化完成');
    },

    /**
     * 导航栏滚动效果
     */
    initNavigation() {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;

      let lastScroll = 0;
      
      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // 添加/移除滚动样式
        if (currentScroll > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        
        // 隐藏/显示导航栏（向下滚动隐藏，向上滚动显示）
        if (currentScroll > lastScroll && currentScroll > 100) {
          navbar.style.transform = 'translateY(-100%)';
        } else {
          navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
      }, { passive: true });
    },

    /**
     * 滚动效果
     */
    initScrollEffects() {
      // 视差效果
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      
      if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
          const scrolled = window.pageYOffset;
          
          parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
          });
        }, { passive: true });
      }
    },

    /**
     * 滚动显示动画
     */
    initRevealAnimations() {
      const revealElements = document.querySelectorAll('.reveal');
      
      if (revealElements.length === 0) return;

      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // 添加延迟效果
            setTimeout(() => {
              entry.target.classList.add('active');
            }, index * 100);
            
            // 只触发一次
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      revealElements.forEach(el => observer.observe(el));
    },

    /**
     * 返回顶部按钮
     */
    initBackToTop() {
      const backToTop = document.querySelector('.back-to-top');
      if (!backToTop) return;

      // 显示/隐藏按钮
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }, { passive: true });

      // 点击滚动到顶部
      backToTop.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    },

    /**
     * 移动端菜单
     */
    initMobileMenu() {
      const toggle = document.querySelector('.navbar-toggle');
      const nav = document.querySelector('.navbar-nav');
      
      if (!toggle || !nav) return;

      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        
        // 防止背景滚动
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
      });

      // 点击导航链接后关闭菜单
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          toggle.classList.remove('active');
          nav.classList.remove('active');
          document.body.style.overflow = '';
        });
      });

      // 点击外部关闭菜单
      document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !nav.contains(e.target)) {
          toggle.classList.remove('active');
          nav.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    },

    /**
     * 平滑滚动
     */
    initSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const target = document.querySelector(targetId);
          if (!target) return;

          e.preventDefault();
          
          const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        });
      });
    },

    /**
     * 数字计数动画
     */
    initCounters() {
      const counters = document.querySelectorAll('[data-counter]');
      
      if (counters.length === 0) return;

      const observerOptions = {
        threshold: 0.5
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      counters.forEach(counter => observer.observe(counter));
    },

    /**
     * 执行计数动画
     */
    animateCounter(element) {
      const target = parseInt(element.dataset.counter, 10);
      const duration = parseInt(element.dataset.duration, 10) || 2000;
      const suffix = element.dataset.suffix || '';
      const prefix = element.dataset.prefix || '';
      
      let startTime = null;
      let current = 0;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // 使用 easeOutQuart 缓动函数
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        current = Math.floor(easeProgress * target);
        
        element.textContent = prefix + current.toLocaleString() + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = prefix + target.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(step);
    },

    /**
     * 搜索功能
     */
    initSearch() {
      const searchForms = document.querySelectorAll('.search-form');
      
      searchForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const input = form.querySelector('.search-input');
          const query = input?.value.trim();
          
          if (!query) return;

          try {
            // 显示加载状态
            form.classList.add('loading');
            
            // 调用搜索 API
            const results = await API.search.global(query);
            
            // 触发搜索完成事件
            window.dispatchEvent(new CustomEvent('searchComplete', {
              detail: { query, results }
            }));
            
          } catch (error) {
            console.error('搜索失败:', error);
            this.showNotification('搜索失败，请稍后重试', 'error');
          } finally {
            form.classList.remove('loading');
          }
        });
      });

      // 搜索建议
      const searchInputs = document.querySelectorAll('.search-input[data-suggestions]');
      
      searchInputs.forEach(input => {
        let debounceTimer;
        
        input.addEventListener('input', (e) => {
          clearTimeout(debounceTimer);
          
          const query = e.target.value.trim();
          if (query.length < 2) return;
          
          debounceTimer = setTimeout(async () => {
            try {
              const suggestions = await API.search.getSuggestions(query);
              this.showSearchSuggestions(input, suggestions);
            } catch (error) {
              console.error('获取搜索建议失败:', error);
            }
          }, 300);
        });

        // 隐藏建议
        document.addEventListener('click', (e) => {
          if (!input.contains(e.target)) {
            this.hideSearchSuggestions();
          }
        });
      });
    },

    /**
     * 显示搜索建议
     */
    showSearchSuggestions(input, suggestions) {
      // 移除现有建议
      this.hideSearchSuggestions();
      
      if (!suggestions || suggestions.length === 0) return;

      const dropdown = document.createElement('div');
      dropdown.className = 'search-suggestions';
      dropdown.innerHTML = suggestions.map(s => `
        <div class="search-suggestion-item" data-value="${s}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <span>${s}</span>
        </div>
      `).join('');

      // 定位
      const rect = input.getBoundingClientRect();
      dropdown.style.cssText = `
        position: fixed;
        top: ${rect.bottom}px;
        left: ${rect.left}px;
        width: ${rect.width}px;
        z-index: 1000;
      `;

      document.body.appendChild(dropdown);

      // 点击建议
      dropdown.querySelectorAll('.search-suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          input.value = item.dataset.value;
          this.hideSearchSuggestions();
          input.closest('form')?.submit();
        });
      });
    },

    /**
     * 隐藏搜索建议
     */
    hideSearchSuggestions() {
      document.querySelectorAll('.search-suggestions').forEach(el => el.remove());
    },

    /**
     * 表单处理
     */
    initForms() {
      // 表单验证
      document.querySelectorAll('form[data-validate]').forEach(form => {
        form.addEventListener('submit', (e) => {
          if (!this.validateForm(form)) {
            e.preventDefault();
          }
        });
      });

      // 实时验证
      document.querySelectorAll('input[data-validate], textarea[data-validate]').forEach(field => {
        field.addEventListener('blur', () => {
          this.validateField(field);
        });
      });

      // AJAX 表单提交
      document.querySelectorAll('form[data-ajax]').forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          if (!this.validateForm(form)) return;

          const submitBtn = form.querySelector('[type="submit"]');
          const originalText = submitBtn?.textContent;
          
          try {
            // 显示加载状态
            if (submitBtn) {
              submitBtn.disabled = true;
              submitBtn.innerHTML = '<span class="spinner"></span> 提交中...';
            }

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            const action = form.getAttribute('action') || '/api/contact';
            const method = form.getAttribute('method') || 'POST';
            
            const response = await fetch(action, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('提交失败');

            // 成功处理
            this.showNotification('提交成功！我们会尽快与您联系。', 'success');
            form.reset();
            
            // 触发自定义事件
            form.dispatchEvent(new CustomEvent('formSuccess', { detail: { data } }));

          } catch (error) {
            console.error('表单提交失败:', error);
            this.showNotification('提交失败，请稍后重试', 'error');
          } finally {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
            }
          }
        });
      });
    },

    /**
     * 验证表单
     */
    validateForm(form) {
      let isValid = true;
      
      form.querySelectorAll('input[data-validate], textarea[data-validate], select[data-validate]').forEach(field => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });

      return isValid;
    },

    /**
     * 验证单个字段
     */
    validateField(field) {
      const rules = field.dataset.validate?.split('|') || [];
      const value = field.value.trim();
      let isValid = true;
      let errorMessage = '';

      // 移除现有错误
      this.clearFieldError(field);

      for (const rule of rules) {
        const [ruleName, ruleValue] = rule.split(':');

        switch (ruleName) {
          case 'required':
            if (!value) {
              isValid = false;
              errorMessage = '此字段为必填项';
            }
            break;
          case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              isValid = false;
              errorMessage = '请输入有效的邮箱地址';
            }
            break;
          case 'phone':
            if (value && !/^1[3-9]\d{9}$/.test(value)) {
              isValid = false;
              errorMessage = '请输入有效的手机号码';
            }
            break;
          case 'min':
            if (value && value.length < parseInt(ruleValue)) {
              isValid = false;
              errorMessage = `最少需要 ${ruleValue} 个字符`;
            }
            break;
          case 'max':
            if (value && value.length > parseInt(ruleValue)) {
              isValid = false;
              errorMessage = `最多允许 ${ruleValue} 个字符`;
            }
            break;
        }

        if (!isValid) break;
      }

      if (!isValid) {
        this.showFieldError(field, errorMessage);
      }

      return isValid;
    },

    /**
     * 显示字段错误
     */
    showFieldError(field, message) {
      field.classList.add('error');
      
      const errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      errorEl.textContent = message;
      
      const formGroup = field.closest('.form-group');
      if (formGroup) {
        formGroup.appendChild(errorEl);
      } else {
        field.parentNode.appendChild(errorEl);
      }
    },

    /**
     * 清除字段错误
     */
    clearFieldError(field) {
      field.classList.remove('error');
      const formGroup = field.closest('.form-group') || field.parentNode;
      formGroup?.querySelector('.form-error')?.remove();
    },

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
      // 移除现有通知
      document.querySelectorAll('.notification').forEach(n => n.remove());

      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
        <div class="notification-content">
          <span class="notification-message">${message}</span>
          <button class="notification-close" aria-label="关闭">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
      `;

      document.body.appendChild(notification);

      // 动画进入
      requestAnimationFrame(() => {
        notification.classList.add('show');
      });

      // 自动关闭
      const autoClose = setTimeout(() => {
        this.closeNotification(notification);
      }, 5000);

      // 手动关闭
      notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoClose);
        this.closeNotification(notification);
      });
    },

    /**
     * 关闭通知
     */
    closeNotification(notification) {
      notification.classList.remove('show');
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 300);
    },

    /**
     * 加载数据
     */
    async loadData(endpoint, container, renderFn) {
      const el = document.querySelector(container);
      if (!el) return;

      try {
        // 显示加载状态
        el.innerHTML = '<div class="loading"><span class="spinner"></span> 加载中...</div>';

        const data = await endpoint();
        
        if (data.length === 0) {
          el.innerHTML = '<div class="empty-state">暂无数据</div>';
          return;
        }

        el.innerHTML = data.map(renderFn).join('');

      } catch (error) {
        console.error('加载数据失败:', error);
        el.innerHTML = '<div class="error-state">加载失败，请稍后重试</div>';
      }
    },

    /**
     * 防抖函数
     */
    debounce(fn, delay) {
      let timer;
      return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    },

    /**
     * 节流函数
     */
    throttle(fn, limit) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          fn.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
  };

  // 暴露到全局
  window.App = App;

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }
})();
