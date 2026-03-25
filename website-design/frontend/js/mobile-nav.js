/**
 * 精密仪器公司官网 - 移动端导航模块
 * 汉堡菜单、抽屉式导航、手势支持
 */

(function() {
  'use strict';

  /**
   * 移动端导航管理器
   */
  const MobileNav = {
    // DOM 元素
    drawer: null,
    overlay: null,
    toggle: null,
    closeBtn: null,
    body: document.body,
    
    // 状态
    isOpen: false,
    isAnimating: false,
    touchStartX: 0,
    touchCurrentX: 0,
    drawerWidth: 0,
    
    // 配置
    config: {
      drawerWidth: 280, // 抽屉宽度 (px)
      threshold: 80,    // 滑动关闭阈值 (px)
      animationDuration: 300
    },

    /**
     * 初始化
     */
    init() {
      this.createDrawer();
      this.bindEvents();
      this.cloneNavigation();
      
      console.log('[MobileNav] 移动端导航初始化完成');
    },

    /**
     * 创建抽屉DOM结构
     */
    createDrawer() {
      // 检查是否已存在
      if (document.querySelector('.mobile-drawer')) {
        this.drawer = document.querySelector('.mobile-drawer');
        this.overlay = document.querySelector('.mobile-drawer-overlay');
        this.toggle = document.querySelector('.navbar-toggle');
        this.closeBtn = document.querySelector('.mobile-menu-close');
        return;
      }

      // 创建遮罩层
      this.overlay = document.createElement('div');
      this.overlay.className = 'mobile-drawer-overlay';
      this.overlay.setAttribute('aria-hidden', 'true');
      this.body.appendChild(this.overlay);

      // 创建抽屉
      this.drawer = document.createElement('div');
      this.drawer.className = 'mobile-drawer';
      this.drawer.setAttribute('role', 'dialog');
      this.drawer.setAttribute('aria-modal', 'true');
      this.drawer.setAttribute('aria-label', '移动端导航菜单');
      this.drawer.innerHTML = `
        <div class="mobile-drawer-header">
          <a href="index.html" class="mobile-drawer-brand">
            <img src="assets/images/logo.svg" alt="精密仪器" width="32" height="32">
            <span>精密仪器</span>
          </a>
          <button class="mobile-menu-close" aria-label="关闭菜单">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18"/>
              <path d="M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <nav class="mobile-drawer-nav">
          <ul class="mobile-drawer-menu">
            <!-- 菜单项将通过 cloneNavigation 填充 -->
          </ul>
        </nav>
        <div class="mobile-drawer-footer">
          <button class="btn btn-primary btn-block" data-theme-toggle>
            <span class="theme-icon"></span>
            <span class="theme-text">切换主题</span>
          </button>
        </div>
      `;
      this.body.appendChild(this.drawer);

      // 获取关闭按钮
      this.closeBtn = this.drawer.querySelector('.mobile-menu-close');

      // 获取或创建汉堡按钮
      this.ensureToggleButton();
    },

    /**
     * 确保汉堡按钮存在
     */
    ensureToggleButton() {
      this.toggle = document.querySelector('.navbar-toggle');
      
      if (!this.toggle) {
        // 在导航栏中创建汉堡按钮
        const navbarContainer = document.querySelector('.navbar-container');
        if (navbarContainer) {
          this.toggle = document.createElement('button');
          this.toggle.className = 'navbar-toggle';
          this.toggle.setAttribute('aria-label', '打开菜单');
          this.toggle.setAttribute('aria-expanded', 'false');
          this.toggle.innerHTML = `
            <span class="hamburger">
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </span>
          `;
          navbarContainer.appendChild(this.toggle);
        }
      }
    },

    /**
     * 克隆桌面导航到移动端抽屉
     */
    cloneNavigation() {
      const desktopNav = document.querySelector('.navbar-nav');
      const mobileMenu = this.drawer?.querySelector('.mobile-drawer-menu');
      
      if (!desktopNav || !mobileMenu) return;

      // 清空现有内容
      mobileMenu.innerHTML = '';

      // 克隆导航项
      const navItems = desktopNav.querySelectorAll('li');
      navItems.forEach(item => {
        const link = item.querySelector('a');
        const submenu = item.querySelector('.dropdown-menu, .submenu');
        
        const li = document.createElement('li');
        li.className = 'mobile-drawer-item';
        
        if (submenu) {
          // 有子菜单的项
          li.className += ' has-submenu';
          li.innerHTML = `
            <div class="mobile-drawer-item-header">
              <a href="${link?.getAttribute('href') || '#'}" class="mobile-drawer-link">
                ${link?.innerHTML || ''}
              </a>
              <button class="submenu-toggle" aria-label="展开子菜单" aria-expanded="false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
            <ul class="mobile-submenu">
              ${submenu.innerHTML}
            </ul>
          `;
        } else {
          // 普通链接
          li.innerHTML = `
            <a href="${link?.getAttribute('href') || '#'}" class="mobile-drawer-link">
              ${link?.innerHTML || ''}
            </a>
          `;
        }
        
        mobileMenu.appendChild(li);
      });

      // 绑定子菜单事件
      this.bindSubmenuEvents();
    },

    /**
     * 绑定子菜单展开/收起事件
     */
    bindSubmenuEvents() {
      const toggles = this.drawer?.querySelectorAll('.submenu-toggle');
      
      toggles?.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const item = toggle.closest('.mobile-drawer-item');
          const submenu = item?.querySelector('.mobile-submenu');
          const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
          
          // 关闭其他已展开的子菜单
          this.drawer.querySelectorAll('.mobile-drawer-item.has-submenu').forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('submenu-open');
              otherItem.querySelector('.submenu-toggle')?.setAttribute('aria-expanded', 'false');
            }
          });
          
          // 切换当前子菜单
          item?.classList.toggle('submenu-open', !isExpanded);
          toggle.setAttribute('aria-expanded', String(!isExpanded));
          
          // 添加动画类
          if (!isExpanded && submenu) {
            submenu.style.height = submenu.scrollHeight + 'px';
            setTimeout(() => {
              submenu.style.height = 'auto';
            }, 300);
          } else if (submenu) {
            submenu.style.height = submenu.scrollHeight + 'px';
            requestAnimationFrame(() => {
              submenu.style.height = '0';
            });
          }
        });
      });
    },

    /**
     * 绑定事件
     */
    bindEvents() {
      // 汉堡按钮点击
      this.toggle?.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleDrawer();
      });

      // 关闭按钮点击
      this.closeBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeDrawer();
      });

      // 遮罩层点击
      this.overlay?.addEventListener('click', () => {
        this.closeDrawer();
      });

      // 键盘事件
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeDrawer();
        }
      });

      // 触摸手势
      this.bindTouchEvents();

      // 窗口大小改变
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (window.innerWidth >= 1024 && this.isOpen) {
            this.closeDrawer();
          }
        }, 250);
      });

      // 点击导航链接后关闭抽屉
      this.drawer?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          // 延迟关闭以允许导航
          setTimeout(() => {
            this.closeDrawer();
          }, 150);
        });
      });
    },

    /**
     * 绑定触摸手势
     */
    bindTouchEvents() {
      if (!this.drawer) return;

      // 触摸开始
      this.drawer.addEventListener('touchstart', (e) => {
        if (this.isAnimating) return;
        
        this.touchStartX = e.touches[0].clientX;
        this.drawerWidth = this.drawer.offsetWidth;
      }, { passive: true });

      // 触摸移动
      this.drawer.addEventListener('touchmove', (e) => {
        if (this.isAnimating) return;
        
        this.touchCurrentX = e.touches[0].clientX;
        const diffX = this.touchCurrentX - this.touchStartX;
        
        // 只允许向右滑动关闭
        if (diffX > 0) {
          e.preventDefault();
          const translateX = Math.min(diffX, this.drawerWidth);
          this.drawer.style.transform = `translateX(${translateX}px)`;
          
          // 调整遮罩透明度
          const opacity = 1 - (translateX / this.drawerWidth);
          this.overlay.style.opacity = String(opacity);
        }
      }, { passive: false });

      // 触摸结束
      this.drawer.addEventListener('touchend', () => {
        if (this.isAnimating) return;
        
        const diffX = this.touchCurrentX - this.touchStartX;
        
        // 超过阈值则关闭
        if (diffX > this.config.threshold) {
          this.closeDrawer();
        } else {
          // 恢复原位
          this.drawer.style.transition = 'transform 0.3s ease';
          this.drawer.style.transform = 'translateX(0)';
          this.overlay.style.opacity = '1';
          
          setTimeout(() => {
            this.drawer.style.transition = '';
          }, 300);
        }
        
        this.touchStartX = 0;
        this.touchCurrentX = 0;
      }, { passive: true });

      // 边缘滑动手势检测（从屏幕左边缘向右滑动打开菜单）
      document.addEventListener('touchstart', (e) => {
        if (this.isOpen) return;
        
        const touchX = e.touches[0].clientX;
        // 只在屏幕左边缘 30px 内响应
        if (touchX < 30) {
          this.touchStartX = touchX;
        }
      }, { passive: true });

      document.addEventListener('touchmove', (e) => {
        if (this.isOpen || this.touchStartX === 0) return;
        
        const touchX = e.touches[0].clientX;
        const diffX = touchX - this.touchStartX;
        
        // 向右滑动超过 50px 打开菜单
        if (diffX > 50) {
          this.openDrawer();
          this.touchStartX = 0;
        }
      }, { passive: true });
    },

    /**
     * 切换抽屉状态
     */
    toggleDrawer() {
      if (this.isOpen) {
        this.closeDrawer();
      } else {
        this.openDrawer();
      }
    },

    /**
     * 打开抽屉
     */
    openDrawer() {
      if (this.isOpen || this.isAnimating) return;
      
      this.isAnimating = true;
      this.isOpen = true;
      
      // 更新 ARIA 属性
      this.toggle?.setAttribute('aria-expanded', 'true');
      this.drawer?.setAttribute('aria-hidden', 'false');
      
      // 显示遮罩
      this.overlay?.classList.add('active');
      
      // 显示抽屉
      this.drawer?.classList.add('active');
      
      // 禁止背景滚动
      this.body.style.overflow = 'hidden';
      this.body.style.touchAction = 'none';
      
      // 动画完成后
      setTimeout(() => {
        this.isAnimating = false;
        
        // 聚焦到关闭按钮
        this.closeBtn?.focus();
      }, this.config.animationDuration);
      
      // 触发自定义事件
      window.dispatchEvent(new CustomEvent('mobileNavOpen'));
    },

    /**
     * 关闭抽屉
     */
    closeDrawer() {
      if (!this.isOpen || this.isAnimating) return;
      
      this.isAnimating = true;
      this.isOpen = false;
      
      // 更新 ARIA 属性
      this.toggle?.setAttribute('aria-expanded', 'false');
      this.drawer?.setAttribute('aria-hidden', 'true');
      
      // 隐藏抽屉
      this.drawer?.classList.remove('active');
      
      // 隐藏遮罩
      this.overlay?.classList.remove('active');
      
      // 恢复背景滚动
      this.body.style.overflow = '';
      this.body.style.touchAction = '';
      
      // 动画完成后
      setTimeout(() => {
        this.isAnimating = false;
        
        // 重置变换
        if (this.drawer) {
          this.drawer.style.transform = '';
        }
        if (this.overlay) {
          this.overlay.style.opacity = '';
        }
        
        // 关闭所有子菜单
        this.drawer?.querySelectorAll('.mobile-drawer-item').forEach(item => {
          item.classList.remove('submenu-open');
          const submenu = item.querySelector('.mobile-submenu');
          if (submenu) {
            submenu.style.height = '';
          }
        });
        
        this.drawer?.querySelectorAll('.submenu-toggle').forEach(toggle => {
          toggle.setAttribute('aria-expanded', 'false');
        });
      }, this.config.animationDuration);
      
      // 触发自定义事件
      window.dispatchEvent(new CustomEvent('mobileNavClose'));
    },

    /**
     * 销毁实例
     */
    destroy() {
      this.closeDrawer();
      
      // 移除 DOM 元素
      this.overlay?.remove();
      this.drawer?.remove();
      
      // 清理引用
      this.overlay = null;
      this.drawer = null;
      this.toggle = null;
      this.closeBtn = null;
    }
  };

  // 暴露到全局
  window.MobileNav = MobileNav;

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MobileNav.init());
  } else {
    MobileNav.init();
  }
})();
