<template>
  <div class="expense-list">
    <header class="page-header">
      <div class="header-banner-container" :style="{ backgroundImage: `url(${bannerImage})` }">
        <div class="header-banner-overlay">
          <div class="container">
            <h1 class="page-title">Manage Expenses</h1>
            <p class="page-description">
              Take control of your finances and embark on a journey towards
              financial well-being. Track, analyze, and optimize your spending
              with our intuitive tools, designed to empower you every step of
              the way.
            </p>
          </div>
        </div>
      </div>
    </header>
    <main class="main-content">
      <div class="container">
        <div class="header-action-container">
          <div class="action-bar" style="margin-bottom: 1rem;">
            <div class="ready-to-track-card">
              <p class="ready-to-track-message">
                Ready to start tracking your expenses?
              </p>
              <router-link to="/expenses/create" class="new-expense-button">
                <span class="button-icon">+</span>
                <span class="button-text">New Expense</span>
              </router-link>
            </div>
          </div>
        </div>
        <div class="expense-summary-bar">
          <div class="expense-summary-title">Your Current Expenses</div>
        </div>
        <div v-if="loading" class="loading-message">
          <i class="fas fa-spinner fa-spin"></i> Loading expenses...
        </div>

        <div
          v-if="!loading && expenses && expenses.length > 0"
          class="expense-cards-container"
        >
          <div class="expense-card" v-for="expense in expenses" :key="expense.id">
            <div class="expense-card-header">
              <h3 class="expense-description">{{ expense.description }}</h3>
              <p class="expense-amount">{{ formatCurrency(expense.amount) }}</p>
            </div>
            <div class="expense-card-body">
              <p>
                <span class="label">Date:</span>
                {{ formatDate(expense.date) }}
              </p>
              <p>
                <span class="label">Category:</span>
                {{ expense.category.name }}
              </p>
              <p v-if="expense.notes">
                <span class="label">Notes:</span> {{ expense.notes }}
              </p>
            </div>
            <div class="expense-card-actions">
              <button
                @click="editExpense(expense.id)"
                class="btn btn-outline-secondary edit-button"
                title="Edit Expense"
              >
                <i class="fas fa-edit"></i> Edit
              </button>
              <button
                @click="deleteExpense(expense.id)"
                class="btn btn-danger delete-button"
                title="Delete Expense"
              >
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="!loading && (!expenses || expenses.length === 0)"
          class="no-expenses"
        >
          <p>
            No expenses found. Take the first step towards financial clarity by
            adding your first expense. Every penny counts on your journey to
            financial well-being.
            <router-link to="/expenses/create">
              Add your first expense
            </router-link>.
          </p>
        </div>

        <div class="pagination" v-if="totalPages > 1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            :class="{ active: currentPage === page }"
            class="page-number"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { APIService } from "@/http/APIService";
import Swal from "sweetalert2";
const apiService = new APIService();

export default {
  name: "ExpensesList",
  data() {
    return {
      expenses: [],
      loading: true,
      error: "",
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 8,
      bannerImage: require("@/assets/images/ExpensesBanner.jpg"), // Corrected path
    };
  },
  async created() {
    await this.fetchExpenses();
  },
  methods: {
    async fetchExpenses() {
      try {
        this.loading = true;
        const response = await apiService.getExpenseList({
          page: this.currentPage,
          page_size: this.itemsPerPage,
        });

        if (response && response.data) {
          this.expenses = response.data || [];
          this.totalPages = Math.ceil(
            (response.data.count || 0) / this.itemsPerPage
          );
        } else {
          this.expenses = [];
          this.totalPages = 1;
          this.error = "Invalid response format from server.";
        }
      } catch (error) {
        this.error = "Failed to load expenses. Please try again later.";
        console.error("Error fetching expenses:", error);
        this.expenses = [];
        this.totalPages = 1;
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },

    editExpense(expenseId) {
      this.$router.push(`/expenses/${expenseId}`);
    },

    async deleteExpense(expenseId) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this expense?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6b8068",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel", // Added cancel button text
      });
      if (result.isConfirmed) {
        try {
          await apiService.deleteExpense(expenseId);
          this.expenses = this.expenses.filter((e) => e.id !== expenseId);
          await Swal.fire({
            title: "Deleted!",
            text: "Expense has been deleted.",
            icon: "success",
            confirmButtonColor: "#6b8068", // Consistent button color
          });
        } catch (error) {
          this.error = "Failed to delete expense. Please try again.";
          console.error("Error deleting expense:", error);
          await Swal.fire({
            title: "Error",
            text: "Failed to delete expense. Please try again.",
            icon: "error",
            confirmButtonColor: "#6b8068", // Consistent button color
          });
        }
      }
    },

    changePage(page) {
      this.currentPage = page;
      this.fetchExpenses();
    },
  },
};
</script>

