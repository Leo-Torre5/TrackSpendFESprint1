<template>
  <div class="page-container">
    <section class="intro-section">
      <div class="intro-card message-card">
        <div class="intro-content">
          <h2 class="intro-title">Manage Budgets</h2>
          <p class="intro-text">
            As an administrator, you can manage user budgets here. You can view, edit, and delete budget allocations.
          </p>
        </div>
      </div>
      <div class="intro-card button-card">
        <router-link :to="{ name: 'BudgetCreate' }" class="btn btn-primary create-budget-btn">
          <i class="bi bi-plus-lg"></i> Create Budget
        </router-link>
      </div>
    </section>

    <section class="budget-list-section" v-if="!loading && budgets.length > 0">
      <h3 class="list-title">Existing Budgets</h3>
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-head">
                <tr>
                  <th scope="col">User</th>
                  <th scope="col">Category</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Period</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="budget in budgets" :key="budget.id">
                  <td>{{ getUserName(budget) }}</td>
                  <td>{{ getCategoryName(budget) }}</td>
                  <td>{{ formatAmount(budget.amount) }}</td>
                  <td>{{ formatPeriod(budget.period) }}</td>
                  <td>{{ formatDate(budget.start_date) }}</td>
                  <td>{{ formatDate(budget.end_date) }}</td>
                  <td>
                    <div class="button-group">
                      <router-link
                        :to="{ name: 'BudgetEdit', params: { id: budget.id } }"
                        class="btn btn-outline-primary btn-sm"
                      >
                        <i class="bi bi-pencil-fill"></i> Edit
                      </router-link>
                      <button
                        @click="confirmDelete(budget.id)"
                        class="btn btn-outline-danger btn-sm"
                      >
                        <i class="bi bi-trash3-fill"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section v-if="loading" class="loading-section">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="loading-text">Loading budgets...</p>
    </section>

    <section v-if="!loading && budgets.length === 0" class="empty-section">
      <div class="alert alert-info" role="alert">
        <i class="bi bi-info-circle-fill"></i> No budgets found.
      </div>
    </section>

    <section v-if="error" class="error-section">
      <div class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle-fill"></i> Error: {{ error }}
      </div>
    </section>
  </div>
</template>

<script>
import APIService from '@/http/APIService';
import { confirmDialog } from '@/utils/confirmDialog';

export default {
  name: 'AdminBudgetList',
  data() {
    return {
      budgets: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchBudgets();
  },
  methods: {
    getUserName(budget) {
      if (!budget.user) return 'N/A';
      return budget.user.username || `User ${budget.user.id}`;
    },
    getCategoryName(budget) {
      if (!budget.category) return 'N/A';
      return budget.category.name || `Category ${budget.category.id}`;
    },
    async fetchBudgets() {
      try {
        const response = await APIService.getAdminBudgetList();
        this.budgets = response.data.map((budget) => ({
          ...budget,
          amount: parseFloat(budget.amount) || 0,
        }));
      } catch (error) {
        console.error('Error:', error);
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.loading = false;
      }
    },
    formatAmount(amount) {
      return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    formatPeriod(period) {
      const periodMap = {
        daily: 'Daily',
        weekly: 'Weekly',
        biweekly: 'Bi-Weekly',
        monthly: 'Monthly',
        six_month: 'Six Month',
        yearly: 'Yearly',
        five_year: 'Five Year',
        ten_year: 'Ten Year',
      };
      return periodMap[period] || period;
    },
    formatDate(dateString) {
      return dateString ? new Date(dateString).toLocaleDateString() : '-';
    },
    async confirmDelete(budgetId) {
      const budget = this.budgets.find((b) => b.id === budgetId);
      const { isConfirmed } = await confirmDialog(
        `Delete Budget for ${budget.user.username}?`,
        `This will delete the ${budget.category.name} budget`,
        'warning'
      );

      if (isConfirmed) {
        try {
          await APIService.deleteAdminBudget(budgetId);
          this.budgets = this.budgets.filter((b) => b.id !== budgetId);
        } catch (error) {
          console.error('Delete error:', error);
          alert(
            `Failed to delete budget: ${
            error.response?.data?.message || error.message
            }`
          );
        }
      }
    },
  },
};
</script>

<style scoped>
.page-container {
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  min-height: 500px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ededed;
}

.page-title {
  font-size: 1.85rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.btn-primary {
  padding: 10px 18px;
  font-size: 1.1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: #c76d32;
  border: none;
}

.btn-primary:hover {
  background-color: #a45a23;
  transform: translateY(-1px);
}

.intro-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 25px;
}

.intro-card {
  background-color: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #ededed;
  flex: 1;
  min-width: 300px;
}

.message-card {
  flex: 2;
  min-width: 400px;
}

.intro-content {
  max-width: 100%;
}

.intro-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #495057;
  margin-bottom: 0;
}

.button-card {
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-budget-btn {
  padding: 12px 20px;
  font-size: 1.1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: #c76d32;
  border: none;
  color: white;
  margin-top: 0;
}

.create-budget-btn:hover {
  background-color: #a45a23;
  transform: translateY(-1px);
}

.budget-list-section {
  margin-top: 20px;
}

.list-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
}

.table-section {
  margin-top: 20px;
}

.table-head {
  background-color: #f2f2f2;
  color: #333;
  font-size: 1.1rem;
}

.table-hover tbody tr:hover {
  background-color: #f5f5f5;
}

.table {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.02);
  border: 1px solid #ededed;
}

.table thead th {
  border-bottom: 2px solid #dee2e6;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.9rem;
  border-radius: 6px;
}

.btn-outline-primary {
  color: #c76d32;
  border-color: #c76d32;
}

.btn-outline-primary:hover {
  background-color: rgba(199, 109, 50, 0.1);
  color: #c76d32;
  border-color: #c76d32;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border-color: #dc3545;
}

.badge {
  font-size: 0.85rem;
  padding: 0.5em 0.75em;
  border-radius: 12px;
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
  margin-top: 10px;
  font-size: 1.1rem;
  color: #555;
}

.empty-section {
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  background-color: #f0f0f0;
  color: #555;
  font-size: 1.1rem;
}

.error-section {
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  background-color: #f8d7da;
  color: #721c24;
  font-size: 1.1rem;
  border: 1px solid #f5c6cb;
}

.alert-info {
  background-color: #e0f7fa;
  border-color: #b2ebf2;
  color: #0c5460;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
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

@media (max-width: 768px) {
  .intro-section {
    flex-direction: column;
  }

  .message-card,
  .button-card {
    flex: 1;
    min-width: 100%;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
