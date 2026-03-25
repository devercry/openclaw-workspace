/**
 * 精密仪器公司官网 - API 接口封装
 * 与后端 RESTful API 对接
 */

(function() {
  'use strict';

  // API 配置
  const API_CONFIG = {
    // 基础 URL，生产环境需要修改为实际域名
    BASE_URL: window.location.hostname === 'localhost' 
      ? 'http://localhost:3000/api/v1'
      : '/api/v1',
    
    // 请求超时时间 (毫秒)
    TIMEOUT: 10000,
    
    // 默认请求头
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  /**
   * HTTP 请求工具
   */
  const http = {
    /**
     * 发送请求
     * @param {string} url - 请求地址
     * @param {Object} options - 请求选项
     * @returns {Promise} 请求结果
     */
    async request(url, options = {}) {
      const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;
      
      const config = {
        method: 'GET',
        headers: { ...API_CONFIG.HEADERS },
        ...options
      };

      // 添加认证 token
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      // 创建 AbortController 用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      config.signal = controller.signal;

      try {
        const response = await fetch(fullUrl, config);
        clearTimeout(timeoutId);

        // 处理 HTTP 错误
        if (!response.ok) {
          const error = await this.handleError(response);
          throw error;
        }

        // 解析响应数据
        const data = await response.json();
        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          throw new Error('请求超时，请稍后重试');
        }
        
        throw error;
      }
    },

    /**
     * GET 请求
     */
    get(url, params = {}) {
      const queryString = new URLSearchParams(params).toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      return this.request(fullUrl, { method: 'GET' });
    },

    /**
     * POST 请求
     */
    post(url, data = {}) {
      return this.request(url, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    /**
     * PUT 请求
     */
    put(url, data = {}) {
      return this.request(url, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    /**
     * DELETE 请求
     */
    delete(url) {
      return this.request(url, { method: 'DELETE' });
    },

    /**
     * 处理错误响应
     */
    async handleError(response) {
      let errorMessage = '请求失败';
      
      try {
        const data = await response.json();
        errorMessage = data.message || data.error || `HTTP ${response.status}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = response;
      
      return error;
    }
  };

  /**
   * API 接口定义
   */
  const API = {
    // ==================== 产品相关 ====================
    products: {
      // 获取产品列表
      getList(params = {}) {
        return http.get('/products', params);
      },
      
      // 获取产品详情
      getById(id) {
        return http.get(`/products/${id}`);
      },
      
      // 获取产品分类
      getCategories() {
        return http.get('/products/categories');
      },
      
      // 搜索产品
      search(query) {
        return http.get('/products/search', { q: query });
      },
      
      // 获取热门产品
      getFeatured() {
        return http.get('/products/featured');
      },
      
      // 获取相关产品
      getRelated(id) {
        return http.get(`/products/${id}/related`);
      }
    },

    // ==================== 新闻相关 ====================
    news: {
      // 获取新闻列表
      getList(params = {}) {
        return http.get('/news', params);
      },
      
      // 获取新闻详情
      getById(id) {
        return http.get(`/news/${id}`);
      },
      
      // 获取新闻分类
      getCategories() {
        return http.get('/news/categories');
      },
      
      // 获取最新新闻
      getLatest(limit = 5) {
        return http.get('/news/latest', { limit });
      }
    },

    // ==================== 案例相关 ====================
    cases: {
      // 获取案例列表
      getList(params = {}) {
        return http.get('/cases', params);
      },
      
      // 获取案例详情
      getById(id) {
        return http.get(`/cases/${id}`);
      },
      
      // 获取行业分类
      getIndustries() {
        return http.get('/cases/industries');
      },
      
      // 获取精选案例
      getFeatured() {
        return http.get('/cases/featured');
      }
    },

    // ==================== 解决方案相关 ====================
    solutions: {
      // 获取解决方案列表
      getList() {
        return http.get('/solutions');
      },
      
      // 获取解决方案详情
      getById(id) {
        return http.get(`/solutions/${id}`);
      }
    },

    // ==================== 公司信息相关 ====================
    company: {
      // 获取公司信息
      getInfo() {
        return http.get('/company');
      },
      
      // 获取团队成员
      getTeam() {
        return http.get('/company/team');
      },
      
      // 获取发展历程
      getHistory() {
        return http.get('/company/history');
      },
      
      // 获取荣誉资质
      getAwards() {
        return http.get('/company/awards');
      },
      
      // 获取合作伙伴
      getPartners() {
        return http.get('/company/partners');
      }
    },

    // ==================== 联系我们相关 ====================
    contact: {
      // 提交联系表单
      submit(formData) {
        return http.post('/contact', formData);
      },
      
      // 获取联系信息
      getInfo() {
        return http.get('/contact/info');
      },
      
      // 提交询价
      submitInquiry(data) {
        return http.post('/contact/inquiry', data);
      }
    },

    // ==================== 用户相关 ====================
    user: {
      // 用户登录
      login(credentials) {
        return http.post('/auth/login', credentials);
      },
      
      // 用户注册
      register(data) {
        return http.post('/auth/register', data);
      },
      
      // 获取当前用户信息
      getProfile() {
        return http.get('/user/profile');
      },
      
      // 更新用户信息
      updateProfile(data) {
        return http.put('/user/profile', data);
      },
      
      // 退出登录
      logout() {
        localStorage.removeItem('auth_token');
        return http.post('/auth/logout');
      }
    },

    // ==================== 搜索相关 ====================
    search: {
      // 全局搜索
      global(query) {
        return http.get('/search', { q: query });
      },
      
      // 获取搜索建议
      getSuggestions(query) {
        return http.get('/search/suggestions', { q: query });
      }
    },

    // ==================== 文件上传 ====================
    upload: {
      // 上传文件
      async file(file, onProgress) {
        const formData = new FormData();
        formData.append('file', file);

        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          if (onProgress) {
            xhr.upload.addEventListener('progress', (e) => {
              if (e.lengthComputable) {
                const progress = Math.round((e.loaded / e.total) * 100);
                onProgress(progress);
              }
            });
          }

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch {
                resolve(xhr.responseText);
              }
            } else {
              reject(new Error(`上传失败: ${xhr.statusText}`));
            }
          });

          xhr.addEventListener('error', () => {
            reject(new Error('上传失败'));
          });

          xhr.open('POST', `${API_CONFIG.BASE_URL}/upload`);
          
          const token = localStorage.getItem('auth_token');
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          
          xhr.send(formData);
        });
      }
    }
  };

  // 暴露到全局
  window.API = API;
  window.API_CONFIG = API_CONFIG;

  // 添加请求拦截器示例
  API.interceptors = {
    request: [],
    response: []
  };

})();
