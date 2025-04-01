<template>
    <div class="budget-form">
  
      <main class="main-content">
        <div class="auth-card">
          <h2 class="auth-title">{{ pageTitle }}</h2>
          
          <div v-if="showMsg === 'error'" class="auth-alert error">
            {{ errorMessage }}
          </div>
  
          <form @submit.prevent="handleSubmit" class="budget-form-content">
            <div class="form-group">
              <label>Category</label>
              <select v-model="budget.category" class="form-input" required>
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Housing">Housing</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>
  
            <div class="form-row">
              <div class="form-group">
                <label>Budget Amount</label>
                <input
                  v-model.number="budget.amount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="form-input"
                  placeholder="0.00"
                />
              </div>
  
              <div class="form-group">
                <label>Current Spending</label>
                <input
                  v-model.number="budget.current_spending"
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-input"
                  placeholder="0.00"
                  :disabled="isUpdate"
                />
              </div>
            </div>
  
            <div class="form-row">
              <div class="form-group">
                <label>Start Date</label>
                <input
                  v-model="budget.start_date"
                  type="date"
                  required
                  class="form-input"
                  :max="budget.end_date"
                />
              </div>
  
              <div class="form-group">
                <label>End Date</label>
                <input
                  v-model="budget.end_date"
                  type="date"
                  required
                  class="form-input"
                  :min="budget.start_date"
                />
              </div>
            </div>
            
  
            <div class="action-buttons">
              <button type="submit" class="auth-button" :disabled="loading">
                {{ loading ? 'Saving...' : 'Save Budget' }}
              </button>
              <button type="button" class="auth-button secondary" @click="cancel">
                Cancel
              </button>
              <div class="nav-links">
            <router-link to="/budgets" class="sign-in-button">
              Back to Budgets
            </router-link>
          </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import { APIService } from '@/http/APIService';
  const apiService = new APIService();
  
  export default {
    name: 'BudgetCreateUpdate',
    data() {
      return {
        budget: {
          category: '',
          amount: 0,
          current_spending: 0,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0]
        },
        pageTitle: 'New Budget',
        showMsg: '',
        errorMessage: '',
        loading: false,
        isUpdate: false
      };
    },
    beforeCreate() {
      const isAuthenticated = localStorage.getItem('access_token');
      if (!isAuthenticated) {
        this.$router.push('/auth');
      }
    },
    async mounted() {
      if (this.$route.params.id) {
        this.isUpdate = true;
        this.pageTitle = 'Edit Budget';
        await this.fetchBudget();
      }
    },
    methods: {
      async fetchBudget() {
        try {
          const response = await apiService.getBudget(this.$route.params.id);
          this.budget = {
            ...response.data,
            start_date: response.data.start_date.split('T')[0],
            end_date: response.data.end_date.split('T')[0]
          };
        } catch (error) {
          this.handleError(error);
        }
      },
      async handleSubmit() {
        this.loading = true;
        this.showMsg = '';
        
        try {
          const budgetData = {
            ...this.budget,
            amount: parseFloat(this.budget.amount),
            current_spending: parseFloat(this.budget.current_spending)
          };
  
          if (this.isUpdate) {
            await apiService.updateBudget(this.$route.params.id, budgetData);
          } else {
            await apiService.createBudget(budgetData);
          }
          
          this.$router.push('/budgets');
        } catch (error) {
          this.handleError(error);
        } finally {
          this.loading = false;
        }
      },
      handleError(error) {
        this.showMsg = 'error';
        if (error.response) {
          switch (error.response.status) {
            case 400:
              this.errorMessage = this.parseValidationErrors(error.response.data);
              break;
            case 401:
              localStorage.removeItem('access_token');
              this.$router.push('/auth');
              break;
            default:
              this.errorMessage = 'Error saving budget. Please try again.';
          }
        } else {
          this.errorMessage = 'Network error. Please check your connection.';
        }
      },
      parseValidationErrors(errors) {
        return Object.values(errors).join(' ');
      },
      cancel() {
        this.$router.push('/budgets');
      }
    }
  };
  </script>
  
  <style scoped>
  .budget-form-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1rem;
  }
  
  .form-input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #42b983;
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .secondary {
    background-color: #6c757d;
  }
  
  .secondary:hover {
    background-color: #5a6268;
  }
  
  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
  
  /* Reuse existing header styles */
  .header {
    background-color: #2c3e50;
    padding: 1rem 2rem;
  }
  
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .logo a {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
  }
  
  .sign-in-button {
    background-color: #42b983;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    text-decoration: none;
  }
  
  .auth-card {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .auth-title {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .auth-alert.error {
    background-color: #fee2e2;
    color: #dc2626;
    border: 1px solid #fca5a5;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 6px;
  }
  .sign-in-button {
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    text-decoration: none;
    background-color: #2c463f;
    color: white;
  }
  
  .sign-in-button:hover {
    background-color: #6b8068;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  </style>