# 精密仪器公司官网 UX 架构设计文档

> 参考案例：卓立汉光 (https://www.zolix.com.cn)
> 目标用户：科研机构、高校、工业企业
> 设计风格：专业、科技感、可信赖

---

## 1. CSS 设计系统

### 1.1 配色方案

#### 主色调 (Primary Colors)
```css
:root {
  /* 主品牌色 - 科技蓝 */
  --color-primary-50: #E3F2FD;
  --color-primary-100: #BBDEFB;
  --color-primary-200: #90CAF9;
  --color-primary-300: #64B5F6;
  --color-primary-400: #42A5F5;
  --color-primary-500: #2196F3;  /* 主色 */
  --color-primary-600: #1E88E5;
  --color-primary-700: #1976D2;
  --color-primary-800: #1565C0;
  --color-primary-900: #0D47A1;

  /* 辅助色 - 科技青 */
  --color-secondary-500: #00BCD4;
  --color-secondary-600: #00ACC1;
  --color-secondary-700: #0097A7;

  /* 强调色 - 活力橙 */
  --color-accent-500: #FF6B35;
  --color-accent-600: #F4511E;
}
```

#### 中性色 (Neutral Colors)
```css
:root {
  /* 灰度系统 */
  --color-gray-50: #FAFAFA;
  --color-gray-100: #F5F5F5;
  --color-gray-200: #EEEEEE;
  --color-gray-300: #E0E0E0;
  --color-gray-400: #BDBDBD;
  --color-gray-500: #9E9E9E;
  --color-gray-600: #757575;
  --color-gray-700: #616161;
  --color-gray-800: #424242;
  --color-gray-900: #212121;

  /* 文字色 */
  --color-text-primary: #1A1A2E;      /* 主文字 - 深 Navy */
  --color-text-secondary: #4A5568;         /* 次要文字 */
  --color-text-tertiary: #718096;         /* 辅助文字 */
  --color-text-muted: #A0AEC0;            /* 禁用/提示文字 */

  /* 背景色 */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F8FAFC;
  --color-bg-tertiary: #F1F5F9;
}
```

#### 功能色 (Functional Colors)
```css
:root {
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
}
```

### 1.2 字体系统

#### 字体族
```css
:root {
  /* 中文主字体 */
  --font-family-primary: "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;
  
  /* 英文/数字字体 */
  --font-family-secondary: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* 等宽字体（用于技术参数） */
  --font-family-mono: "SF Mono", "Fira Code", "Consolas", monospace;
}
```

#### 字体层级
```css
:root {
  /* 标题 */
  --font-size-h1: 3rem;      /* 48px - 页面大标题 */
  --font-size-h2: 2.25rem;   /* 36px - 区块标题 */
  --font-size-h3: 1.5rem;    /* 24px - 卡片标题 */
  --font-size-h4: 1.25rem;   /* 20px - 小标题 */
  --font-size-h5: 1.125rem;  /* 18px - 列表标题 */
  --font-size-h6: 1rem;      /* 16px - 标签 */

  /* 正文 */
  --font-size-body-lg: 1.125rem;   /* 18px */
  --font-size-body: 1rem;            /* 16px - 默认 */
  --font-size-body-sm: 0.875rem;     /* 14px */
  --font-size-caption: 0.75rem;      /* 12px */

  /* 字重 */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* 行高 */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

### 1.3 间距系统

```css
:root {
  /* 基础单位 4px */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */

  /* 区块间距 */
  --section-padding-y: 5rem;       /* 80px */
  --section-padding-y-lg: 6rem;    /* 96px */
  --container-padding-x: 1.5rem;   /* 24px */
}
```

---

## 2. 响应式布局框架

### 2.1 断点系统

```css
:root {
  /* 断点 */
  --breakpoint-sm: 640px;   /* 手机横屏 */
  --breakpoint-md: 768px;   /* 平板 */
  --breakpoint-lg: 1024px;  /* 小型桌面 */
  --breakpoint-xl: 1280px;  /* 标准桌面 */
  --breakpoint-2xl: 1536px; /* 大屏 */
}
```

### 2.2 容器系统

```css
/* 容器 */
.container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-padding-x);
  padding-right: var(--container-padding-x);
}

.container-fluid {
  width: 100%;
  padding-left: var(--container-padding-x);
  padding-right: var(--container-padding-x);
}

/* 响应式容器 */
@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

