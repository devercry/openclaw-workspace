/**
 * 精密仪器公司官网 - 表单功能
 */

(function() {
  'use strict';

  const Forms = {
    validators: {
      required: (value) => ({ valid: value && value.trim().length > 0, message: '此字段为必填项' }),
      email: (value) => ({ valid: !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: '请输入有效的邮箱地址' }),
      phone: (value) => ({ valid: !value || /^[\d\s\-\+\(\)]{8,20}$/.test(value), message: '请输入有效的电话号码' })
    },

    init() {
      this.initForms();
      this.initModals();
      this.bindEvents();
      console.log('[Forms] 初始化完成');
    },

    initForms() {
      document.querySelectorAll('form[data-validate]').forEach(form => this.initForm(form));
    },

    initForm(form) {
      form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', () => this.validateField(field));
      });
    },

    validateField(field) {
      const rules = [];
      if (field.required) rules.push('required');
      if (field.type === 'email') rules.push('email');
      if (field.type === 'tel') rules.push('phone');

      let isValid = true;
      let errorMessage = '';

      for (const rule of rules) {
        const result = this.validators[rule](field.value);
        if (!result.valid) { isValid = false; errorMessage = result.message; break; }
      }

      const formGroup = field.closest('.form-group') || field.parentElement;
      formGroup?.classList.toggle('invalid', !isValid);
      const errorEl = formGroup?.querySelector('.error-message');
      if (errorEl) { errorEl.textContent = errorMessage; errorEl.hidden = isValid; }
      return isValid;
    },

    initModals() {
      if (document.getElementById('inquiry-modal')) return;
      const modalHTML = `<div id="inquiry-modal" class="modal" data-modal hidden>
        <div class="modal-overlay" data-modal-close></div>
        <div class="modal-content">
          <div class="modal-header"><h3>产品询价</h3><button class="modal-close" data-modal-close>&times;</button></div>
          <div class="modal-body">
            <form class="inquiry-form" data-form-type="inquiry" data-validate>
              <input type="hidden" name="product_id">
              <div class="form-group"><label>您的姓名 *</label><input type="text" name="name" required><span class="error-message" hidden></span></div>
              <div class="form-group"><label>公司名称</label><input type="text" name="company"></div>
              <div class="form-group"><label>电子邮箱 *</label><input type="email" name="email" required><span class="error-message" hidden></span></div>
              <div class="form-group"><label>联系电话 *</label><input type="tel" name="phone" required><span class="error-message" hidden></span></div>
              <div class="form-group"><label>询价留言</label><textarea name="message" rows="4"></textarea></div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">提交询价</button>
                <button type="button" class="btn btn-secondary" data-modal-close>取消</button>
              </div>
            </form>
          </div>
        </div>
      </div>`;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    openInquiryModal(productData) {
      this.initModals();
      const modal = document.getElementById('inquiry-modal');
      modal.hidden = false;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    closeModal(modal) {
      modal.classList.remove('active');
      modal.hidden = true;
      document.body.style.overflow = '';
    },

    bindEvents() {
      document.addEventListener('submit', (e) => {
        const form = e.target;
        if (form.dataset.validate) {
          e.preventDefault();
          let isValid = true;
          form.querySelectorAll('input, textarea').forEach(field => {
            if (!this.validateField(field)) isValid = false;
          });
          if (isValid) {
            alert('提交成功！我们会尽快与您联系。');
            form.reset();
            const modal = form.closest('[data-modal]');
            if (modal) this.closeModal(modal);
          }
        }
      });

      document.addEventListener('click', (e) => {
        if (e.target.dataset.modalClose) {
          const modal = e.target.closest('[data-modal]');
          if (modal) this.closeModal(modal);
        }
        const btn = e.target.closest('[data-inquiry]');
        if (btn) this.openInquiryModal({ id: btn.dataset.productId });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('[data-modal].active').forEach(m => this.closeModal(m));
        }
      });
    }
  };

  window.Forms = Forms;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Forms.init());
  } else {
    Forms.init();
  }
})();
