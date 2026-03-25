/**
 * 精密仪器公司官网 - 触摸交互模块
 * 触摸反馈、手势识别、触摸优化
 */

(function() {
  'use strict';

  /**
   * 触摸交互管理器
   */
  const TouchManager = {
    // 配置
    config: {
      tapDelay: 0,           // 消除点击延迟
      longPressDelay: 500,   // 长按触发时间 (ms)
      doubleTapDelay: 300,   // 双击检测时间 (ms)
      swipeThreshold: 50,    // 滑动阈值 (px)
      swipeVelocity: 0.3     // 滑动速度阈值
    },

    // 状态
    touchStartTime: 0,
    touchStartX: 0,
    touchStartY: 0,
    lastTapTime: 0,
    isTouching: false,
    isLongPress: false,
    longPressTimer: null,
    
    // 手势识别
    gestures: {
      swipeLeft: [],
      swipeRight: [],
      swipeUp: [],
      swipeDown: [],
      doubleTap: [],
      longPress: []
    },

    /**
     * 初始化
     */
    init() {
      this.bindGlobalEvents();
      this.initTouchFeedback();
      this.initRippleEffect();
      this.initFastClick();
      
      console.log('[TouchManager] 触摸交互初始化完成');
    },

    /**
     * 绑定全局触摸事件
     */
    bindGlobalEvents() {
      // 触摸开始
      document.addEventListener('touchstart', (e) => {
        this.handleTouchStart(e);
      }, { passive: true });

      // 触摸移动
      document.addEventListener('touchmove', (e) => {
        this.handleTouchMove(e);
      }, { passive: true });

      // 触摸结束
      document.addEventListener('touchend', (e) => {
        this.handleTouchEnd(e);
      }, { passive: true });

      // 触摸取消
      document.addEventListener('touchcancel', (e) => {
        this.handleTouchCancel(e);
      }, { passive: true });
    },

    /**
     * 处理触摸开始
     */
    handleTouchStart(e) {
      const touch = e.touches[0];
      this.touchStartTime = Date.now();
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.isTouching = true;
      this.isLongPress = false;

      // 长按检测
      this.longPressTimer = setTimeout(() => {
        this.isLongPress = true;
        this.triggerGesture('longPress', {
          x: touch.clientX,
          y: touch.clientY,
          target: e.target
        });
      }, this.config.longPressDelay);

      // 添加触摸反馈
      this.addTouchFeedback(e.target);
    },

    /**
     * 处理触摸移动
     */
    handleTouchMove(e) {
      if (!this.isTouching) return;

      const touch = e.touches[0];
      const diffX = Math.abs(touch.clientX - this.touchStartX);
      const diffY = Math.abs(touch.clientY - this.touchStartY);

      // 移动超过阈值，取消长按
      if (diffX > 10 || diffY > 10) {
        clearTimeout(this.longPressTimer);
      }

      // 移除触摸反馈
      this.removeTouchFeedback();
    },

    /**
     * 处理触摸结束
     */
    handleTouchEnd(e) {
      if (!this.isTouching) return;

      const touch = e.changedTouches[0];
      const touchDuration = Date.now() - this.touchStartTime;
      const diffX = touch.clientX - this.touchStartX;
      const diffY = touch.clientY - this.touchStartY;
      const absX = Math.abs(diffX);
      const absY = Math.abs(diffY);

      // 清除长按定时器
      clearTimeout(this.longPressTimer);

      // 检测手势
      if (!this.isLongPress) {
        // 滑动检测
        if (absX > this.config.swipeThreshold || absY > this.config.swipeThreshold) {
          if (absX > absY) {
            // 水平滑动
            if (diffX > 0) {
              this.triggerGesture('swipeRight', {
                x: touch.clientX,
                y: touch.clientY,
                distance: absX,
                target: e.target
              });
            } else {
              this.triggerGesture('swipeLeft', {
                x: touch.clientX,
                y: touch.clientY,
                distance: absX,
                target: e.target
              });
            }
          } else {
            // 垂直滑动
            if (diffY > 0) {
              this.triggerGesture('swipeDown', {
                x: touch.clientX,
                y: touch.clientY,
                distance: absY,
                target: e.target
              });
            } else {
              this.triggerGesture('swipeUp', {
                x: touch.clientX,
                y: touch.clientY,
                distance: absY,
                target: e.target
              });
            }
          }
        } else if (touchDuration < 200) {
          // 轻触检测 - 双击
          const now = Date.now();
          if (now - this.lastTapTime < this.config.doubleTapDelay) {
            this.triggerGesture('doubleTap', {
              x: touch.clientX,
              y: touch.clientY,
              target: e.target
            });
            this.lastTapTime = 0;
          } else {
            this.lastTapTime = now;
          }
        }
      }

      // 移除触摸反馈
      this.removeTouchFeedback();

      this.isTouching = false;
    },

    /**
     * 处理触摸取消
     */
    handleTouchCancel(e) {
      clearTimeout(this.longPressTimer);
      this.removeTouchFeedback();
      this.isTouching = false;
    },

    /**
     * 触发手势事件
     */
    triggerGesture(type, data) {
      // 触发自定义事件
      const event = new CustomEvent(`gesture${type.charAt(0).toUpperCase() + type.slice(1)}`, {
        detail: data,
        bubbles: true,
        cancelable: true
      });
      data.target?.dispatchEvent(event);

      // 执行注册的回调
      this.gestures[type]?.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`手势回调执行失败 (${type}):`, error);
        }
      });
    },

    /**
     * 注册手势监听
     */
    on(gesture, callback) {
      if (this.gestures[gesture]) {
        this.gestures[gesture].push(callback);
      }
      return this;
    },

    /**
     * 移除手势监听
     */
    off(gesture, callback) {
      if (this.gestures[gesture]) {
        this.gestures[gesture] = this.gestures[gesture].filter(cb => cb !== callback);
      }
      return this;
    },

    /**
     * 初始化触摸反馈
     */
    initTouchFeedback() {
      // 为可交互元素添加触摸反馈样式
      const interactiveElements = document.querySelectorAll(
        'button, a, .btn, [role="button"], input[type="submit"], input[type="button"]'
      );

      interactiveElements.forEach(el => {
        el.addEventListener('touchstart', () => {
          el.classList.add('touch-active');
        }, { passive: true });

        el.addEventListener('touchend', () => {
          el.classList.remove('touch-active');
        }, { passive: true });

        el.addEventListener('touchcancel', () => {
          el.classList.remove('touch-active');
        }, { passive: true });
      });
    },

    /**
     * 添加触摸反馈
     */
    addTouchFeedback(target) {
      const interactiveTarget = target.closest(
        'button, a, .btn, [role="button"], .card, .product-card, .feature-card'
      );
      
      if (interactiveTarget) {
        interactiveTarget.classList.add('touch-active');
      }
    },

    /**
     * 移除触摸反馈
     */
    removeTouchFeedback() {
      document.querySelectorAll('.touch-active').forEach(el => {
        el.classList.remove('touch-active');
      });
    },

    /**
     * 初始化涟漪效果
     */
    initRippleEffect() {
      // 为按钮添加涟漪效果
      const buttons = document.querySelectorAll('.btn, button, [role="button"]');
      
      buttons.forEach(button => {
        button.addEventListener('click', (e) => {
          this.createRipple(button, e);
        });
      });
    },

    /**
     * 创建涟漪效果
     */
    createRipple(element, event) {
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      // 确保元素有定位
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.position === 'static') {
        element.style.position = 'relative';
      }
      element.style.overflow = 'hidden';

      element.appendChild(ripple);

      // 动画结束后移除
      setTimeout(() => {
        ripple.remove();
      }, 600);
    },

    /**
     * 初始化快速点击
     */
    initFastClick() {
      // 移除移动端 300ms 点击延迟
      const touchElements = document.querySelectorAll('a, button, .btn, [role="button"]');
      
      touchElements.forEach(el => {
        let touchStartTime;
        let touchEndTime;

        el.addEventListener('touchstart', () => {
          touchStartTime = Date.now();
        }, { passive: true });

        el.addEventListener('touchend', (e) => {
          touchEndTime = Date.now();
          
          // 快速点击，立即触发点击
          if (touchEndTime - touchStartTime < 200) {
            // 阻止默认的延迟点击
            e.preventDefault();
            
            // 手动触发点击事件
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            });
            el.dispatchEvent(clickEvent);
          }
        }, { passive: false });
      });
    },

    /**
     * 检测是否为触摸设备
     */
    isTouchDevice() {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
    },

    /**
     * 检测是否为iOS设备
     */
    isIOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },

    /**
     * 检测是否为Android设备
     */
    isAndroid() {
      return /Android/.test(navigator.userAgent);
    }
  };

  // 添加涟漪动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }

    .touch-active {
      opacity: 0.8 !important;
      transform: scale(0.98) !important;
      transition: transform 0.1s ease, opacity 0.1s ease !important;
    }

    /* 触摸设备优化 */
    @media (hover: none) and (pointer: coarse) {
      .btn,
      button,
      [role="button"] {
        user-select: none;
        -webkit-user-select: none;
      }

      a {
        user-select: none;
        -webkit-user-select: none;
      }

      /* 禁用长按弹出菜单 */
      img,
      a {
        -webkit-touch-callout: none;
      }
    }
  `;
  document.head.appendChild(style);

  // 暴露到全局
  window.TouchManager = TouchManager;

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TouchManager.init());
  } else {
    TouchManager.init();
  }
})();