@media (min-width: 1536px) {
  .container { max-width: 1440px; }
}
```

### 2.3 网格系统

```css
/* 12列网格 */
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }

/* 响应式网格 */
@media (min-width: 768px) {
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .lg\\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}
```

---

## 3. 明暗主题切换系统

### 3.1 CSS 变量定义

```css
/* ==================== Light Theme (默认) ==================== */
:root,
[data-theme="light"] {
  /* 背景 */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --bg-tertiary: #F1F5F9;
  --bg-elevated: #FFFFFF;
  --bg-overlay: rgba(0, 0, 0, 0.5);

  /* 文字 */
  --text-primary: #1A1A2E;
  --text-secondary: #4A5568;
  --text-tertiary: #718096;
  --text-muted: #A0AEC0;
  --text-inverse: #FFFFFF;

  /* 边框 */
  --border-primary: #E2E8F0;
  --border-secondary: #CBD5E1;
  --border-focus: #2196F3;

  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* 主色 */
  --primary-50: #E3F2FD;
  --primary-100: #BBDEFB;
  --primary-500: #2196F3;
  --primary-600: #1E88E5;
  --primary-700: #1976D2;
}

/* ==================== Dark Theme ==================== */
[data-theme="dark"] {
  /* 背景 */
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-tertiary: #334155;
  --bg-elevated: #1E293B;
  --bg-overlay: rgba(0, 0, 0, 0.8);

  /* 文字 */
  --text-primary: #F1F5F9;
  --text-secondary: #CBD5E1;
  --text-tertiary: #94A3B8;
  --text-muted: #64748B;
  --text-inverse: #0F172A;

  /* 边框 */
  --border-primary: #334155;
  --border-secondary: #475569;
  --border-focus: #60A5FA;

  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);

  /* 主色 - 在暗色模式下调整亮度 */
  --primary-50: #1E3A5F;
  --primary-100: #1E4A7A;
  --primary-500: #60A5FA;
  --primary-600: #3B82F6;
  --primary-700: #2563EB;
}
```

### 3.2 JavaScript 主题切换代码

```javascript
/**
 * 主题切换系统
 * 支持 Light / Dark / System 三种模式
 */

class ThemeManager {
  constructor() {
    this.currentTheme = 'system';
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.init();
  }

  init() {
    // 读取本地存储的主题设置
    const saved

    const savedTheme = localStorage.getItem('theme') || 'system';
    this.setTheme(savedTheme);
    
    // 监听系统主题变化
    this.mediaQuery.addEventListener('change', (e) => {
      if (this.currentTheme === 'system') {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * 设置主题
   * @param {string} theme - 'light' | 'dark' | 'system'
   */
  setTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    if (theme === 'system') {
      const prefersDark = this.mediaQuery.matches;
      this.applyTheme(prefersDark ? 'dark' : 'light');
    } else {
      this.applyTheme(theme);
    }
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: this.currentTheme } 
    }));
  }

  /**
   * 应用主题到 DOM
   * @param {string} theme - 'light' | 'dark'
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // 更新 meta theme-color（移动端浏览器主题色）
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0F172A' : '#FFFFFF');
    }
  }

  /**
   * 获取当前主题
   * @returns {string} 当前主题 'light' | 'dark' | 'system'
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * 切换主题（循环: light -> dark -> system）
   */
  toggleTheme() {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }
}

// 初始化主题管理器
const themeManager = new ThemeManager();

// 导出供全局使用
window.themeManager = themeManager;
```

### 3.3 HTML 主题切换按钮示例

```html
<!-- 主题切换按钮 -->
<div class="theme-toggle">
  <button class="theme-btn" onclick="themeManager.toggleTheme()" aria-label="切换主题">
    <!-- Light 图标 -->
    <svg class="icon-light" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
    <!-- Dark 图标 -->
    <svg class="icon-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
    <!-- System 图标 -->
    <svg class="icon-system" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  </button>
</div>
```

### 3.4 CSS 主题切换按钮样式

```css
.theme-toggle {
  position: relative;
}

.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-primary);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  transform: scale(1.05);
}

.theme-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

/* 根据当前主题显示对应图标 */
[data-theme="light"] .icon-dark,
[data-theme="light"] .icon-system,
[data-theme="dark"] .icon-light,
[data-theme="dark"] .icon-system {
  display: none;
}

