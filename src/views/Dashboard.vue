<template>
    <div class="dashboard-container">
      <Navbar />
  
      <div class="py-4">
        <header>
          <div class="container">
            <h1 class="page-title">Dashboard</h1>
          </div>
        </header>
  
        <main>
          <div class="container">
            <div class="row mb-4">
              <div class="col-12 col-lg-6">
                <UserProfile />
              </div>
              <div class="col-12 col-lg-6">
                <div class="d-flex flex-column gap-4">
                  <div class="card link-card">
                    <div class="card-body">
                      <h5 class="card-title link-card-title">Go to Expenses</h5>
                      <p class="card-text link-card-text">
                        View and manage your expenses.
                      </p>
                      <router-link
                        to="/expenses"
                        class="btn btn-primary link-card-button"
                      >
                        Go to Expenses
                      </router-link>
                    </div>
                  </div>
  
                  <div class="card link-card">
                    <div class="card-body">
                      <h5 class="card-title link-card-title">Go to Budgets</h5>
                      <p class="card-text link-card-text">
                        View and manage your budgets.
                      </p>
                      <router-link
                        to="/budgets"
                        class="btn btn-primary link-card-button"
                      >
                        Go to Budgets
                      </router-link>
                    </div>
                  </div>
                  <div class="row g-4">
                    <div class="col-12 col-md-6">
                      <div class="card quick-add-card">
                        <div class="card-body">
                          <h5 class="card-title quick-add-title">Quick Add Expense</h5>
                          <p class="card-text quick-add-text">
                            Add a new expense quickly.
                          </p>
                          <router-link
                            to="/expenses/create"
                            class="btn btn-primary quick-add-button"
                          >
                            <svg
                              class="me-2 icon"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Add Expense
                          </router-link>
                        </div>
                      </div>
                    </div>
  
                    <div class="col-12 col-md-6">
                      <div class="card quick-add-card">
                        <div class="card-body">
                          <h5 class="card-title quick-add-title">Quick Add Budget</h5>
                          <p class="card-text quick-add-text">
                            Set a new budget quickly.
                          </p>
                          <router-link
                            to="/budgets/create"
                            class="btn btn-primary quick-add-button"
                          >
                            <svg
                              class="me-2 icon"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Add Budget
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="card mb-4">
              <div class="card-body">
                <div class="report-header">
                  <h3 class="report-title">Expense Analysis</h3>
                  <select
                    v-model="selectedPeriod"
                    class="form-select report-period-select"
                  >
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="year">Last 12 months</option>
                    <option value="all">All time</option>
                  </select>
                </div>
              </div>
            </div>
  
            <div v-if="isLoading" class="loading-message">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
  
            <div v-else>
              <div class="row g-4 mb-4">
                <div class="col-12 col-md-4">
                  <div class="card summary-card">
                    <div class="card-body">
                      <h6 class="summary-label">Total Expenses</h6>
                      <div class="summary-value">
                        {{ formatCurrency(totalAmount) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="card summary-card">
                    <div class="card-body">
                      <h6 class="summary-label">Number of Transactions</h6>
                      <div class="summary-value">{{ filteredExpenses.length }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="card summary-card">
                    <div class="card-body">
                      <h6 class="summary-label">Average per Expense</h6>
                      <div class="summary-value">
                        {{
                          filteredExpenses.length
                            ? formatCurrency(
                                totalAmount / filteredExpenses.length
                              )
                            : "$0.00"
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <div class="row g-4 mb-4">
                <div class="col-12 col-lg-6">
                  <div class="card chart-card">
                    <div class="card-body">
                      <h3 class="chart-title">Expenses by Category</h3>
                      <div style="height: 300px;">
                        <Pie
                          v-if="
                            Object.values(expensesByCategory).some((val) => val > 0)
                          "
                          :data="pieChartData"
                          :options="pieChartOptions"
                        />
                        <div v-else class="no-data-message">
                          No data available for the selected period
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div class="col-12 col-lg-6">
                  <div class="card chart-card">
                    <div class="card-body">
                      <h3 class="chart-title">Monthly Expenses</h3>
                      <div style="height: 300px;">
                        <Bar
                          v-if="Object.values(monthlyData).some((val) => val > 0)"
                          :data="barChartData"
                          :options="barChartOptions"
                        />
                        <div v-else class="no-data-message">
                          No data available for this year
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="card expense-list-card">
              <div class="card-header">
                <h3 class="expense-list-title">Expense Details</h3>
              </div>
              <div class="table-responsive">
                <table class="table expense-table">
                  <thead>
                    <tr>
                      <th class="expense-table-header">Date</th>
                      <th class="expense-table-header">Description</th>
                      <th class="expense-table-header">Category</th>
                      <th class="expense-table-header">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="expense in filteredExpenses"
                      :key="expense.id"
                      class="expense-table-row"
                    >
                      <td class="expense-table-data">
                        {{ new Date(expense.date).toLocaleDateString("en-US") }}
                      </td>
                      <td class="expense-table-data">{{ expense.description }}</td>
                      <td class="expense-table-data">
                        <span
                          class="badge"
                          :class="[
                            'category-badge',
                            getCategoryBadgeColor(expense.category.name),
                          ]"
                        >
                          {{ expense.category.name }}
                        </span>
                      </td>
                      <td class="expense-table-data">
                        {{ formatCurrency(expense.amount) }}
                      </td>
                    </tr>
                    <tr v-if="filteredExpenses.length === 0">
                      <td
                        colspan="4"
                        class="text-center text-muted no-expenses-message"
                      >
                        No expenses found for the selected period
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted } from "vue";
  import { APIService } from "@/http/APIService";
  import UserProfile from "@/views/profile/UserProfile.vue";
  import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
  } from "chart.js";
  import { Pie, Bar } from "vue-chartjs";
  
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
  );
  
  const apiService = new APIService();
  
  export default {
    name: "Dashboard",
    components: {
      UserProfile,
      Pie,
      Bar,
    },
    data() {
      return {
        loading: true,
        error: "",
        expenses: [],
        pendingFriendRequests: [], // Placeholder
        selectedPeriod: "month",
        isLoading: true,
        categories: [],
      };
    },
    setup() {
      onMounted(async () => {});
    },
    computed: {
      totalExpenses() {
        return this.expenses.reduce(
          (total, expense) => total + parseFloat(expense.amount),
          0
        );
      },
      filteredExpenses() {
        const now = new Date();
        let cutoffDate = new Date();
        if (this.selectedPeriod === "week") {
          cutoffDate.setDate(now.getDate() - 7);
        } else if (this.selectedPeriod === "month") {
          cutoffDate.setMonth(now.getMonth() - 1);
        } else if (this.selectedPeriod === "year") {
          cutoffDate.setFullYear(now.getFullYear() - 1);
        } else {
          return [...this.expenses].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
        }
        return this.expenses
          .filter((expense) => new Date(expense.date) >= cutoffDate)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      },
      totalAmount() {
        return this.filteredExpenses.reduce(
          (total, expense) => total + parseFloat(expense.amount),
          0
        );
      },
      expensesByCategory() {
        const result = {};
        this.categories.forEach((category) => {
          result[category] = this.filteredExpenses
            .filter((expense) => expense.category.name === category)
            .reduce((total, expense) => total + parseFloat(expense.amount), 0);
        });
        return result;
      },
      pieChartData() {
        const filteredExpensesByCategory = {};
        this.categories.forEach((category) => {
          filteredExpensesByCategory[category] = this.filteredExpenses
            .filter((expense) => expense.category.name === category)
            .reduce((total, expense) => total + parseFloat(expense.amount), 0);
        });
        const backgroundColorPalette = [
          "#6b8068",
          "#2c463f",
          "#c76d32",
          "#6b8068",
          "#2c463f",
          "#c76d32",
        ];
        const backgroundColors = Object.keys(filteredExpensesByCategory).map(
          (category, index) => {
            return backgroundColorPalette[
              index % backgroundColorPalette.length
            ];
          }
        );
  
        return {
          labels: Object.keys(filteredExpensesByCategory),
          datasets: [
            {
              backgroundColor: backgroundColors,
              data: Object.values(filteredExpensesByCategory),
            },
          ],
        };
      },
      pieChartOptions() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: {
                  size: 14,
                },
                color: "#555",
              },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "#fff",
              bodyColor: "#fff",
              borderColor: "#ddd",
              borderWidth: 1,
              displayColors: true,
              callbacks: {
                label: (context) => {
                  const value = context.raw;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${context.label}: ${this.formatCurrency(
                    value
                  )} (${percentage}%)`;
                },
              },
            },
          },
          animation: {
            duration: 800,
          },
        };
      },
      monthlyData() {
        const months = {};
        const now = new Date();
        const currentYear = now.getFullYear();
        for (let i = 0; i < 12; i++) {
          const monthName = new Date(currentYear, i, 1).toLocaleString("en-US", {
            month: "short",
          });
          months[monthName] = 0;
        }
        this.filteredExpenses.forEach((expense) => {
          const expenseDate = new Date(expense.date);
          if (expenseDate.getFullYear() === currentYear) {
            const monthName = expenseDate.toLocaleString("en-US", {
              month: "short",
            });
            months[monthName] += parseFloat(expense.amount);
          }
        });
        return months;
      },
      barChartData() {
        const filteredMonthlyData = {};
        const now = new Date();
        const currentYear = now.getFullYear();
        for (let i = 0; i < 12; i++) {
          const monthName = new Date(currentYear, i, 1).toLocaleString("en-US", {
            month: "short",
          });
          filteredMonthlyData[monthName] = 0;
        }
        this.filteredExpenses.forEach((expense) => {
          const expenseDate = new Date(expense.date);
          if (expenseDate.getFullYear() === currentYear) {
            const monthName = expenseDate.toLocaleString("en-US", {
              month: "short",
            });
            filteredMonthlyData[monthName] += parseFloat(expense.amount);
          }
        });
  
        // Define a consistent color palette
        const barColor = "#6b8068";
  
        return {
          labels: Object.keys(filteredMonthlyData),
          datasets: [
            {
              label: "Monthly Expenses",
              backgroundColor: barColor,
              data: Object.values(filteredMonthlyData),
              borderRadius: 5,
            },
          ],
        };
      },
      barChartOptions() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "Monthly Expenses This Year",
              font: {
                size: 16,
                family: "'Nunito', sans-serif",
                weight: "bold",
              },
              color: "#2d3748",
              padding: {
                bottom: 20,
              },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "#fff",
              bodyColor: "#fff",
              borderColor: "#ddd",
              borderWidth: 1,
              displayColors: false,
              callbacks: {
                label: (context) => this.formatCurrency(context.raw),
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                font: {
                  size: 12,
                  family: "'Nunito', sans-serif",
                },
                color: "#666",
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
                drawBorder: false,
              },
              ticks: {
                callback: (value) => this.formatCurrency(value),
                font: {
                  size: 12,
                  family: "'Nunito', sans-serif",
                },
                color: "#666",
              },
            },
          },
          animation: {
            duration: 1000,
            easing: "easeInOutQuart",
          },
        };
      },
    },
    mounted() {
      this.fetchExpenses();
      this.fetchCategories();
    },
    methods: {
      async fetchExpenses() {
        try {
          this.loading = true;
          const response = await apiService.getExpenseList();
          if (response?.data && Array.isArray(response.data)) {
            this.expenses = response.data;
          } else {
            this.expenses = [];
            this.error = "Invalid response format from server.";
          }
        } catch (error) {
          this.error = "Failed to load expenses. Please try again later.";
          console.error("Error fetching expenses:", error);
        } finally {
          this.loading = false;
          this.isLoading = false;
        }
      },
      async fetchCategories() {
        try {
          const categoriesResponse = await apiService.getCategoryList();
          this.categories = categoriesResponse.data.map((cat) => cat.name);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      },
      formatCurrency(amount) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
      },
      getCategoryBadgeColor(categoryName) {
        const categoryColors = {
          Food: "bg-green-400 text-white",
          Housing: "bg-blue-400 text-white",
          Transportation: "bg-purple-400 text-white",
          Entertainment: "bg-yellow-400 text-gray-800",
          Utilities: "bg-orange-400 text-white",
          Healthcare: "bg-pink-400 text-white",
          Other: "bg-gray-400 text-white",
        };
        const colorMapping = {
          Food: "#6b8068",
          Housing: "#2c463f",
          Transportation: "#c76d32",
          Entertainment: "#6b8068",
          Utilities: "#2c463f",
          Healthcare: "#c76d32",
          Other: "#6b8068",
        };
        const categoryColorsPalette = {};
  
        for (const category in categoryColors) {
          categoryColorsPalette[category] = `background-color: ${colorMapping[category]}; color: #fff;`;
        }
  
        return categoryColorsPalette[categoryName] || "bg-gray-400 text-white";
      },
    },
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    min-height: 100vh;
    background-color: #f3f4f6;
    font-family: "Nunito", sans-serif;
  }
  
  .page-title {
    font-size: 2.25rem;
    font-weight: bold;
    color: #2c3748;
    margin-bottom: 2rem;
  }
  
  .link-card {
    background-color: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    border: 1px solid #edf2f7;
  }
  
  .link-card:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.15),
      0 3px 7px -3px rgba(0, 0, 0, 0.07);
  }
  
  .link-card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1rem;
  }
  
  .link-card-text {
    color: #718096;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }
  
  .link-card-button {
    background-color: #6b8068;
    color: white;
    padding: 0.8rem 1.6rem;
    border-radius: 1.5rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.2s ease,
      box-shadow 0.3s ease;
    text-decoration: none;
    border: none;
  }
  
  .link-card-button:hover {
    background-color: #2c463f;
    transform: translateY(-0.125rem);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  }
  
  .quick-add-card {
    background-color: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    border: 1px solid #edf2f7;
  }
  
  .quick-add-card:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.15),
      0 3px 7px -3px rgba(0, 0, 0, 0.07);
  }
  
  .quick-add-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1rem;
  }
  
  .quick-add-text {
    color: #718096;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }
  
  .quick-add-button {
    background-color: #6b8068;
    color: white;
    padding: 0.8rem 1.6rem;
    border-radius: 1.5rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.2s ease,
      box-shadow 0.3s ease;
    text-decoration: none;
    border: none;
  }
  
  .quick-add-button:hover {
    background-color: #2c463f;
    transform: translateY(-0.125rem);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  }
  
  .icon {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.75rem;
    stroke-width: 2.5;
  }
  
  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .report-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0;
  }
  
  .report-period-select {
    width: auto;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border-color: #e2e8f0;
    font-size: 0.875rem;
    color: #4a5568;
    transition: border-color 0.2s ease;
  }
  
  .report-period-select:focus {
    border-color: #c76d32;
    box-shadow: 0 0 0 3px rgba(199, 109, 50, 0.16);
    outline: none;
  }
  
  .summary-card {
    background-color: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #edf2f7;
  }
  
  .summary-card-body {
    padding: 1.25rem;
  }
  
  .summary-label {
    font-size: 0.875rem;
    color: #a0aec0;
    margin-bottom: 0.5rem;
  }
  
  .summary-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #2d3748;
  }
  
  .chart-card {
    background-color: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #edf2f7;
  }
  
  .chart-card-body {
    padding: 1.25rem;
  }
  
  .chart-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1.5rem;
  }
  
  .no-data-message {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #a0aec0;
    font-size: 1rem;
  }
  
  .expense-list-card {
    background-color: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #edf2f7;
  }
  
  .expense-list-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0;
  }
  
  .expense-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 0;
  }
  
  .expense-table-header {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #4a5568;
    border-bottom: 1px solid #edf2f7;
    font-size: 0.9rem;
  }
  
  .expense-table-data {
    padding: 1rem;
    color: #718096;
    border-bottom: 1px solid #edf2f7;
    font-size: 0.9rem;
  }
  
  .expense-table-row:hover {
    background-color: #f7fafc;
  }
  
  .no-expenses-message {
    padding: 1.5rem;
    text-align: center;
    color: #a0aec0;
    font-size: 1rem;
  }
  
  .category-badge {
    border-radius: 1rem;
    padding: 0.3rem 0.8rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
  }
  
  .bg-green-400 {
    background-color: #6b8068;
  }
  
  .bg-blue-400 {
    background-color: #2c463f;
  }
  
  .bg-purple-400 {
    background-color: #c76d32;
  }
  
  .bg-yellow-400 {
    background-color: #6b8068;
  }
  
  .bg-orange-400 {
    background-color: #2c463f;
  }
  
  .bg-pink-400 {
    background-color: #c76d32;
  }
  
  .bg-gray-400 {
    background-color: #a0aec0;
  }
  
  @media (max-width: 1200px) {
    .container {
      max-width: 960px;
    }
  }
  
  @media (max-width: 992px) {
    .container {
      max-width: 720px;
    }
  
    .quick-add-card {
      margin-bottom: 1.5rem;
    }
  }
  
  @media (max-width: 768px) {
    .container {
      max-width: 100%;
      padding-left: 1rem;
      padding-right: 1rem;
    }
  
    .row {
      margin-left: 0;
      margin-right: 0;
    }
  
    .col-12,
    .col-md-6,
    .col-lg-4 {
      padding-left: 0;
      padding-right: 0;
    }
  
    .quick-add-button {
      width: 100%;
      text-align: center;
    }
  
    .report-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  
    .summary-value {
      font-size: 1.5rem;
    }
  }
  </style>
  