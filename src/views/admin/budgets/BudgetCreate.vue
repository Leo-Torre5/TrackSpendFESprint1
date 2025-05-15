<template>
  <div class="page-container">
    <form @submit.prevent="submitForm" class="form-card">
      <div class="form-header">
        <h2 class="form-title">Create New Budget</h2>
        <p class="form-description">
          Fill out the form below to create a new budget. All fields marked with an asterisk (<span class="required-star">*</span>) are required.
        </p>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label for="user" class="form-label">User <span class="required-star">*</span></label>
          <select id="user" v-model="budget.user_id" required class="select-field">
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.username }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="category" class="form-label">Category <span class="required-star">*</span></label>
          <select id="category" v-model="budget.category_id" required class="select-field">
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="amount" class="form-label">Amount <span class="required-star">*</span></label>
          <input
            type="number"
            id="amount"
            class="input-field"
            v-model="budget.amount"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div class="form-group">
          <label for="period" class="form-label">Period <span class="required-star">*</span></label>
          <select id="period" v-model="budget.period" required class="select-field">
            <option v-for="period in periodOptions" :key="period.value" :value="period.value">
              {{ period.label }}
            </option>
          </select>
        </div>

        <div class="form-group horizontal-group">
          <div class="form-subgroup">
            <label for="startDate" class="form-label">Start Date <span class="required-star">*</span></label>
            <input
              type="date"
              id="startDate"
              class="input-field"
              v-model="budget.start_date"
              required
            />
          </div>
          <div class="form-subgroup">
            <label for="endDate" class="form-label">End Date (optional)</label>
            <input
              type="date"
              id="endDate"
              class="input-field"
              v-model="budget.end_date"
            />
          </div>
        </div>
      </div>

      <div class="button-container">
        <button type="submit" class="btn btn-primary create-button" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          Create Budget
        </button>
      </div>

      <div v-if="error" class="alert alert-danger mt-3">
        {{ error }}
      </div>
    </form>
    <div class="bottom-button-container">
      <a href="#" class="btn btn-secondary back-button bottom-back-button" @click.prevent="$router.go(-1)">
        <i class="bi bi-arrow-left"></i> Back to Budgets
      </a>
    </div>
  </div>
</template>

<script>
import APIService from '@/http/APIService';

export default {
  data() {
    return {
      budget: {
        user_id: null,
        category_id: null,
        amount: 0,
        period: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: null
      },
      users: [],
      categories: [],
      periodOptions: [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'biweekly', label: 'Bi-Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'six_month', label: 'Six Month' },
        { value: 'yearly', label: 'Yearly' },
        { value: 'five_year', label: 'Five Year' },
        { value: 'ten_year', label: 'Ten Year' }
      ],
      loading: false,
      error: null
    }
  },
  async created() {
    await this.fetchOptions();
  },
  methods: {
    async fetchOptions() {
      try {
        const [usersRes, categoriesRes] = await Promise.all([
          APIService.getAdminUserList(),
          APIService.getAdminCategoryList()
        ]);
        this.users = usersRes.data;
        this.categories = categoriesRes.data;

        // Set default selections if needed
        if (this.users.length > 0 && !this.budget.user_id) {
          this.budget.user_id = this.users[0].id;
        }
        if (this.categories.length > 0 && !this.budget.category_id) {
          this.budget.category_id = this.categories[0].id;
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    },
    async submitForm() {
      this.loading = true;
      this.error = null;

      try {
        const budgetData = {
          user_id: this.budget.user_id,
          category_id: this.budget.category_id,
          amount: parseFloat(this.budget.amount),
          period: this.budget.period,
          start_date: this.budget.start_date,
          end_date: this.budget.end_date || null
        };


        await APIService.createAdminBudget(budgetData);
        this.$router.push({
          name: 'AdminBudgets',
          query: { created: 'true' }
        });
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },
    handleError(error) {
      console.error('Creation Error:', error);
      if (error.response?.data) {
        // Improved error display
        if (typeof error.response.data === 'string') {
          this.error = error.response.data;
        } else {
          this.error = Object.entries(error.response.data)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`;
              }
              return `${field}: ${errors}`;
            })
            .join('\n');
        }
      } else {
        this.error = 'Failed to create budget. Please check your entries.';
      }
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: none;
}

.intro-section {
  display: none;
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
  grid-template-columns: 1fr; /* Changed to 1fr */
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

  .intro-section {
    flex-direction: column;
    text-align: center;
    display: none;
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