/* System 模式显示太阳图标 */
[data-theme="light"] .icon-light,
[data-theme="dark"] .icon-dark {
  display: block;
}
```

---

## 4. 首页信息架构

### 4.1 页面结构概览

```
┌─────────────────────────────────────────────────────────────┐
│                        Header 导航栏                          │
│  [Logo]  [主导航]                    [搜索] [语言] [主题]      │
├─────────────────────────────────────────────────────────────┤
│                          Hero 主视觉                           │
│                    大标题 + 副标题 + CTA按钮                    │
├─────────────────────────────────────────────────────────────┤
│                      产品分类导航                               │
│         [光谱仪] [光学平台] [电动滑台] [激光器] ...            │
├─────────────────────────────────────────────────────────────┤
│                      热门产品展示                               │
│              产品卡片网格 (图片+名称+简介+按钮)                 │
├─────────────────────────────────────────────────────────────┤
│                      应用案例/解决方案                          │
│         行业应用场景展示 (科研/工业/医疗等)                     │
├─────────────────────────────────────────────────────────────┤
│                      公司优势/特色                              │
│              技术实力 | 服务网络 | 资质认证                     │
├─────────────────────────────────────────────────────────────┤
│                      新闻动态                                   │
│              最新资讯列表                                       │
├─────────────────────────────────────────────────────────────┤
│                      合作伙伴/客户                              │
│              Logo 墙展示                                        │
├─────────────────────────────────────────────────────────────┤
│                      CTA 行动召唤                               │
│              联系我们 / 获取报价 / 技术支持                     │
├─────────────────────────────────────────────────────────────┤
│                        Footer 页脚                              │
│  产品分类 | 服务支持 | 关于我们 | 联系方式 | 社交媒体         │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Header 导航栏设计

```html
<header class="site-header">
  <div class="container">
    <div class="header-inner">
      <!-- Logo -->
      <a href="/" class="logo">
        <img src="/logo.svg" alt="公司名称" width="160" height="40">
      </a>
      
      <!-- 主导航 -->
      <nav class="main-nav">
        <ul class="nav-list">
          <li class="nav-item has-dropdown">
            <a href="/products" class="nav-link">产品中心</a>
            <!-- 下拉菜单 -->
            <div class="dropdown-menu">
              <div class="dropdown-grid">
                <div class="dropdown-column">
                  <h4>光谱仪器</h4>
                  <ul>
                    <li><a href="/products/raman">拉曼光谱仪</a></li>
                    <li><a href="/products/fluorescence">荧光光谱仪</a></li>
                    <li><a href="/products/absorption">吸收光谱仪</a></li>
                  </ul>
                </div>
                <div class="dropdown-column">
                  <h4>精密位移</h4>
                  <ul>
                    <li><a href="/products/stage">电动位移台</a></li>
                    <li><a href="/products/manual-stage">手动位移台</a></li>
                    <li><a href="/products/controller">运动控制器</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li class="nav-item"><a href="/solutions" class="nav-link">解决方案</a></li>
          <li class="nav-item"><a href="/applications" class="nav-link">应用案例</a></li>
          <li class="nav-item"><a href="/support" class="nav-link">技术支持</a></li>
          <li class="nav-item"><a href="/about" class="nav-link">关于我们</a></li>
        </ul>
      </nav>
      
      <!-- 右侧工具栏 -->
      <div class="header-tools">
        <button class="search-btn" aria-label="搜索">
          <svg><!-- 搜索图标 --></svg>
        </button>
        <div class="language-switcher">
          <button class="lang-btn">CN</button>
        </div>
        <div class="theme-toggle">
          <!-- 主题切换按钮 -->
        </div>
      </div>
      
      <!-- 移动端菜单按钮 -->
      <button class="mobile-menu-btn" aria-label="菜单">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </
  </div>
</header>
```

#### Header CSS 样式
```css
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  backdrop-filter: blur(10px);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo img {
  height: 40px;
  width: auto;
}

/* 主导航 */
.main-nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  gap: var(--space-8);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) 0;
  color: var(--text-primary);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--primary-600);
}

/* 下拉菜单 */
.nav-item.has-dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  min-width: 600px;
  padding: var(--space-6);
  background: var(--bg-elevated);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.dropdown-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
}

.dropdown-column h4 {
  margin: 0 0 var(--space-3);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dropdown-column ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-column li {
  margin-bottom: var(--space-2);
}

.dropdown-column a {
  display: block;
  padding: var(--space-2) 0;
  color: var(--text-secondary);
  font-size: var(--font-size-body);
  text-decoration: none;
  transition: color 0.2s ease;
}

.dropdown-column a:hover {
  color: var(--primary-600);
}

/* 工具栏 */
.header-tools {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.search-btn,
.lang-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-btn:hover,
.lang-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
```

