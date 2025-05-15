<template>
  <div class="page-container">
    <header class="page-header">
      <div class="header-banner-container" :style="{ backgroundImage: `url(${bannerImage})` }">
        <div class="header-banner-overlay">
          <div class="container">
            <h1 class="page-title">Manage Budgets</h1>
            <p class="page-description">
              Empower your financial journey by creating personalized budgets. Take control of your spending, track your progress, and achieve your financial goals with ease. Setting budgets is the first step towards financial well-being, providing a clear roadmap for your success. Start creating your budgets today and pave the way for a brighter financial future.
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
                Ready to set up a new budget?
              </p>
              <router-link to="/budgets/create" class="new-budget-button">
                <span class="button-icon">+</span>
                <span class="button-text">New Budget</span>
              </router-link>
            </div>
          </div>
        </div>
        <div class="budget-summary-bar">
          <div class="budget-summary-title">Your Current Budgets</div>
        </div>

        <div v-if="loading" class="loading-message">
          <i class="fas fa-spinner fa-spin"></i> Loading budgets...
        </div>

        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div v-if="!loading && budgets.length > 0" class="budget-cards-container">
          <div class="budget-card" v-for="budget in budgets" :key="budget.id">
            <div class="budget-card-header">
              <h3 class="budget-category">{{ budget.category }}</h3>
              <p class="budget-amount">Budget: {{ formatCurrency(budget.amount) }}</p>
              <p class="budget-spent">Spent: {{ formatCurrency(budget.current_spending) }}</p>
            </div>
            <div class="budget-card-body">
              <p>
                <span class="label">Period:</span>
                {{ formatDate(budget.start_date) }} - {{ formatDate(budget.end_date) }}
              </p>
              <div class="progress-container" :title="progressPercentage(budget) + '% used'">
                <div
                  class="progress-bar"
                  :style="progressBarStyle(budget)"
                  :aria-valuenow="progressPercentage(budget)"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <span class="sr-only">{{ progressPercentage(budget) }}% Complete</span>
                </div>
              </div>
            </div>
            <div class="budget-card-actions">
              <button
                @click="editBudget(budget.id)"
                class="btn btn-outline-secondary edit-button"
                title="Edit Budget"
              >
                <i class="fas fa-edit"></i> Edit
              </button>
              <button
                @click="deleteBudget(budget.id)"
                class="btn btn-danger delete-button"
                title="Delete Budget"
              >
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>

        <div v-if="!loading && budgets.length === 0" class="no-budgets">
          <p>
            No budgets found. Start planning your finances by creating a new budget.
            <router-link to="/budgets/create">
              Add your first budget
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
  name: "BudgetsList",
  data() {
    return {
      budgets: [],
      loading: true,
      error: "",
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 8, // Changed to 8 to match expenses
      bannerImage: require("@/assets/images/BudgetsBanner.jpg"), // Added budget banner.  You might need to create this.
    };
  },
  async created() {
    await this.fetchBudgets();
  },
  methods: {
    async fetchBudgets() {
      try {
        this.loading = true;
        const response = await apiService.getBudgetList({
          page: this.currentPage,
          page_size: this.itemsPerPage,
        });

        // Handle different response structures
        const responseData = response.data;
        let budgetsArray = [];
        let totalCount = 0;

        if (Array.isArray(responseData)) {
          // Response is a direct array
          budgetsArray = responseData;
          totalCount = responseData.length;
        } else if (responseData.results) {
          // Standard DRF paginated response
          budgetsArray = responseData.results;
          totalCount = responseData.count;
        } else if (responseData.items) {
          // Alternative pagination format
          budgetsArray = responseData.items;
          totalCount = responseData.total;
        } else {
          // Fallback to empty array
          budgetsArray = [];
          totalCount = 0;
        }

        this.budgets = budgetsArray.map((budget) => ({
          ...budget,
          category:
            budget.category?.name ||
            (typeof budget.category === "object"
              ? budget.category.name
              : `Category ${budget.category}`),
          amount: parseFloat(budget.amount) || 0,
          current_spending: budget.current_spending || 0,
        }));

        this.totalPages = Math.ceil(totalCount / this.itemsPerPage);
      } catch (error) {
        console.error("Budget fetch error:", error);
        this.error =
          error.response?.data?.message ||
          "Failed to load budgets. Please try again.";
        this.budgets = [];
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
    progressPercentage(budget) {
      return Math.min(
        Math.round((budget.current_spending / budget.amount) * 100),
        100
      );
    },

    progressBarStyle(budget) {
      const percent = Math.min(
        (budget.current_spending / budget.amount) * 100,
        100
      );
      let bgColor = "#14532d"; // dark green
      if (percent >= 80) {
        bgColor = "#991b1b"; // dark red
      } else if (percent >= 60) {
        bgColor = "#f59e42"; // orange
      } else if (percent >= 40) {
        bgColor = "#eab308"; // yellow
      } else if (percent >= 20) {
        bgColor = "#22c55e"; // green
      }
      return {
        width: percent + "%",
        backgroundColor: bgColor,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        transition: "width 0.3s ease",
        height: "100%",
      };
    },

    editBudget(budgetId) {
      this.$router.push(`/budgets/${budgetId}`);
    },

    async deleteBudget(budgetId) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this budget?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6b8068",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
      });
      if (result.isConfirmed) {
        try {
          await apiService.deleteBudget(budgetId);
          this.budgets = this.budgets.filter((b) => b.id !== budgetId);
          await Swal.fire({
            title: "Deleted!",
            text: "Budget has been deleted.",
            icon: "success",
            confirmButtonColor: "#6b8068",
          });
        } catch (error) {
          this.error = "Failed to delete budget. Please try again.";
          console.error("Error deleting budget:", error);
          await Swal.fire({
            title: "Error",
            text: "Failed to delete budget. Please try again.",
            icon: "error",
            confirmButtonColor: "#6b8068",
          });
        }
      }
    },

    changePage(page) {
      this.currentPage = page;
      this.fetchBudgets();
    },
  },
};
</script>

