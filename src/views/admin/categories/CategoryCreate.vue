<template>
  <div class="page-container">
    <form @submit.prevent="submitForm" class="form-card">
      <div class="form-header">
        <h2 class="form-title">Create New Category</h2>
        <p class="form-description">
          Add a new expense category.  All fields marked with an asterisk (<span class="required-star">*</span>) are required.
        </p>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="categoryName" class="form-label">Category Name <span class="required-star">*</span></label>
          <input
            type="text"
            id="categoryName"
            class="input-field"
            v-model="category.name"
            required
            minlength="2"
            maxlength="100"
          />
          <small class="form-text text-muted">Between 2-100 characters</small>
        </div>

        <div class="form-group">
          <label for="isDefault" class="form-label">Default Category</label>
          <div class="checkbox-group">
            <input
              type="checkbox"
              id="isDefault"
              class="checkbox-input"
              v-model="category.is_default"
            />
            <label for="isDefault" class="checkbox-label">
              Set as default category
            </label>
          </div>
        </div>
      </div>

      <div class="button-container">
        <button type="submit" class="btn btn-primary create-button" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          Create Category
        </button>
      </div>

      <div v-if="error" class="alert alert-danger mt-3">
          {{ error }}
      </div>
    </form>
    <div class="bottom-button-container">
      <a href="#" class="btn btn-secondary back-button bottom-back-button" @click.prevent="$router.go(-1)">
        <i class="bi bi-arrow-left"></i> Back to Categories
      </a>
    </div>
  </div>
</template>

<script>
import APIService from '@/http/APIService';

export default {
  data() {
    return {
      category: {
        name: '',
        is_default: false
      },
      loading: false,
      error: null
    }
  },
  methods: {
    async submitForm() {
      this.loading = true;
      this.error = null;

      try {
        // Trim and validate input
        const categoryData = {
          name: this.category.name.trim(),
          is_default: this.category.is_default
        };

        if (!categoryData.name) {
          throw new Error('Category name is required');
        }

        const response = await APIService.createAdminCategory(categoryData);

        if (response.status === 201) {
          this.$router.push({
            name: 'AdminCategories',
            query: { created: 'true' }
          });
        }
      } catch (error) {
        console.error('Creation Error:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });

        // Handle validation errors
        if (error.response?.data) {
          if (typeof error.response.data === 'object') {
            this.error = Object.entries(error.response.data)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('\n');
          } else {
            this.error = error.response.data;
          }
        } else {
          this.error = error.message || 'Failed to create category. Please check your entries.';
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
/* Resuing styles from AdminBudgetCreate.vue */
.page-container {
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.form-card {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #ededed;
  margin-top: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-header {
  text-align: center;
  margin-bottom: 20px;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

.form-description {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #495057;
  margin-bottom: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  flex: 1;
}

.form-group {
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
}

.horizontal-group {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
}

.form-subgroup {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

@media (max-width: 768px) {
  .horizontal-group {
    flex-direction: column;
  }
}

.form-label {
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 12px;
  display: block;
}

.required-star {
  color: #dc3545;
  font-weight: bold;
}

.input-field {
  padding: 14px;
  font-size: 1.1rem;
  border-radius: 10px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  width: 100%;
  outline: none;
  background-color: #f8f8f8;
  color: #2c3e50;
}

.input-field:focus {
  border-color: #c76d32;
  box-shadow: 0 0 5px rgba(199, 109, 50, 0.2);
  background-color: #fff;
}

.select-field {
  padding: 14px;
  font-size: 1.1rem;
  border-radius: 10px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  width: 100%;
  outline: none;
  background-color: #f8f8f8;
  color: #2c3e50;
}

.select-field:focus {
  border-color: #c76d32;
  box-shadow: 0 0 5px rgba(199, 109, 50, 0.2);
  background-color: #fff;
}

.form-text.text-muted {
  font-size: 0.9rem;
  color: #6c757d !important;
  display: block;
  margin-top: 5px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
  /*justify-content: center;*/
}

.checkbox-input {
  margin-top: 0;
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.checkbox-label {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-left: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.create-button {
  padding: 14px 30px;
  font-size: 1.2rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  background-color: #c76d32;
  border: none;
  color: white;
  margin-top: 20px;
  width: 100%;
}

.create-button:hover {
  background-color: #a45a23;
  transform: translateY(-2px);
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.loading-text {
  margin-top: 15px;
  font-size: 1.1rem;
  color: #555;
}

.error-section {
  padding: 25px;
  text-align: center;
  border-radius: 10px;
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin-top: 25px;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
}

.button-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;
}

.bottom-button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.bottom-back-button {
  padding: 14px 25px;
  font-size: 1.1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  background-color: #c76d32;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 30%;
  text-align: center;
}

.bottom-back-button:hover {
  background-color: #a45a23;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .page-container {
    padding: 15px;
  }

  .form-card {
    padding: 25px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .button-container {
    flex-direction: column;
    gap: 15px;
  }

  .bottom-back-button {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
