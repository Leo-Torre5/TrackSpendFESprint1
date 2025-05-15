<template>
    <div class="page-container">
      <form @submit.prevent="handleSubmit" class="form-card">
        <div class="form-header">
          <h2 class="form-title">{{ pageTitle }}</h2>
          <p class="form-description">
            Fill out the form below to {{ isUpdate ? 'edit' : 'create' }} a new budget. All fields marked with an asterisk (<span class="required-star">*</span>) are required.
          </p>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label for="category" class="form-label">Category <span class="required-star">*</span></label>
            <select
              v-model="budget.category_id"
              id="category"
              class="input-field select-field"
              required
              :disabled="loading"
            >
              <option value="">Select Category</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="amount" class="form-label">Budget Amount <span class="required-star">*</span></label>
            <input
              v-model.number="budget.amount"
              type="number"
              id="amount"
              step="0.01"
              min="0"
              required
              class="input-field amount-input-field"
              placeholder="0.00"
              :disabled="loading"
            />
          </div>
  
          <div class="form-group">
            <label for="start_date" class="form-label">Start Date <span class="required-star">*</span></label>
            <input
              v-model="budget.start_date"
              type="date"
              id="start_date"
              required
              class="input-field"
              :max="budget.end_date"
              :disabled="loading"
            />
          </div>
  
          <div class="form-group">
            <label for="end_date" class="form-label">End Date</label>
            <input
              v-model="budget.end_date"
              type="date"
              id="end_date"
              class="input-field"
              :min="budget.start_date"
              :disabled="loading"
            />
          </div>
  
          <div class="form-group">
            <label for="period" class="form-label">Period <span class="required-star">*</span></label>
            <select
              v-model="budget.period"
              id="period"
              class="input-field select-field"
              required
              :disabled="loading"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="monthly" selected>
                Monthly
              </option>
              <option value="six_month">Six Month</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
  
        <div class="button-container">
          <button
            type="submit"
            class="btn btn-primary create-button"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm"></span>
            {{ loading ? "Processing..." : "Save Budget" }}
          </button>
        </div>
        <div v-if="showMsg === 'error'" class="alert alert-danger mt-3">
          {{ errorMessage }}
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
  import { APIService } from "@/http/APIService";
  import Swal from 'sweetalert2';
  const apiService = new APIService();
  
  export default {
    name: "BudgetCreateUpdate",
    data() {
      return {
        budget: {
          category_id: null,
          amount: 0,
          period: "monthly",
          start_date: new Date().toISOString().split("T")[0],
          end_date: this.getDefaultEndDate(),
        },
        categories: [],
        pageTitle: "Create Budget",
        showMsg: "",
        errorMessage: "",
        loading: false,
        isUpdate: false,
      };
    },
    async created() {
      await this.fetchCategories();
      if (this.$route.params.id && this.$route.params.id !== "create") {
        this.isUpdate = true;
        this.pageTitle = "Edit Budget";
        await this.fetchBudget();
      }
    },
    methods: {
      getDefaultEndDate() {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split("T")[0];
      },
      async fetchCategories() {
        try {
          const response = await apiService.getCategoryList();
          this.categories = response.data;
        } catch (error) {
          this.handleError(error);
        }
      },
      async fetchBudget() {
        try {
          this.loading = true;
          const response = await apiService.getBudget(
            this.$route.params.id
          );
          const data = response.data;
          this.budget = {
            category_id: data.category?.id || data_id,
            amount: parseFloat(data.amount),
            period: data.period,
            start_date: data.start_date.split("T")[0],
            end_date: data.end_date
              ? data.end_date.split("T")[0]
              : this.getDefaultEndDate(),
          };
        } catch (error) {
          this.handleError(error);
        } finally {
          this.loading = false;
        }
      },
      async handleSubmit() {
        this.loading = true;
        this.showMsg = "";
        try {
          // Get the current user ID from your auth system
          const userId =
            this.$store.state.user?.id ||
            JSON.parse(localStorage.getItem("user"))?.id;
          if (!userId) {
            throw new Error("User not authenticated");
          }
          const budgetData = {
            user_id: userId,
            category_id: this.budget.category_id,
            amount: parseFloat(this.budget.amount),
            period: this.budget.period,
            start_date: this.budget.start_date,
            end_date: this.budget.end_date || null,
          };
          if (this.isUpdate) {
            await apiService.updateBudget(
              this.$route.params.id,
              budgetData
            );
          } else {
            await apiService.createBudget(budgetData);
          }
          await Swal.fire({
            title: "Success!",
            text: "Budget saved successfully.",
            icon: "success",
            confirmButtonColor: "#6b8068",
          });
          this.$router.push("/budgets");
        } catch (error) {
          await Swal.fire({
            title: "Error",
            text:
              error &&
              error.response &&
              error.response.data &&
              error.response.data.detail
                ? error.response.data.detail
                : error && error.message
                  ? error.message
                  : "Failed to save budget.",
            icon: "error",
            confirmButtonColor: "#6b8068",
          });
          this.handleError(error);
        } finally {
          this.loading = false;
        }
      },
      handleError(error) {
        this.showMsg = "error";
        if (error.response) {
          switch (error.response.status) {
            case 400:
              this.errorMessage =
                "Invalid budget data. Please check your inputs.";
              break;
            case 401:
              localStorage.removeItem("access_token");
              this.$router.push("/login");
              break;
            default:
              this.errorMessage = "Error saving budget. Please try again.";
          }
        } else {
          this.errorMessage = "Network error. Please check your connection.";
        }
      },
      cancel() {
        this.$router.push("/budgets");
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
    min-height: 600px;
    display: flex;
    flex-direction: column;
  }
  
  .page-header {
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
  
  .input-group {
    display: flex;
    align-items: center;
  }
  
  .input-group-text {
    display: none;
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
  .input-field.amount-input-field{
      padding-left: 14px;
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
  
  .action-buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    width: 100%;
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
  
    .form-group {
      margin-bottom: 1.5rem;
    }
  
    .button-container {
      flex-direction: column;
      gap: 15px;
    }
  
    .bottom-back-button {
      margin-left: auto;
      margin-right: auto;
      width: 80%;
    }
  }
  </style>