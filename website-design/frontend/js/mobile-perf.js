/**
 * 精密仪器公司官网 - 移动端性能优化
 * 图片懒加载、动画降级、性能检测
 */

(function() {
  'use strict';

  /**
   * 移动端性能优化管理器
   */
  const MobilePerf = {
    // 配置
    config: {
      lazyLoadOffset: 100,      // 懒加载提前加载距离 (px)
      lowPowerThreshold: 4,     // 低性能设备电池阈值
      imageQuality: {
        high: 90,
        medium: 70,
        low: 50
      }
    },

    // 状态
    isLowPower: false,
    connectionType: 'unknown',
    deviceMemory: 0,
    hardwareConcurrency: 0,
    lazyImages: [],
    imageObserver: null,

    /**
     * 初始化
     */
    init() {
      this.detectDeviceCapabilities();
      this.initLazyLoading();
      this.initAnimationOptimization();
      this.initConnectionAwareLoading();
      this.initIntersectionObserverPolyfill();
      
      console.log('[MobilePerf] 性能优化初始化完成', {
        isLowPower: this.isLowPower,
        connectionType: this.connectionType,
        deviceMemory: this.deviceMemory,
        hardwareConcurrency: this.hardwareConcurrency
      });
    },

    /**
     * 检测设备能力
     */
    detectDeviceCapabilities() {
      // 检测硬件并发数
      this.hardwareConcurrency = navigator.hardwareConcurrency || 2;

      // 检测设备内存 (GB)
      this.deviceMemory = navigator.deviceMemory || 4;

      // 检测网络连接类型
      if ('connection' in navigator) {
        const connection = navigator.connection;
        this.connectionType = connection.effectiveType || '4g';
        
        // 监听网络变化
        connection.addEventListener('change', () => {
          this.connectionType = connection.effectiveType || '4g';
          this.handleConnectionChange();
        });
      }

      // 检测电池状态
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          this.isLowPower = battery.level < 0.2 && !battery.charging;
          
          // 监听电池变化
          battery.addEventListener('levelchange', () => {
            this.isLowPower = battery.level < 0.2 && !battery.charging;
            this.handlePowerModeChange();
          });
          
          battery.addEventListener('chargingchange', () => {
            this.isLowPower = battery.level < 0.2 && !battery.charging;
            this.handlePowerModeChange();
          });
        });
      }

      // 检测是否偏好减少动画
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.isLowPower = true;
      }

      // 根据设备能力设置低功耗模式
      if (this.hardwareConcurrency <= 2 || this.deviceMemory <= 2) {
        this.isLowPower = true;
      }
    },

    /**
     * 初始化图片懒加载
     */
    initLazyLoading() {
      // 获取所有需要懒加载的图片
      this.lazyImages = document.querySelectorAll('img[data-src], picture[data-src]');

      if (this.lazyImages.length === 0) return;

      // 使用 Intersection Observer 进行懒加载
      if ('IntersectionObserver' in window) {
        this.imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
              this.imageObserver.unobserve(entry.target);
            }
          });
        }, {
          root: null,
          rootMargin: `${this.config.lazyLoadOffset}px`,
          threshold: 0
        });

        this.lazyImages.forEach(img => {
          this.imageObserver.observe(img);
        });
      } else {
        // 降级方案：使用 scroll 事件
        this.initScrollLazyLoading();
      }

      // 预加载首屏图片
      this.preloadAboveFoldImages();
    },

    /**
     * 加载图片
     */
    loadImage(img) {
      const src = img.dataset.src;
      const srcset = img.dataset.srcset;
      const sizes = img.dataset.sizes;

      if (!src) return;

      // 根据网络条件调整图片质量
      const optimizedSrc = this.optimizeImageUrl(src);

      // 创建新图片对象进行预加载
      const tempImage = new Image();
      
      tempImage.onload = () => {
        img.src = optimizedSrc;
        
        if (srcset) {
          img.srcset = srcset;
        }
        if (sizes) {
          img.sizes = sizes;
        }
        
        img.classList.add('loaded');
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
        img.removeAttribute('data-sizes');
      };

      tempImage.onerror = () => {
        img.classList.add('error');
        // 使用占位图
        img.src = 'assets/images/placeholder.svg';
      };

      tempImage.src = optimizedSrc;
    },

    /**
     * 优化图片URL
     */
    optimizeImageUrl(url) {
      // 如果是低功耗模式或慢速网络，使用较低质量
      if (this.isLowPower || this.connectionType === '2g' || this.connectionType === 'slow-2g') {
        // 这里可以添加图片服务优化参数
        // 例如：Cloudinary, Imgix 等
        return url;
      }
      return url;
    },

    /**
     * 预加载首屏图片
     */
    preloadAboveFoldImages() {
      const viewportHeight = window.innerHeight;
      
      this.lazyImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top < viewportHeight + this.config.lazyLoadOffset) {
          this.loadImage(img);
          if (this.imageObserver) {
            this.imageObserver.unobserve(img);
          }
        }
      });
    },

    /**
     * Scroll 事件降级方案
     */
    initScrollLazyLoading() {
      let scrollTimer;
      
      const checkImages = () => {
        const scrollTop = window.pageYOffset;
        const viewportHeight = window.innerHeight;

        this.lazyImages.forEach(img => {
          if (img.classList.contains('loaded')) return;
          
          const rect = img.getBoundingClientRect();
          if (rect.top < viewportHeight + this.config.lazyLoadOffset && 
              rect.bottom > -this.config.lazyLoadOffset) {
            this.loadImage(img);
          }
        });
      };

      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(checkImages, 100);
      }, { passive: true });

      // 初始检查
      checkImages();
    },

    /**
     * Intersection Observer Polyfill
     */
    initIntersectionObserverPolyfill() {
      // 如果浏览器不支持 IntersectionObserver，加载 polyfill
      if (!('IntersectionObserver' in window)) {
        const script = document.createElement('script');
        script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
        script.async = true;
        document.head.appendChild(script);
      }
    },

    /**
     * 初始化动画优化
     */
    initAnimationOptimization() {
      if (this.isLowPower) {
        this.reduceAnimations();
      }

      // 监听减少动画偏好变化
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', (e) => {
        if (e.matches) {
          this.reduceAnimations();
        } else if (!this.isLowPower) {
          this.restoreAnimations();
        }
      });
    },

    /**
     * 减少动画
     */
    reduceAnimations() {
      document.documentElement.classList.add('reduce-animations');
      
      // 添加减少动画的样式
      const style = document.createElement('style');
      style.id = 'reduce-animations-style';
      style.textContent = `
        .reduce-animations *,
        .reduce-animations *::before,
        .reduce-animations *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }

        .reduce-animations .parallax,
        .reduce-animations [data-parallax] {
          transform: none !important;
        }

        .reduce-animations .reveal {
          opacity: 1 !important;
          transform: none !important;
        }
      `;
      
      if (!document.getElementById('reduce-animations-style')) {
        document.head.appendChild(style);
      }

      // 暂停所有 CSS 动画
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('active');
      });
    },

    /**
     * 恢复动画
     */
    restoreAnimations() {
      document.documentElement.classList.remove('reduce-animations');
      
      const style = document.getElementById('reduce-animations-style');
      if (style) {
        style.remove();
      }
    },

    /**
     * 初始化网络感知加载
     */
    initConnectionAwareLoading() {
      if (!('connection' in navigator)) return;

      const connection = navigator.connection;
      
      // 根据网络类型调整加载策略
      this.handleConnectionChange();

      // 监听网络变化
      connection.addEventListener('change', () => {
        this.handleConnectionChange();
      });
    },

    /**
     * 处理网络变化
     */
    handleConnectionChange() {
      const connection = navigator.connection;
      const effectiveType = connection?.effectiveType || '4g';
      const saveData = connection?.saveData || false;

      // 根据网络类型设置数据保存模式
      if (saveData || effectiveType === '2g' || effectiveType === 'slow-2g') {
        document.documentElement.classList.add('data-saver');
        this.enableDataSaverMode();
      } else {
        document.documentElement.classList.remove('data-saver');
        this.disableDataSaverMode();
      }
    },

    /**
     * 启用数据节省模式
     */
    enableDataSaverMode() {
      // 停止自动播放视频
      document.querySelectorAll('video[autoplay]').forEach(video => {
        video.autoplay = false;
        video.pause();
      });

      // 降低图片质量
      document.querySelectorAll('img').forEach(img => {
        if (img.dataset.src && !img.classList.contains('loaded')) {
          // 延迟加载非关键图片
          img.loading = 'lazy';
        }
      });
    },

    /**
     * 禁用数据节省模式
     */
    disableDataSaverMode() {
      // 恢复自动播放
      document.querySelectorAll('video[data-autoplay]').forEach(video => {
        video.autoplay = true;
        video.play().catch(() => {});
      });
    },

    /**
     * 处理电源模式变化
     */
    handlePowerModeChange() {
      if (this.isLowPower) {
        this.reduceAnimations();
        this.pauseNonEssentialOperations();
      } else {
        this.restoreAnimations();
        this.resumeOperations();
      }
    },

    /**
     * 暂停非必要操作
     */
    pauseNonEssentialOperations() {
      // 暂停轮询请求
      window.dispatchEvent(new CustomEvent('pausePolling'));
      
      // 降低滚动监听频率
      document.documentElement.classList.add('low-power-mode');
    },

    /**
     * 恢复操作
     */
    resumeOperations() {
      window.dispatchEvent(new CustomEvent('resumePolling'));
      document.documentElement.classList.remove('low-power-mode');
    },

    /**
     * 获取设备性能等级
     */
    getPerformanceLevel() {
      if (this.isLowPower || this.hardwareConcurrency <= 2 || this.deviceMemory <= 2) {
        return 'low';
      }
      if (this.hardwareConcurrency >= 8 && this.deviceMemory >= 8) {
        return 'high';
      }
      return 'medium';
    },

    /**
     * 延迟加载非关键资源
     */
    deferNonCriticalResources() {
      // 延迟加载非关键 CSS
      document.querySelectorAll('link[data-defer]').forEach(link => {
        link.rel = 'stylesheet';
        link.removeAttribute('data-defer');
      });

      // 延迟加载非关键 JS
      document.querySelectorAll('script[data-defer]').forEach(script => {
        const newScript = document.createElement('script');
        newScript.src = script.src;
        newScript.async = true;
        document.body.appendChild(newScript);
        script.remove();
      });
    },

    /**
     * 预加载关键资源
     */
    preloadCriticalResources() {
      const criticalImages = [
        'assets/images/logo.svg',
        'assets/images/hero-bg.webp'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    }
  };

  // 添加懒加载样式
  const style = document.createElement('style');
  style.textContent = `
    /* 懒加载图片样式 */
    img[data-src] {
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    img[data-src].loaded {
      opacity: 1;
    }

    img[data-src].error {
      opacity: 1;
    }

    /* 图片占位 */
    .img-placeholder {
      background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* 低功耗模式 */
    .low-power-mode .reveal {
      opacity: 1 !important;
      transform: none !important;
    }

    /* 数据节省模式 */
    .data-saver img:not(.loaded) {
      filter: blur(10px);
    }
  `;
  document.head.appendChild(style);

  // 暴露到全局
  window.MobilePerf = MobilePerf;

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MobilePerf.init());
  } else {
    MobilePerf.init();
  }
})();