<style scoped>
.expense-list {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.page-header {
  background-color: #2c3e50;
  padding: 0rem 0;
  color: white;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header-banner-container {
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-banner-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.page-description {
  font-size: 1.4rem;
  color: white;
  margin-bottom: 0;
  padding: 0 15%;
  line-height: 1.7;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
  margin: 0 auto;
  max-width: 1200px;
}

.expense-summary-bar {
  margin-bottom: 1rem;
  text-align: left;
}

.expense-summary-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.action-bar {
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  gap: 1rem;
}

.ready-to-track-card {
  background-color: #f0f0f0;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: left;
  flex: 1;
  min-width: 250px;
}

.ready-to-track-message {
  font-size: 1.1rem;
  color: #495057;
  margin-bottom: 1rem;
}

.new-expense-button {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
  background-color: #024a24;
  color: white;
  font-weight: 600;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  text-decoration: none;
}

.new-expense-button:hover {
  background-color: #023818;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  text-decoration: none;
}

.button-icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
  display: flex;
}

.button-text {
  font-size: 1.1rem;
}

.expense-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1rem;
}

.expense-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
  padding: 1.5rem;
  width: 100%;
  max-width: 23%;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid #e0e0e0;
}

.expense-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.expense-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-direction: column;
}

.expense-description {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: 500;
}

.expense-amount {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #024a24;
}

.expense-card-body {
  font-size: 1rem;
  color: #495057;
  margin-bottom: 1.5rem;
}

.expense-card-body p {
  margin-bottom: 0.75rem;
}

.expense-card-body .label {
  font-weight: 600;
  color: #2c3e50;
}

.expense-card-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: auto;
}

.edit-button,
.delete-button {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-weight: 500;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.edit-button {
  background-color: #ffffff;
  color: #c76d32;
  border: 1px solid #c76d32;
}

.edit-button:hover {
  background-color: #c76d32;
  color: white;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.delete-button:hover {
  background-color: #c82333;
}

.pagination {
  margin-top: 2rem;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.pagination button {
  padding: 0.75rem 1.25rem;
  border: 1px solid #c76d32;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  color: #c76d32;
}

.pagination button:hover {
  background-color: #c76d32;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.pagination button.active {
  background-color: #c76d32;
  color: white;
  border-color: #c76d32;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.no-expenses {
  text-align: center;
  padding: 2rem;
  color: #666;
  background-color: #fff;
  border-radius: 10px;
  margin-top: 2rem;
  border: 1px solid #e0e0e0;
}

.loading-message {
  text-align: center;
  padding: 2rem;
  color: #42b983;
}

.header-action-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  margin-bottom: 2rem;
  gap: 2rem;
}

.ready-to-track-card {
  background-color: #f0f0f0;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: left;
  flex: 1;
  min-width: 250px;
  margin-right: 2rem;
}

.ready-to-track-message {
  font-size: 1.1rem;
  color: #495057;
  margin-bottom: 1rem;
}

.new-expense-button {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
  background-color: #024a24;
  color: white;
  font-weight: 600;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  text-decoration: none;
}

.new-expense-button:hover {
  background-color: #023818;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  text-decoration: none;
}

.button-icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
  display: flex;
}

.button-text {
  font-size: 1.1rem;
}

@media (max-width: 1200px) {
  .expense-card {
    max-width: 31%;
  }

  .page-description {
    padding: 0 5%;
  }

  .header-action-container {
    flex-direction: column;
  }
}

@media (max-width: 992px) {
  .expense-card {
    max-width: 48%;
  }

  .action-bar {
    text-align: center;
    flex-direction: column;
    align-items: center;
  }

  .ready-to-track-card {
    flex: 0 0 80%;
    min-width: 250px;
    margin-right: 0;
  }

  .new-expense-button {
    width: 100%;
    justify-content: center;
  }

  .page-description {
    padding: 0 2%;
  }
}

@media (max-width: 768px) {
  .expense-card {
    max-width: 100%;
  }

  .expense-card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .expense-amount {
    margin-top: 1rem;
  }

  .expense-card-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .edit-button,
  .delete-button {
    width: 100%;
    text-align: center;
  }

  .new-expense-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