### 4.3 Hero 主视觉区设计

```html
<section class="hero">
  <div class="hero-background">
    <img src="/images/hero-bg.jpg" alt="">
    <div class="hero-overlay"></div>
  </div>
  <div class="container">
    <div class="hero-content">
      <h1 class="hero-title">
        精密光学仪器<br>
        <span class="text-gradient">引领科研创新</span>
      </h1>
      <p class="hero-subtitle">
        二十余年专注光谱分析、精密位移、光学平台等领域<br>
        为科研机构和工业企业提供可靠的精密仪器解决方案
      </p>
      <div class="hero-actions">
        <a href="/products" class="btn btn-primary btn-lg">
          浏览产品
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <a href="/contact" class="btn btn-outline btn-lg">
          联系我们
        </a>
      </div>
      <div class="hero-stats">
        <div class="stat-item">
          <span class="stat-number">20+</span>
          <span class="stat-label">年行业经验</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">5000+</span>
          <span class="stat-label">服务客户</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">100+</span>
          <span class="stat-label">产品系列</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### Hero CSS 样式
```css
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: calc(72px + var(--space-16)) 0 var(--space-16);
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.hero-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.9) 0%,
    rgba(15, 23, 42, 0.7) 50%,
    rgba(15, 23, 42, 0.5) 100%
  );
}

.hero-content {
  max-width: 800px;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: #FFFFFF;
  margin: 0 0 var(--space-6);
}

.text-gradient {
  background: linear-gradient(135deg, #60A5FA 0%, #34D399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-body-lg);
  line-height: var(--line-height-relaxed);
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 var(--space-8);
}

.hero-actions {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-12);
}

.hero-stats {
  display: flex;
  gap: var(--space-12);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
  color: #FFFFFF;
}

.stat-label {
  font-size: var(--font-size-body-sm);
  color: rgba(255, 255, 255, 0.6);
}
```

### 4.4 产品展示区设计

```html
<section class="products-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">热门产品</h2>
      <p class="section-subtitle">覆盖光谱分析、精密位移、光学平台等核心领域</p>
    </div>
    
    <!-- 产品分类标签 -->
    <div class="product-tabs">
      <button class="tab-btn active" data-category="all">全部</button>
      <button class="tab-btn" data-category="spectrometer">光谱仪</button>
      <button class="tab-btn" data-category="stage">位移台</button>
      <button class="tab-btn" data-category="platform">光学平台</button>
      <button class="tab-btn" data-category="laser">激光器</button>
    </div>
    
    <!-- 产品网格 -->
    <div class="products-grid">
      <article class="product-card">
        <div class="product-image">
          <img src="/images/products/raman.jpg" alt="拉曼光谱仪" loading="lazy">
          <div class="product-badge">热销</div>
        </div>
        <div class="product-content">
          <h3 class="product-title">高分辨拉曼光谱仪</h3>
          <p class="product-desc">采用先进的光栅分光技术，分辨率可达0.5cm⁻¹，适用于材料表征、生物医学等领域</p>
          <div class="product-meta">
            <span class="product-category">光谱仪</span>
            <a href="/products/raman" class="product-link">
              了解详情
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </article>
      
      <!-- 更多产品卡片... -->
    </div>
    
    <div class="section-footer">
      <a href="/products" class="btn btn-outline">
        查看全部产品
        <svg class="btn-icon" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  </div>
</section>
```

#### 产品卡片 CSS 样式
```css
.products-section {
  padding: var(--section-padding-y-lg) 0;
  background: var(--bg-secondary);
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto var(--space-12);
}

.section-title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-
4);
}

.section-subtitle {
  font-size: var(--font-size-body-lg);
  color: var(--text-secondary);
  margin: 0;
}

/* 产品标签 */
.product-tabs {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-10);
  flex-wrap: wrap;
}

.tab-btn {
  padding: var(--space-3) var(--space-6);
  border: 1px solid var(--border-primary);
  border-radius: 9999px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  border-color: var(--primary-500);
  color: var(--primary-600);
}

