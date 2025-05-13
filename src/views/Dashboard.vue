<script>
import { onMounted, computed } from "vue";
import { APIService } from "@/http/APIService";
import UserProfile from "@/views/profile/UserProfile.vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const apiService = new APIService();

export default {
    name: "Dashboard",
    components: {
        UserProfile,
        Pie,
        Bar
    },
    data() {
        return {
            loading: true,
            error: "",
            expenses: [],
            pendingFriendRequests: [], // Placeholder for now
            selectedPeriod: 'month',
            isLoading: true,
            categories: []
        };
    },
    setup() {
        // This is the correct way to use onMounted in the Composition API
        onMounted(async () => {
            // This will be called when the component is mounted
        });
    },
    computed: {
        totalExpenses() {
            return this.expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
        },
        // Reports logic below
        filteredExpenses() {
            const now = new Date();
            let cutoffDate = new Date();
            if (this.selectedPeriod === 'week') {
                cutoffDate.setDate(now.getDate() - 7);
            } else if (this.selectedPeriod === 'month') {
                cutoffDate.setMonth(now.getMonth() - 1);
            } else if (this.selectedPeriod === 'year') {
                cutoffDate.setFullYear(now.getFullYear() - 1);
            } else {
                // Sort all expenses by descending date
                return [...this.expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
            }
            // Filter then sort by descending date
            return this.expenses
                .filter(expense => new Date(expense.date) >= cutoffDate)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
        },
        totalAmount() {
            return this.filteredExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
        },
        expensesByCategory() {
            const result = {};
            this.categories.forEach(category => {
                result[category] = this.filteredExpenses
                    .filter(expense => expense.category.name === category)
                    .reduce((total, expense) => total + parseFloat(expense.amount), 0);
            });
            return result;
        },
        pieChartData() {
            const filteredExpensesByCategory = {};
            this.categories.forEach(category => {
                filteredExpensesByCategory[category] = this.filteredExpenses
                    .filter(expense => expense.category.name === category)
                    .reduce((total, expense) => total + parseFloat(expense.amount), 0);
            });
            return {
                labels: Object.keys(filteredExpensesByCategory),
                datasets: [
                    {
                        backgroundColor: [
                            '#0d6efd', '#198754', '#ffc107', '#dc3545', 
                            '#6610f2', '#fd7e14', '#adb5bd'
                        ],
                        data: Object.values(filteredExpensesByCategory)
                    }
                ]
            };
        },
        pieChartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${this.formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            };
        },
        monthlyData() {
            const months = {};
            const now = new Date();
            const currentYear = now.getFullYear();
            for (let i = 0; i < 12; i++) {
                const monthName = new Date(currentYear, i, 1).toLocaleString('en-US', { month: 'short' });
                months[monthName] = 0;
            }
            this.filteredExpenses.forEach(expense => {
                const expenseDate = new Date(expense.date);
                if (expenseDate.getFullYear() === currentYear) {
                    const monthName = expenseDate.toLocaleString('en-US', { month: 'short' });
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
                const monthName = new Date(currentYear, i, 1).toLocaleString('en-US', { month: 'short' });
                filteredMonthlyData[monthName] = 0;
            }
            this.filteredExpenses.forEach(expense => {
                const expenseDate = new Date(expense.date);
                if (expenseDate.getFullYear() === currentYear) {
                    const monthName = expenseDate.toLocaleString('en-US', { month: 'short' });
                    filteredMonthlyData[monthName] += parseFloat(expense.amount);
                }
            });
            return {
                labels: Object.keys(filteredMonthlyData),
                datasets: [
                    {
                        label: 'Monthly Expenses',
                        backgroundColor: '#0d6efd',
                        data: Object.values(filteredMonthlyData)
                    }
                ]
            };
        },
        barChartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Monthly Expenses This Year'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => this.formatCurrency(context.raw)
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            };
        }
    },
    mounted() {
        // Using Options API lifecycle hook
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
                this.categories = categoriesResponse.data.map(cat => cat.name);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        formatCurrency(amount) {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
        },
    },
};
</script>

