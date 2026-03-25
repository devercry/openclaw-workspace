/**
 * 精密仪器公司官网 - 微交互
 * Animation Developer
 * 包含：按钮点击反馈、表单输入焦点、成功/错误状态、加载骨架屏
 */

(function() {
  'use strict';

  // ========================================
  // 配置
  // ========================================
  const CONFIG = {
    // 涟漪效果持续时间
    rippleDuration: 600,
    // 按钮点击缩放比例
    buttonScale: 0.95,
    // Toast 显示持续时间
    toastDuration: 3000
  };

  // ========================================
  // 初始化
  // ========================================
  function init() {
    initButtonEffects();
    initRippleEffect();
    initFormInteractions();
    initToastSystem();
    initSkeletonLoader();
    initCardTilt();
  }

  // ========================================
  // 按钮点击反馈
  // ========================================
  function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn, button[type="submit"], .btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
      button.classList.add('btn-click-effect');
      
      button.addEventListener('click', function(e) {
        this.style.transform = `scale(${CONFIG.buttonScale})`;
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      });
    });
  }

  // ========================================
  // 涟漪效果
  // ========================================
  function initRippleEffect() {
    const rippleElements = document.querySelectorAll('.btn-ripple, .btn, .btn-primary');
    
    rippleElements.forEach(element => {
      element.addEventListener('click', function(e) {
        createRipple(this, e);
      });
    });
  }

  function createRipple(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, CONFIG.rippleDuration);
  }

  // ========================================
  // 表单输入焦点动画
  // ========================================
  function initFormInteractions() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea, select');
    
    inputs.forEach(input => {
      const formGroup = input.closest('.form-group');
      
      if (formGroup) {
        input.addEventListener('focus', function() {
          formGroup.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
          formGroup.classList.remove('focused');
          
          if (this.value.trim()) {
            formGroup.classList.add('has-value');
          } else {
            formGroup.classList.remove('has-value');
          }
        });
        
        if (input.value.trim()) {
          formGroup.classList.add('has-value');
        }
      }
    });

    initFormValidation();
  }

  // 表单验证
  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
          const formGroup = input.closest('.form-group');
          
          if (!input.value.trim()) {
            isValid = false;
            showFieldError(input, formGroup);
          } else {
            clearFieldError(input, formGroup);
          }
        });
        
        if (isValid) {
          form.classList.add('form-success');
          showToast('提交成功！', 'success');
          
          setTimeout(() => {
            form.classList.remove('form-success');
          }, 500);
        } else {
          showToast('请填写所有必填项', 'error');
        }
      });
    });
  }

  function showFieldError(input, formGroup) {
    if (formGroup) {
      formGroup.classList.add('form-error-shake', 'form-error-border');
      setTimeout(() => {
        formGroup.classList.remove('form-error-shake');
      }, 500);
    }
    input.classList.add('error');
  }

  function clearFieldError(input, formGroup) {
    if (formGroup) {
      formGroup.classList.remove('form-error-border');
    }
    input.classList.remove('error');
  }

  // ========================================
  // Toast 通知系统
  // ========================================
  function initToastSystem() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(container);
    }
  }

  function showToast(message, type = 'info', duration = CONFIG.toastDuration) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="toast-close" aria-label="关闭">&times;</button>
    `;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    const timeout = setTimeout(() => {
      hideToast(toast);
    }, duration);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
      clearTimeout(timeout);
      hideToast(toast);
    });
  }

  function hideToast(toast) {
    toast.classList.remove('show');
    toast.classList.add('hide');
    
    setTimeout(() => {
      toast.remove();
    }, 400);
  }

  window.showToast = showToast;

  // ========================================
  // 骨架屏加载效果
  // ========================================
  function initSkeletonLoader() {
    const skeletonContainers = document.querySelectorAll('[data-skeleton]');
    
    skeletonContainers.forEach(container => {
      const type = container.dataset.skeleton;
      const count = parseInt(container.dataset.skeletonCount, 10) || 1;
      
      container.dataset.originalContent = container.innerHTML;
      
      showSkeleton(container, type, count);
      
      const loadTime = parseInt(container.dataset.skeletonDelay, 10) || 1500;
      setTimeout(() => {
        hideSkeleton(container);
      }, loadTime);
    });
  }

  function showSkeleton(container, type, count) {
    let skeletonHTML = '';
    
    for (let i = 0; i < count; i++) {
      switch(type) {
        case 'card':
          skeletonHTML += `
            <div class="skeleton skeleton-card">
              <div class="skeleton skeleton-image"></div>
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text" style="width: 80%"></div>
            </div>
          `;
          break;
        case 'text':
          skeletonHTML += `<div class="skeleton skeleton-text"></div>`;
          break;
        case 'title':
          skeletonHTML += `<div class="skeleton skeleton-title"></div>`;
          break;
        case 'image':
          skeletonHTML += `<div class="skeleton skeleton-image"></div>`;
          break;
        default:
          skeletonHTML += `<div class="skeleton"></div>`;
      }
    }
    
    container.innerHTML = skeletonHTML;
    container.classList.add('skeleton-loading');
  }

  function hideSkeleton(container) {
    container.classList.remove('skeleton-loading');
    container.classList.add('skeleton-loaded');
    
    if (container.dataset.originalContent) {
      container.innerHTML = container.dataset.originalContent;
      container.removeAttribute('data-original-content');
    }
    
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    requestAnimationFrame(() => {
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    });
  }

  window.SkeletonLoader = {
    show: showSkeleton,
    hide: hideSkeleton
  };

  // ========================================
  // 卡片倾斜效果 (3D Tilt)
  // ========================================
  function initCardTilt() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;
    
    cards.forEach(card => {
      card.addEventListener('mousemove', handleTilt);
      card.addEventListener('mouseleave', resetTilt);
    });
  }

  function handleTilt(e) {
    const card = this;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'transform 0.1s ease';
  }

  function resetTilt() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    this.style.transition = 'transform 0.5s ease';
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
  window.MicroInteractions = {
    showToast: showToast,
    showSkeleton: showSkeleton,
    hideSkeleton: hideSkeleton,
    createRipple: createRipple
  };
})();
