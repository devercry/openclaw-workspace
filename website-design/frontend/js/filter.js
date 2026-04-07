/**
 * 精密仪器公司官网 - 产品筛选功能
 * 支持按类别、价格、应用场景筛选产品
 */

(function() {
  'use strict';

  const ProductFilter = {
    filters: {
      category: [],
      priceRange: null,
      application: []
    },

    products: [],

    priceRanges: [
      { id: '0-10000', label: '¥0 - ¥10,000', min: 0, max: 10000 },
      { id: '10000-50000', label: '¥10,000 - ¥50,000', min: 10000, max: 50000 },
      { id: '50000-100000', label: '¥50,000 - ¥100,000', min: 50000, max: 100000 },
      { id: '100000+', label: '¥100,000+', min: 100000, max: Infinity }
    ],

    categories: [
      { id: 'spectrometer', label: '光谱仪', icon: '🔬' },
      { id: 'displacement', label: '位移台', icon: '📐' },
      { id: 'optical', label: '光学平台', icon: '🔲' },
      { id: 'laser', label: '激光器', icon: '💡' }
    ],

    applications: [
      { id: 'research', label: '科研实验' },
      { id: 'industrial', label: '工业检测' },
      { id: 'medical', label: '医疗诊断' },
      { id: 'semiconductor', label: '半导体制造' },
      { id: 'aerospace', label: '航空航天' },
      { id: 'new-energy', label: '新能源' }
    ],

    init() {
      this.loadProducts();
      this.initFilterUI();
      this.bindEvents();
      console.log('[ProductFilter] 初始化完成');
    },

    async loadProducts() {
      try {
        if (window.API && window.API.products) {
          const response = await window.API.products.getList();
          this.products = response.data || response || [];
        } else {
          this.products = this.parseProductsFromDOM();
        }
      } catch (error) {
        console.warn('[ProductFilter] 加载产品数据失败:', error);
        this.products = this.parseProductsFromDOM();
      }
    },

    parseProductsFromDOM() {
      const productCards = document.querySelectorAll('.product-card, [data-product]');
      return Array.from(productCards).map(card => {
        const priceText = card.querySelector('.product-price, [data-price]')?.textContent || '0';
        const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;
        
        return {
          id: card.dataset.productId || card.dataset.id,
          element: card,
          category: card.dataset.category,
          price: price,
          application: card.dataset.application?.split(',') || [],
          name: card.querySelector('.product-name, h3')?.textContent || ''
        };
      });
    },

    initFilterUI() {
      const filterContainer = document.querySelector('.filter-section, [data-filter-container]');
      if (!filterContainer) {
        this.createFilterContainer();
      }
    },

    createFilterContainer() {
      const productSection = document.querySelector('.products-section, #products');
      if (!productSection) return;

      const filterHTML = `
        <div class="filter-section" data-filter-container>
          <div class="filter-header">
            <h3 class="filter-title">筛选产品</h3>
            <button class="filter-reset" data-filter-reset>重置筛选</button>
          </div>
          
          <div class="filter-group" data-filter-group="category">
            <h4 class="filter-group-title">产品类别</h4>
            <div class="filter-options">
              ${this.categories.map(cat => `
                <label class="filter-option">
                  <input type="checkbox" value="${cat.id}" data-filter="category">
                  <span class="filter-label">${cat.icon} ${cat.label}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="filter-group" data-filter-group="price">
            <h4 class="filter-group-title">价格区间</h4>
            <div class="filter-options">
              ${this.priceRanges.map(range => `
                <label class="filter-option">
                  <input type="radio" name="price-range" value="${range.id}" data-filter="price">
                  <span class="filter-label">${range.label}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="filter-group" data-filter-group="application">
            <h4 class="filter-group-title">应用场景</h4>
            <div class="filter-options">
              ${this.applications.map(app => `
                <label class="filter-option">
                  <input type="checkbox" value="${app.id}" data-filter="application">
                  <span class="filter-label">${app.label}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="filter-results">
            <span class="results-count">显示全部 ${this.products.length} 个产品</span>
          </div>
        </div>
      `;

      productSection.insertAdjacentHTML('beforebegin', filterHTML);
    },

    bindEvents() {
      document.querySelectorAll('[data-filter="category"]').forEach(input => {
        input.addEventListener('change', (e) => this.handleCategoryChange(e));
      });

      document.querySelectorAll('[data-filter="price"]').forEach(input => {
        input.addEventListener('change', (e) => this.handlePriceChange(e));
      });

      document.querySelectorAll('[data-filter="application"]').forEach(input => {
        input.addEventListener('change', (e) => this.handleApplicationChange(e));
      });

      document.querySelectorAll('[data-filter-reset]').forEach(btn => {
        btn.addEventListener('click', () => this.resetFilters());
      });

      window.addEventListener('productsLoaded', (e) => {
        this.products = e.detail.products || this.products;
        this.applyFilters();
      });
    },

    handleCategoryChange(e) {
      const value = e.target.value;
      const checked = e.target.checked;

      if (checked) {
        this.filters.category.push(value);
      } else {
        this.filters.category = this.filters.category.filter(c => c !== value);
      }

      this.applyFilters();
    },

    handlePriceChange(e) {
      this.filters.priceRange = e.target.value;
      this.applyFilters();
    },

    handleApplicationChange(e) {
      const value = e.target.value;
      const checked = e.target.checked;

      if (checked) {
        this.filters.application.push(value);
      } else {
        this.filters.application = this.filters.application.filter(a => a !== value);
      }

      this.applyFilters();
    },

    applyFilters() {
      const filteredProducts = this.products.filter(product => {
        if (this.filters.category.length > 0) {
          if (!this.filters.category.includes(product.category)) {
            return false;
          }
        }

        if (this.filters.priceRange) {
          const range = this.priceRanges.find(r => r.id === this.filters.priceRange);
          if (range && (product.price < range.min || product.price > range.max)) {
            return false;
          }
        }

        if (this.filters.application.length > 0) {
          const hasMatchingApp = this.filters.application.some(app => 
            product.application.includes(app)
          );
          if (!hasMatchingApp) {
            return false;
          }
        }

        return true;
      });

      this.updateProductVisibility(filteredProducts);
      this.updateResultsCount(filteredProducts.length);

      window.dispatchEvent(new CustomEvent('filterChanged', { 
        detail: { filters: this.filters, results: filteredProducts } 
      }));
    },

    updateProductVisibility(filteredProducts) {
      const filteredIds = new Set(filteredProducts.map(p => p.id));
      
      this.products.forEach(product => {
        if (product.element) {
          if (filteredIds.has(product.id)) {
            product.element.style.display = '';
            product.element.classList.remove('filtered-out');
          } else {
            product.element.style.display = 'none';
            product.element.classList.add('filtered-out');
          }
        }
      });
    },

    updateResultsCount(count) {
      const resultsCountEl = document.querySelector('.results-count');
      if (resultsCountEl) {
        const total = this.products.length;
        if (count === total) {
          resultsCountEl.textContent = `显示全部 ${total} 个产品`;
        } else {
          resultsCountEl.textContent = `显示 ${count} / ${total} 个产品`;
        }
      }
    },

    resetFilters() {
      this.filters = {
        category: [],
        priceRange: null,
        application: []
      };

      document.querySelectorAll('[data-filter]').forEach(input => {
        input.checked = false;
      });

      this.applyFilters();
    },

    getActiveFilters() {
      return { ...this.filters };
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
      this.applyFilters();
    }
  };

  // 暴露到全局
  window.ProductFilter = ProductFilter;

  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ProductFilter.init());
  } else {
    ProductFilter.init();
  }
})();