<style scoped>
.page-container {
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

.header-action-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  margin-bottom: 2rem;
  gap: 2rem;
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

.new-budget-button {
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

.new-budget-button:hover {
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

.budget-summary-bar {
  margin-bottom: 1rem;
  text-align: left;
}

.budget-summary-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.budget-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1rem;
}

.budget-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
  padding: 1.5rem;
  min-width: 500px;  /* Ensure a minimum width */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
}

.budget-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.budget-card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.budget-category {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: 500;
}

.budget-amount {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #024a24;
}

.budget-spent {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #dc3545;
}

.budget-card-body {
  font-size: 1rem;
  color: #495057;
  margin-bottom: 1.5rem;
}

.budget-card-body p {
  margin-bottom: 0.75rem;
}

.budget-card-body .label {
  font-weight: 600;
  color: #2c3e50;
}

.progress-container {
  height: 20px;
  background-color: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin: 0.5rem 0;
}

.progress-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
  position: relative;
}

.progress-bar::before {
  content: attr(aria-valuenow) "%";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  white-space: nowrap;
}

.budget-card-actions {
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

.no-budgets {
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

.new-budget-button {
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

.new-budget-button:hover {
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
  .budget-card {
    flex-basis: 48%;
  }

  .page-description {
    padding: 0 5%;
  }

  .header-action-container {
    flex-direction: column;
  }
}

@media (max-width: 992px) {
  .budget-card {
    flex-basis: 100%;
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

  .new-budget-button {
    width: 100%;
    justify-content: center;
  }

  .page-description {
    padding: 0 2%;
  }
}

@media (max-width: 768px) {
  .budget-card {
     flex-basis: 100%;
  }

  .budget-card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .budget-amount {
    margin-top: 1rem;
  }

  .budget-card-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .edit-button,
  .delete-button {
    width: 100%;
    text-align: center;
  }

  .new-budget-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