.tab-btn.active {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: #FFFFFF;
}

/* 产品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-10);
}

/* 产品卡片 */
.product-card {
  background: var(--bg-primary);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-primary);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--border-secondary);
}

.product-image {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--bg-secondary);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  padding: var(--space-1) var(--space-3);
  background: var(--color-accent-500);
  color: #FFFFFF;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  border-radius: 9999px;
}

.product-content {
  padding: var(--space-6);
}

.product-title {
  font-size: var(--font-size-h5);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-3);
}

.product-desc {
  font-size: var(--font-size-body-sm);
  line-height: var(--line-height-relaxed);
  color: var(--text-secondary);
  margin: 0 0 var(--space-4);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-category {
  padding: var(--space-1) var(--space-3);
  background: var(--primary-50);
  color: var(--primary-700);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-medium);
  border-radius: 4px;
}

.product-link {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--primary-600);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: color 0.2s ease;
}

.product-link:hover {
  color: var(--primary-700);
}

.product-link svg {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.product-link:hover svg {
  transform: translateX(4px);
}

.section-footer {
  text-align: center;
}
```

### 4.5 Footer 页脚设计

```html
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <!-- 公司信息 -->
      <div class="footer-brand">
        <img src="/logo-white.svg" alt="公司名称" class="footer-logo">
        <p class="footer-desc">
          专注精密仪器研发制造二十余年，为科研机构和工业企业提供高品质的光谱分析、精密位移、光学平台等产品与解决方案。
        </p>
        <div class="footer-social">
          <a href="#" aria-label="微信"><svg><!-- 微信图标 --></svg></a>
          <a href="#" aria-label="微博"><svg><!-- 微博图标 --></svg></a>
          <a href="#" aria-label="LinkedIn"><svg><!-- LinkedIn图标 --></svg></a>
        </div>
      </div>
      
      <!-- 产品分类 -->
      <div class="footer-column">
        <h4>产品中心</h4>
        <ul>
          <li><a href="/products/spectrometer">光谱仪器</a></li>
          <li><a href="/products/stage">精密位移台</a></li>
          <li><a href="/products/platform">光学平台</a></li>
          <li><a href="/products/laser">激光器</a></li>
          <li><a href="/products/accessories">光学附件</a></li>
        </ul>
      </div>
      
      <!-- 服务支持 -->
      <div class="footer-column">
        <h4>服务支持</h4>
        <ul>
          <li><a href="/support/download">资料下载</a></li>
          <li><a href="/support/manual">使用手册</a></li>
          <li><a href="/support/faq">常见问题</a></li>
          <li><a href="/support/maintenance">维护保养</a></li>
          <li><a href="/support/training">培训服务</a></li>
        </ul>
      </div>
      
      <!-- 关于我们 -->
      <div class="footer-column">
        <h4>关于我们</h4>
        <ul>
          <li><a href="/about/company">公司简介</a></li>
          <li><a href="/about/news">新闻动态</a></li>
          <li><a href="/about/careers">人才招聘</a></li>
          <li><a href="/about/contact">联系我们</a></li>
        </ul>
      </div>
      
      <!-- 联系方式 -->
      <div class="footer-column">
        <h4>联系方式</h4>
        <ul class="contact-list">
          <li>
            <svg><!-- 电话图标 --></svg>
            <span>400-XXX-XXXX</span>
          </li>
          <li>
            <svg><!-- 邮箱图标 --></svg>
            <span>sales@company.com</span>
          </li>
          <li>
            <svg><!-- 地址图标 --></svg>
            <span>北京市XXX区XXX路XXX号</span>
          </li>
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p class="copyright">© 2024 公司名称. All rights reserved.</p>
      <div class="footer-links">
        <a href="/privacy">隐私政策</a>
        <a href="/terms">使用条款</a>
        <a href="/sitemap">网站地图</a>
      </div>
    </div>
  </div>
</footer>
```

#### Footer CSS 样式
```css
.site-footer {
  background: var(--color-gray-900);
  color: #FFFFFF;
  padding: var(--space-16) 0 var(--space-8);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  gap: var(--space-10);
  margin-bottom: var(--space-10);
}

.footer-brand {
  max-width: 320px;
}

.footer-logo {
  height: 40px;
  margin-bottom: var(--space-4);
}

.footer-desc {
  font-size: var(--font-size-body-sm);
  line-height: var(--line-height-relaxed);
  color: var(--color-gray-400);
  margin: 0 0 var(--space-6);
}

.footer-social {
  display: flex;
  gap: var(--space-3);
}

.footer-social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  transition: all 0.2s ease;
}

