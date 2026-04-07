/**
 * 精密仪器公司官网 - 主题切换模块
 * 支持明暗主题切换和系统偏好检测
 */

(function() {
  'use strict';

  // 主题管理器
  const ThemeManager = {
    // 存储键名
    STORAGE_KEY: 'precision_instrument_theme',
    
    // 当前主题
    currentTheme: 'light',

    /**
     * 初始化主题
     */
    init() {
      // 检测系统偏好
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // 读取本地存储或系统偏好
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      
      // 应用主题
      this.setTheme(initialTheme, false);
      
      // 监听系统主题变化
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.setTheme(e.matches ? 'dark' : 'light', false);
        }
      });
      
      // 初始化主题切换按钮
      this.initToggleButtons();
      
      console.log('[ThemeManager] 初始化完成，当前主题:', this.currentTheme);
    },

    /**
     * 设置主题
     * @param {string} theme - 'light' | 'dark'
     * @param {boolean} save - 是否保存到本地存储
     */
    setTheme(theme, save = true) {
      if (theme !== 'light' && theme !== 'dark') {
        console.warn('[ThemeManager] 无效的主题:', theme);
        return;
      }

      this.currentTheme = theme;
      
      // 设置 data-theme 属性
      document.documentElement.setAttribute('data-theme', theme);
      
      // 保存到本地存储
      if (save) {
        localStorage.setItem(this.STORAGE_KEY, theme);
      }
      
      // 更新切换按钮图标
      this.updateToggleIcons();
      
      // 触发自定义事件
      window.dispatchEvent(new CustomEvent('themechange', { 
        detail: { theme } 
      }));
      
      // 更新 meta theme-color
      this.updateMetaThemeColor(theme);
    },

    /**
     * 切换主题
     */
    toggle() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    },

    /**
     * 获取当前主题
     * @returns {string} 当前主题
     */
    getTheme() {
      return this.currentTheme;
    },

    /**
     * 初始化主题切换按钮
     */
    initToggleButtons() {
      const buttons = document.querySelectorAll('[data-theme-toggle]');
      
      buttons.forEach(button => {
        button.addEventListener('click', () => this.toggle());
        
        // 添加键盘支持
        button.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle();
          }
        });
      });
    },

    /**
     * 更新切换按钮图标
     */
    updateToggleIcons() {
      const buttons = document.querySelectorAll('[data-theme-toggle]');
      
      buttons.forEach(button => {
        const isDark = this.currentTheme === 'dark';
        
        // 更新 aria-label
        button.setAttribute('aria-label', isDark ? '切换到亮色模式' : '切换到暗色模式');
        
        // 更新图标
        const iconContainer = button.querySelector('.theme-icon') || button;
        iconContainer.innerHTML = isDark ? this.getSunIcon() : this.getMoonIcon();
      });
    },

    /**
     * 获取太阳图标 (切换到亮色模式)
     */
    getSunIcon() {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      `;
    },

    /**
     * 获取月亮图标 (切换到暗色模式)
     */
    getMoonIcon() {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      `;
    },

    /**
     * 更新 meta theme-color
     */
    updateMetaThemeColor(theme) {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content', 
          theme === 'dark' ? '#0f172a' : '#ffffff'
        );
      }
    },

    /**
     * 重置为系统默认主题
     */
    resetToSystem() {
      localStorage.removeItem(this.STORAGE_KEY);
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(systemPrefersDark ? 'dark' : 'light', false);
    }
  };

  // 暴露到全局
  window.ThemeManager = ThemeManager;

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
  } else {
    ThemeManager.init();
  }
})();
