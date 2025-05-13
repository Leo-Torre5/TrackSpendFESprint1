<template>
  <div class="budget-list">
    <main class="main-content">
      <div class="auth-card">
        <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
          <h2 class="auth-title" style="flex-grow: 1;">Budgets</h2>
          <div class="nav-links">
            <router-link to="/budgets/create" class="btn btn-primary">
              + New Budget
            </router-link>
          </div>
        </div>
        <div v-if="loading" class="loading-message">
          <i class="fas fa-spinner fa-spin"></i> Loading budgets...
        </div>

        <div v-if="error" class="auth-alert error">
          {{ error }}
        </div>

        <!-- Mobile View -->
        <div class="mobile-view d-md-none">
          <div class="budget-card" v-for="budget in budgets" :key="budget.id">
            <div class="card-header">
              <h3>{{ budget.category }}</h3>
              <p>{{ formatCurrency(budget.amount) }}</p>
            </div>
            <div class="card-body">
              <p>
                <strong>Period:</strong> {{ formatDate(budget.start_date) }} -
                {{ formatDate(budget.end_date) }}
              </p>
              <p>
                <strong>Spent:</strong>
                {{ formatCurrency(budget.current_spending) }}
              </p>
              <div class="progress-container">
                <div class="progress-bar" :style="progressWidth(budget)"></div>
              </div>
              <div class="actions">
                <button @click="editBudget(budget)" class="icon-button">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="deleteBudget(budget.id)" class="icon-button">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop View -->
        <table
          class="budget-table table table-striped table-hover"
          v-if="!loading && budgets.length"
        >
          <thead class="thead-light">
            <tr>
              <th>Category</th>
              <th>Budget Amount</th>
              <th>Spent</th>
              <th>Period</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="budget in budgets" :key="budget.id">
              <td>{{ budget.category }}</td>
              <td>{{ formatCurrency(budget.amount) }}</td>
              <td>{{ formatCurrency(budget.current_spending) }}</td>
              <td>
                {{ formatDate(budget.start_date) }} -
                {{ formatDate(budget.end_date) }}
              </td>
              <td>
                <div
                  class="progress-container"
                  :title="progressPercentage(budget) + '% used'"
                >
                  <div
                    class="progress-bar"
                    :style="progressBarStyle(budget)"
                  >
                  </div>
                </div>
              </td>
              <td>
                <div class="actions">
                  <button
                    @click="editBudget(budget.id)"
                    class="btn btn-primary btn-sm me-2"
                    title="Edit"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="deleteBudget(budget.id)"
                    class="btn btn-danger btn-sm"
                    title="Delete"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!loading && !budgets.length" class="no-budgets">
          <p>
            No budgets found.
            <router-link to="/budgets/create"
              >Create your first budget</router-link
            >
          </p>
        </div>

        <div class="pagination" v-if="totalPages > 1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            :class="{ active: currentPage === page }"
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
        itemsPerPage: 10,
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

      progressWidth(budget) {
        const percentage = Math.min(
          (budget.current_spending / budget.amount) * 100,
          100
        );
        return { width: percentage + "%" };
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
  .budget-list {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    padding: 2rem;
  }

  .auth-card {
    max-width: 1200px;
    margin: 0 auto;
  }

  .budget-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  .budget-table th,
  .budget-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  .budget-table th {
    background-color: #f8f9fa;
  }

  .mobile-view {
    display: none;
  }

  .budget-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
    padding: 1rem;
  }

  .progress-container {
    height: 20px;
    background-color: #eee;
    border-radius: 5px;
    overflow: hidden;
    margin: 0.5rem 0;
    border: 1px solid #aaa;
  }

  .progress-bar {
    height: 100%;
    background-color: #42b983;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.9rem;
    color: #666;
  }

  .icon-button {
    background: none;
    border: none;
    color: #42b983;
    cursor: pointer;
    padding: 0.5rem;
  }

  .pagination {
    margin-top: 2rem;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .pagination button {
    padding: 0.5rem 1rem;
    border: 1px solid #42b983;
    background: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .pagination button.active {
    background-color: #42b983;
    color: white;
  }

  .no-budgets {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  .loading-message {
    text-align: center;
    padding: 2rem;
    color: #42b983;
  }

  @media (max-width: 768px) {
    .budget-table {
      display: none;
    }

    .mobile-view {
      display: block;
    }
  }

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

  /* Bootstrap buttons override for icon-button */
  .btn-primary {
    background-color: #0d6efd;
    border-color: #0d6efd;
  }
  .btn-primary:hover {
    background-color: #0b5ed7;
    border-color: #0a58ca;
  }
  .btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
  }
  .btn-danger:hover {
    background-color: #bb2d3b;
    border-color: #b02a37;
  }
</style>