.footer-social a:hover {
  background: var(--primary-500);
  transform: translateY(-2px);
}

.footer-column h4 {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: #FFFFFF;
  margin: 0 0 var(--space-4);
}

.footer-column ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-column li {
  margin-bottom: var(--space-3);
}

.footer-column a {
  color: var(--color-gray-400);
  font-size: var(--font-size-body-sm);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-column a:hover {
  color: #FFFFFF;
}

.contact-list li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.contact-list svg {
  width: 20px;
  height: 20px;
  color: var(--primary-500);
  flex-shrink: 0;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright {
  font-size: var(--font-size-body-sm);
  color: var(--color-gray-500);
  margin: 0;
}

.footer-links {
  display: flex;
  gap: var(--space
);
}

.footer-links a {
  color: var(--color-gray-400);
  font-size: var(--font-size-body-sm);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #FFFFFF;
}

/* 响应式 Footer */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .footer-brand {
    grid-column: span 2;
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-brand {
    grid-column: span 1;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: var(--space-4);
    text-align: center;
  }
}
```

---

## 5. 组件设计规范

### 5.1 按钮组件 (Button)

```html
<!-- 按钮变体 -->
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-secondary">次要按钮</button>
<button class="btn btn-outline">边框按钮</button>
<button class="btn btn-ghost">幽灵按钮</button>
<button class="btn btn-danger">危险按钮</button>

<!-- 按钮尺寸 -->
<button class="btn btn-primary btn-sm">小按钮</button>
<button class="btn btn-primary">默认按钮</button>
<button class="btn btn-primary btn-lg">大按钮</button>

<!-- 带图标的按钮 -->
<button class="btn btn-primary">
  <svg class="btn-icon" viewBox="0 0 24 24"><!-- 图标 --></svg>
  按钮文字
</button>
```

```css
/* 基础按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 按钮变体 */
.btn-primary {
  background: var(--primary-600);
  border-color: var(--primary-600);
  color: #FFFFFF;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-700);
  border-color: var(--primary-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--color-gray-100);
  border-color: var(--color-gray-200);
  color: var(--text-primary);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-gray-200);
}

.btn-outline {
  background: transparent;
  border-color: var(--border-secondary);
  color: var(--text-primary);
}

.btn-outline:hover:not(:disabled) {
  background: var(--bg-secondary);
  border-color: var(--text-primary);
}

.btn-ghost {
  background: transparent;
  border-color: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-danger {
  background: var(--color-error);
  border-color: var(--color-error);
  color: #FFFFFF;
}

.btn-danger:hover:not(:disabled) {
  background: #DC2626;
}

/* 按钮尺寸 */
.btn-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-body-sm);
  border-radius: 6px;
}

.btn-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-body-lg);
  border-radius: 10px;
}

/* 按钮图标 */
.btn-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.btn-sm .btn-icon {
  width: 16px;
  height: 16px;
}

.btn-lg .btn-icon {
  width: 24px;
  height: 24px;
}
```

### 5.2 卡片组件 (Card)

```html
<!-- 基础卡片 -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">卡片标题</h3>
    <p class="card-subtitle">卡片副标题</p>
  </div>
  <div class="card-body">
    <p>卡片内容...</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">操作</button>
  </div>
</div>

<!-- 带图片的卡片 -->
<div class="card card-image">
  <div class="card-image-wrapper">
    <img src="image.jpg" alt="描述">
  </div>
  <div class="card-body">
    <h3 class="card-title">标题</h3>
    <p class="card-text">内容描述...</p>
  </div>
</div>
```

```css
.card {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--border-secondary);
}

.card-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-primary);
}

.card-title {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.card-subtitle {
  font-size: var(--font-size-body-sm);
  color: var(--text-secondary);
  margin: var(--space-1) 0 0;
}

.card-body {
  padding: var(--space-6);
}

.card-footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-primary);
  background: var(--bg-secondary);
}

