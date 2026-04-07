/**
 * 精密仪器公司官网 - 搜索功能
 * 支持实时搜索建议和搜索结果页面
 */

(function() {
  'use strict';

  const Search = {
    // 搜索配置
    config: {
      minQueryLength: 2,
      debounceDelay: 300,
      maxSuggestions: 8,
      searchDelay: 500
    },

    // 搜索数据
    searchData: [],
    
    // 搜索状态
    state: {
      query: '',
      isSearching: false,
      selectedIndex: -1,
      suggestions: []
    },

    // 防抖定时器
    debounceTimer: null,

    /**
     * 初始化搜索功能
     */
    init() {
      this.loadSearchData();
      this.initSearchUI();
      this.bindEvents();
      console.log('[Search] 初始化完成');
    },

    /**
     * 加载搜索数据
     */
    async loadSearchData() {
      try {
        // 从API获取数据
        if (window.API && window.API.products) {
          const response = await window.API.products.getList();
          const products = response.data || response || [];
          this.searchData = this.processSearchData(products);
        } else {
          // 从DOM解析数据
          this.searchData = this.parseSearchDataFromDOM();
        }
      } catch (error) {
        console.warn('[Search] 加载搜索数据失败:', error);
        this.searchData = this.parseSearchDataFromDOM();
      }
    },

    /**
     * 从DOM解析搜索数据
     */
    parseSearchDataFromDOM() {
      const items = [];
      
      // 解析产品
      document.querySelectorAll('.product-card, [data-product]').forEach(card => {
        items.push({
          id: card.dataset.productId || card.dataset.id,
          type: 'product',
          title: card.querySelector('.product-name, h3')?.textContent?.trim() || '',
          description: card.querySelector('.product-description, p')?.textContent?.trim() || '',
          category: card.dataset.category || '',
          price: card.dataset.price || '',
          url: card.querySelector('a')?.href || `#product-${card.dataset.productId}`,
          image: card.querySelector('img')?.src || ''
        });
      });

      // 解析页面内容
      document.querySelectorAll('section[data-searchable], article[data-searchable]').forEach(section => {
        const title = section.querySelector('h1, h2, h3')?.textContent?.trim();
        if (title) {
          items.push({
            id: section.id || '',
            type: 'page',
            title: title,
            description: section.querySelector('p')?.textContent?.trim().substring(0, 100) + '...' || '',
            url: `#${section.id}`,
            category: 'page'
          });
        }
      });

      return items;
    },

    /**
     * 处理搜索数据
     */
    processSearchData(products) {
      return products.map(product => ({
        id: product.id,
        type: 'product',
        title: product.name || product.title || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price || '',
        url: product.url || `#product-${product.id}`,
        image: product.image || ''
      }));
    },

    /**
     * 初始化搜索UI
     */
    initSearchUI() {
      // 检查是否已有搜索框
      const existingSearch = document.querySelector('.search-container, [data-search-container]');
      if (!existingSearch) {
        this.createSearchContainer();
      }
    },

    /**
     * 创建搜索容器
     */
    createSearchContainer() {
      const header = document.querySelector('.header, header, .navbar');
      if (!header) return;

      const searchHTML = `
        <div class="search-container" data-search-container>
          <div class="search-box">
            <input type="text" 
                   class="search-input" 
                   data-search-input
                   placeholder="搜索产品、技术文档..." 
                   autocomplete="off">
            <button class="search-btn" data-search-btn>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
          <div class="search-suggestions" data-search-suggestions hidden></div>
        </div>
      `;

      const nav = header.querySelector('.nav, nav, .nav-links');
      if (nav) {
        nav.insertAdjacentHTML('beforebegin', searchHTML);
      } else {
        header.insertAdjacentHTML('beforeend', searchHTML);
      }
    },

    /**
     * 绑定事件
     */
    bindEvents() {
      // 搜索输入
      const searchInput = document.querySelector('[data-search-input]');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.handleInput(e));
        searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        searchInput.addEventListener('focus', () => this.showSuggestions());
      }

      // 搜索按钮
      const searchBtn = document.querySelector('[data-search-btn]');
      if (searchBtn) {
        searchBtn.addEventListener('click', () => this.performSearch());
      }

      // 点击外部关闭建议
      document.addEventListener('click', (e) => {
        if (!e.target.closest('[data-search-container]')) {
          this.hideSuggestions();
        }
      });

      // 表单提交
      const searchForm = document.querySelector('[data-search-form]');
      if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.performSearch();
        });
      }

      // 监听产品数据更新
      window.addEventListener('productsLoaded', (e) => {
        const products = e.detail.products || [];
        this.searchData = this.processSearchData(products);
      });
    },

    /**
     * 处理输入
     */
    handleInput(e) {
      const query = e.target.value.trim();
      this.state.query = query;

      clearTimeout(this.debounceTimer);

      if (query.length < this.config.minQueryLength) {
        this.hideSuggestions();
        return;
      }

      this.debounceTimer = setTimeout(() => {
        this.updateSuggestions(query);
      }, this.config.debounceDelay);
    },

    /**
     * 处理键盘事件
     */
    handleKeydown(e) {
      const suggestions = this.state.suggestions;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.state.selectedIndex = Math.min(
            this.state.selectedIndex + 1, 
            suggestions.length - 1
          );
          this.highlightSuggestion();
          break;

        case 'ArrowUp':
          e.preventDefault();
          this.state.selectedIndex = Math.max(this.state.selectedIndex - 1, -1);
          this.highlightSuggestion();
          break;

        case 'Enter':
          e.preventDefault();
          if (this.state.selectedIndex >= 0 && suggestions[this.state.selectedIndex]) {
            this.selectSuggestion(suggestions[this.state.selectedIndex]);
          } else {
            this.performSearch();
          }
          break;

        case 'Escape':
          this.hideSuggestions();
          break;
      }
    },

    /**
     * 更新搜索建议
     */
    updateSuggestions(query) {
      const results = this.search(query);
      this.state.suggestions = results.slice(0, this.config.maxSuggestions);
      this.state.selectedIndex = -1;
      this.renderSuggestions();
    },

    /**
     * 执行搜索
     */
    search(query) {
      if (!query || query.length < this.config.minQueryLength) {
        return [];
      }

      const lowerQuery = query.toLowerCase();
      
      return this.searchData.filter(item => {
        const titleMatch = item.title?.toLowerCase().includes(lowerQuery);
        const descMatch = item.description?.toLowerCase().includes(lowerQuery);
        const categoryMatch = item.category?.toLowerCase().includes(lowerQuery);
        
        return titleMatch || descMatch || categoryMatch;
      }).map(item => ({
        ...item,
        relevance: this.calculateRelevance(item, lowerQuery)
      })).sort((a, b) => b.relevance - a.relevance);
    },

    /**
     * 计算相关性分数
     */
    calculateRelevance(item, query) {
      let score = 0;
      const title = item.title?.toLowerCase() || '';
      const desc = item.description?.toLowerCase() || '';

      // 标题完全匹配得分最高
      if (title === query) score += 100;
      // 标题开头匹配
      else if (title.startsWith(query)) score += 80;
      // 标题包含
      else if (title.includes(query)) score += 60;
      // 描述开头匹配
      else if (desc.startsWith(query)) score += 40;
      // 描述包含
      else if (desc.includes(query)) score += 20;

      // 产品类型优先
      if (item.type === 'product') score += 10;

      return score;
    },

    /**
     * 渲染建议列表
     */
    renderSuggestions() {
      const container = document.querySelector('[data-search-suggestions]');
      if (!container) return;

      const suggestions = this.state.suggestions;

      if (suggestions.length === 0) {
        container.innerHTML = `
          <div class="search-no-results">
            <span>未找到相关结果</span>
          </div>
        `;
      } else {
        container.innerHTML = suggestions.map((item, index) => `
          <div class="search-suggestion ${item.type}" 
               data-suggestion-index="${index}"
               data-suggestion-id="${item.id}">
            ${item.image ? `<img src="${item.image}" alt="" class="suggestion-thumb">` : ''}
            <div class="suggestion-content">
              <div class="suggestion-title">${this.highlightMatch(item.title, this.state.query)}</div>
              ${item.description ? `<div class="suggestion-desc">${item.description.substring(0, 60)}...</div>` : ''}
              ${item.price ? `<div class="suggestion-price">${item.price}</div>` : ''}
            </div>
            <span class="suggestion-type">${this.getTypeLabel(item.type)}</span>
          </div>
        `).join('');

        // 绑定点击事件
        container.querySelectorAll('[data-suggestion-index]').forEach(el => {
          el.addEventListener('click', () => {
            const index = parseInt(el.dataset.suggestionIndex);
            this.selectSuggestion(suggestions[index]);
          });
        });
      }

      container.hidden = false;
    },

    /**
     * 高亮匹配文本
     */
    highlightMatch(text, query) {
      if (!text || !query) return text;
      const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    },

    /**
     * 获取类型标签
     */
    getTypeLabel(type) {
      const labels = {
        product: '产品',
        page: '页面',
        document: '文档'
      };
      return labels[type] || type;
    },

    /**
     * 高亮当前选中的建议
     */
    highlightSuggestion() {
      const container = document.querySelector('[data-search-suggestions]');
      if (!container) return;

      container.querySelectorAll('[data-suggestion-index]').forEach((el, index) => {
        el.classList.toggle('selected', index === this.state.selectedIndex);
      });
    },

    /**
     * 选择建议
     */
    selectSuggestion(item) {
      this.hideSuggestions();
      
      if (item.url) {
        window.location.href = item.url;
      } else {
        this.performSearch(item.title);
      }
    },

    /**
     * 显示建议
     */
    showSuggestions() {
      if (this.state.suggestions.length > 0) {
        const container = document.querySelector('[data-search-suggestions]');
        if (container) container.hidden = false;
      }
    },

    /**
     * 隐藏建议
     */
    hideSuggestions() {
      const container = document.querySelector('[data-search-suggestions]');
      if (container) container.hidden = true;
      this.state.selectedIndex = -1;
    },

    /**
     * 执行搜索并跳转
     */
    performSearch(query = null) {
      const searchQuery = query || this.state.query;
      if (!searchQuery || searchQuery.length < this.config.minQueryLength) {
        return;
      }

      this.hideSuggestions();
      this.state.isSearching = true;

      // 触发搜索事件
      window.dispatchEvent(new CustomEvent('searchPerformed', {
        detail: { query: searchQuery }
      }));

      // 如果当前在搜索页面，更新结果
      if (document.querySelector('[data-search-results]')) {
        this.displaySearchResults(searchQuery);
      } else {
        // 跳转到搜索页面
        const searchUrl = `search.html?q=${encodeURIComponent(searchQuery)}`;
        window.location.href = searchUrl;
      }
    },

    /**
     * 显示搜索结果
     */
    displaySearchResults(query) {
      const results = this.search(query);
      const container = document.querySelector('[data-search-results]');
      if (!container) return;

      container.innerHTML = `
        <div class="search-results-header">
          <h2>"${query}" 的搜索结果</h2>
          <span class="results-count">找到 ${results.length} 个结果</span>
        </div>
        <div class="search-results-list">
          ${results.length === 0 ? `
            <div class="search-no-results">
              <h3>未找到相关结果</h3>
              <p>请尝试其他关键词或检查拼写</p>
            </div>
          ` : results.map(item => `
            <div class="search-result-item ${item.type}">
              ${item.image ? `<img src="${item.image}" alt="${item.title}" class="result-image">` : ''}
              <div class="result-content">
                <h3><a href="${item.url}">${this.highlightMatch(item.title, query)}</a></h3>
                <p>${item.description || ''}</p>
                <div class="result-meta">
                  <span class="result-type">${this.getTypeLabel(item.type)}</span>
                  ${item.category ? `<span class="result-category">${item.category}</span>` : ''}
                  ${item.price ? `<span class="result-price">${item.price}</span>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      this.state.isSearching = false;
    }
  };

  // 转义正则特殊字符
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 暴露到全局
  window.Search = Search;

  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Search.init());
  } else {
    Search.init();
  }
})();