<template>
    <div class="dashboard-container">
        <Navbar />

        <div class="py-4">
            <header>
                <div class="container">
                    <h1 class="display-4 fw-bold mb-4">
                        Dashboard
                    </h1>
                </div>
            </header>
            <main>
                <div class="container">
                    <div class="row mb-4">
                        <div class="col-12 col-lg-6">
                            <UserProfile />
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="d-flex flex-column gap-4 h-100">
                                <!-- Quick Add Expense Card -->
                                <div class="card h-100">
                                    <div class="card-body">
                                        <h5 class="card-title">Quick Add Expense</h5>
                                        <p class="card-text text-muted">Add a new expense quickly.</p>
                                        <router-link
                                            to="/expenses/create"
                                            class="btn btn-primary d-inline-flex align-items-center"
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
                                <!-- Quick Add Budget Card -->
                                <div class="card h-100">
                                    <div class="card-body">
                                        <h5 class="card-title">Quick Add Budget</h5>
                                        <p class="card-text text-muted">Set a new budget quickly.</p>
                                        <router-link
                                            to="/budgets/create"
                                            class="btn btn-primary d-inline-flex align-items-center"
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

                    <!-- Section Reports fusionnée -->
                    <!-- Time Period Selector -->
                    <div class="card mb-4">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                          <h3 class="h5 mb-0">Expense Analysis</h3>
                          <select
                            v-model="selectedPeriod"
                            class="form-select w-auto"
                          >
                            <option value="week">Last 7 days</option>
                            <option value="month">Last 30 days</option>
                            <option value="year">Last 12 months</option>
                            <option value="all">All time</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="isLoading" class="text-center py-5">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>

                    <div v-else>
                      <!-- Summary Cards -->
                      <div class="row g-4 mb-4">
                        <div class="col-12 col-md-4">
                          <div class="card">
                            <div class="card-body">
                              <h6 class="text-muted mb-1">Total Expenses</h6>
                              <div class="fs-4 fw-bold">{{ formatCurrency(totalAmount) }}</div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12 col-md-4">
                          <div class="card">
                            <div class="card-body">
                              <h6 class="text-muted mb-1">Number of Transactions</h6>
                              <div class="fs-4 fw-bold">{{ filteredExpenses.length }}</div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12 col-md-4">
                          <div class="card">
                            <div class="card-body">
                              <h6 class="text-muted mb-1">Average per Expense</h6>
                              <div class="fs-4 fw-bold">
                                {{ filteredExpenses.length ? formatCurrency(totalAmount / filteredExpenses.length) : '$0.00' }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Charts -->
                      <div class="row g-4 mb-4">
                        <!-- Pie Chart -->
                        <div class="col-12 col-lg-6">
                          <div class="card">
                            <div class="card-body">
                              <h3 class="h5 mb-4">Expenses by Category</h3>
                              <div style="height: 300px;">
                                <Pie 
                                  v-if="Object.values(expensesByCategory).some(val => val > 0)"
                                  :data="pieChartData" 
                                  :options="pieChartOptions" 
                                />
                                <div v-else class="d-flex align-items-center justify-content-center h-100 text-muted">
                                  No data available for the selected period
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Bar Chart -->
                        <div class="col-12 col-lg-6">
                          <div class="card">
                            <div class="card-body">
                              <h3 class="h5 mb-4">Monthly Expenses</h3>
                              <div style="height: 300px;">
                                <Bar 
                                  v-if="Object.values(monthlyData).some(val => val > 0)"
                                  :data="barChartData" 
                                  :options="barChartOptions" 
                                />
                                <div v-else class="d-flex align-items-center justify-content-center h-100 text-muted">
                                  No data available for this year
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Expense List -->
                      <div class="card">
                        <div class="card-header">
                          <h3 class="h5 mb-0">Expense Details</h3>
                        </div>
                        <div class="table-responsive">
                          <table class="table table-hover mb-0">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="expense in filteredExpenses" :key="expense.id">
                                <td>{{ new Date(expense.date).toLocaleDateString('en-US') }}</td>
                                <td>{{ expense.description }}</td>
                                <td>
                                  <span class="badge bg-success">{{ expense.category.name }}</span>
                                </td>
                                <td>{{ formatCurrency(expense.amount) }}</td>
                              </tr>
                              <tr v-if="filteredExpenses.length === 0">
                                <td colspan="4" class="text-center text-muted">
                                  No expenses found for the selected period
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<style scoped>
.dashboard-container {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.icon {
    width: 1.5rem;
    height: 1.5rem;
}

.icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