/* 带图片的卡片 */
.card-image .card-image-wrapper {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-image:hover img {
  transform: scale(1.05);
}
```

### 5.3 表单组件 (Form)

```html
<!-- 输入框 -->
<div class="form-group">
  <label class="form-label" for="email">邮箱地址</label>
  <input type="email" id="email" class="form-input" placeholder="请输入邮箱">
  <p class="form-hint">我们将通过此邮箱与您联系</p>
</div>

<!-- 带图标的输入框 -->
<div class="form-group">
  <label class="form-label">搜索</label>
  <div class="form-input-group">
    <svg class="form-icon" viewBox="0 0 24 24"><!-- 搜索图标 --></svg>
    <input type="text" class="form-input" placeholder="搜索产品...">
  </div>
</div>

<!-- 文本域 -->
<div class="form-group">
  <label class="form-label">留言内容</label>
  <textarea class="form-textarea" rows="4" placeholder="请输入留言"></textarea>
</div>

<!-- 选择框 -->
<div class="form-group">
  <label class="form-label">产品类型</label>
  <select class="form-select">
    <option value="">请选择</option>
    <option value="spectrometer">光谱仪</option>
    <option value="stage">位移台</option>
  </select>
</div>

<!-- 复选框 -->
<div class="form-checkbox">
  <input type="checkbox" id="agree" class="checkbox-input">
  <label for="agree" class="checkbox-label">
    <span class="checkbox-box"></span>
    我同意隐私政策
  </label>
</div>
```

```css
.form-group {
  margin-bottom: var(--space-5);
}

.form-label {
  display: block;
  margin-bottom: var(--space-2);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-body);
  line-height: 1.5;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-muted);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-hint {
  margin: var(--space-2) 0 0;
  font-size: var(--font-size-caption);
  color: var(--text-tertiary);
}

/* 带图标的输入框 */
.form-input-group {
  position: relative;
}

.form-input-group .form-icon {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-muted);
}

.form-input-group .form-input {
  padding-left: calc(var(--space-4) + 24px + var(--space-2));
}

/* 复选框 */
.form-checkbox {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  font-size: var(--font-size-body);
  color: var(--text-secondary);
}

.checkbox-box {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-secondary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-label .checkbox-box {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.checkbox-box::after {
  content: '';
  width: 10px;
  height: 10px;
  background: #FFFFFF;
  border-radius: 2px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-label .checkbox-box::after {
  opacity: 1;
  transform: scale(1);
}
```

### 5.4 模态框组件 (Modal)

```html
<!-- 模态框结构 -->
<div class="modal-overlay" id="modal">
  <div class="modal-container">
    <div class="modal-header">
      <h3 class="modal-title">模态框标题</h3>
      <button class="modal-close" aria-label="关闭">
        <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <p>模态框内容...</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" data-close>取消</button>
      <button class="btn btn-primary">确认</button>
    </div>
  </div>
</div>
```

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: var(--bg-overlay);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

.modal-container {
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - var(--space-8));
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  transform: scale(0.95) translateY(10px);
  transition: transform 0.3s ease;
}

.modal-overlay.active .modal-container {
  transform: scale(1) translateY(0);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--border-primary);
}

.modal-title {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: var(--space-6);
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-primary);
  background: var(--bg-secondary);
}
```

---

## 附录：完整 CSS 文件结构建议

```
styles/
├── base/
│   ├── _reset.css          # 重置样式
│   ├── _variables.css      # CSS 变量定义
│   └── _typography.css     # 排版基础
├── components/
│   ├── _buttons.css        # 按钮组件
│   ├── _cards.css          # 卡片组件
│   ├── _forms.css          # 表单组件
│   ├── _modal.css          # 模态框组件
│   └── _theme-toggle.css   # 主题切换
├── layout/
│   ├── _grid.css           # 网格系统
│   ├── _header.css         # 页头
│   ├── _footer.css         # 页脚
│   └── _sections.css       # 页面区块
├── pages/
│   ├── _home.css           # 首页
│   └── _product.css        # 产品页
├── themes/
│   ├── _light.css          # 亮色主题
│   └── _dark.css           # 暗色主题
└── main.css                # 主入口文件
```

---

## 使用说明

1. **引入 CSS 文件**：按顺序引入基础样式、组件样式、布局样式
2. **初始化主题**：在页面加载时调用 `themeManager.init()`
3. **使用 CSS 变量**：所有颜色、间距、字体都通过 CSS 变量定义，支持主题切换
4. **响应式开发**：使用提供的断点和网格系统进行响应式布局

---

*文档版本: 1.0*
*最后更新: 2024年*
