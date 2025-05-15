<template>
  <div class="page-container">
    <form @submit.prevent="handleSubmit" class="form-card">
      <div class="form-header">
        <h2 class="form-title">{{ pageTitle }}</h2>
        <p class="form-description">
          Fill out the form below to create a new expense. All fields marked with an asterisk (<span class="required-star">*</span>) are required.
        </p>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label for="description" class="form-label">Description <span class="required-star">*</span></label>
          <input
            v-model="expense.description"
            type="text"
            id="description"
            required
            class="input-field"
            placeholder="Enter description"
          />
        </div>

        <div class="form-group">
          <label for="amount" class="form-label">Amount <span class="required-star">*</span></label>
          <input
            v-model="expense.amount"
            type="number"
            id="amount"
            step="0.01"
            required
            class="input-field"
            placeholder="0.00"
          />
        </div>

        <div class="form-group">
          <label for="date" class="form-label">Date <span class="required-star">*</span></label>
          <input
            v-model="expense.date"
            type="date"
            id="date"
            required
            class="input-field"
          />
        </div>

        <div class="form-group">
          <label for="category" class="form-label">Category <span class="required-star">*</span></label>
          <select
            v-model="expense.category_id"
            id="category"
            class="select-field"
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
          <label for="notes" class="form-label">Notes</label>
          <textarea
            v-model="expense.notes"
            id="notes"
            class="input-field"
            placeholder="Additional notes..."
            rows="3"
          ></textarea>
        </div>
      </div>

      <div class="button-container">
        <button
          type="submit"
          class="btn btn-primary create-button"
          :disabled="loading"
        >
          {{ "Save Expense" }}
        </button>
      </div>
      <div v-if="showMsg === 'error'" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </form>
    <div class="bottom-button-container">
      <a href="#" class="btn btn-secondary back-button bottom-back-button" @click.prevent="$router.go(-1)">
        <i class="bi bi-arrow-left"></i> Back to Expenses
      </a>
    </div>
  </div>
</template>

<script>
import { APIService } from "@/http/APIService";
import Swal from 'sweetalert2';
const apiService = new APIService();

export default {
  name: "ExpenseCreateUpdate",
  data() {
    return {
      expense: {
        description: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        category_id: "",
        notes: "",
      },
      categories: [],
      pageTitle: "New Expense",
      showMsg: "",
      errorMessage: "",
      loading: false, 
      isUpdate: false,
    };
  },
  beforeCreate() {
    const isAuthenticated = localStorage.getItem("access_token");
    if (!isAuthenticated) {
      this.$router.push("/login");
    }
  },
  async mounted() {
    await this.fetchCategories();
    if (this.$route.params.id && this.$route.params.id !== "create") {
      this.isUpdate = true;
      this.pageTitle = "Edit Expense";
      await this.fetchExpense();
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await apiService.getCategoryList();
        this.categories = response.data;
      } catch (error) {
        this.handleError(error);
      }
    },
    async fetchExpense() {
      try {
        this.loading = true;  
        const response = await apiService.getExpense(
          this.$route.params.id
        );
        this.expense = {
          ...response.data,
          date: response.data.date.split("T")[0],
          category_id: response.data.category.id,
          notes: response.data.notes,
        };
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false; 
      }
    },
    async fetchExpenseList() {
      try {
        const response = await apiService.getExpenseList(
          this.$route.params.id
        );
        this.expense = {
          ...response.data,
          date: response.data.date.split("T")[0],
        };
      } catch (error) {
        this.handleError(error);
      }
    },
    async handleSubmit() {
      this.showMsg = "";
      try {
        const expenseData = {
          ...this.expense,
          amount: parseFloat(this.expense.amount),
        };
        if (this.isUpdate) {
          await apiService.updateExpense(
            this.$route.params.id,
            expenseData
          );
        } else {
          await apiService.createExpense(expenseData);
        }
        await Swal.fire({
          title: "Success!",
          text: "Expense saved successfully.",
          icon: "success",
          confirmButtonColor: "#6b8068",
        });
        this.$router.push("/expenses");
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
                : "Failed to save expense.",
          icon: "error",
          confirmButtonColor: "#6b8068",
        });
        this.handleError(error);
      } finally {
       //  this.loading = false;  // Removed:  no longer used
      }
    },
    handleError(error) {
      this.showMsg = "error";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            this.errorMessage =
              "Invalid expense data. Please check your inputs.";
            break;
          case 401:
            localStorage.removeItem("access_token");
            this.$router.push("/login");
            break;
          default:
            this.errorMessage = "Error saving expense. Please try again.";
        }
      } else {
        this.errorMessage = "Network error. Please check your connection.";
      }
    },
    cancel() {
      this.$router.push("/expenses");
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
  grid-template-columns: 1fr;
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
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.375rem 0 0 0.375rem;
  margin-right: -1px;
  color: #2c3e50;
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

  .form-group{
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
