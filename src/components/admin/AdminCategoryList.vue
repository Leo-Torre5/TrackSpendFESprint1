<template>
  <div class="page-container">
    <section class="intro-section">
      <div class="intro-card message-card">
        <div class="intro-content">
          <h2 class="intro-title">Manage Expense Categories</h2>
          <p class="intro-text">
            As an administrator, you can manage expense categories here. Categories help users classify their expenses,
            providing valuable data for financial tracking and reporting. You can create, edit, and delete categories.
            Default categories are essential and cannot be deleted.
          </p>
        </div>
      </div>
      <div class="intro-card button-card">
        <router-link :to="{ name: 'CategoryCreate' }" class="btn btn-primary create-category-btn">
          <i class="bi bi-plus-lg"></i> Create New Category
        </router-link>
      </div>
    </section>

    <section class="category-list-section" v-if="!loading && categories.length > 0">
      <h3 class="list-title">Existing Categories</h3>
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-head">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Default</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in categories" :key="category.id">
                  <td>{{ category.name }}</td>
                  <td>
                    <span :class="['badge', category.is_default ? 'bg-success' : 'bg-secondary']">
                      {{ category.is_default ? 'Yes' : 'No' }}
                    </span>
                  </td>
                  <td>
                    <div class="button-group">
                      <router-link
                        :to="{ name: 'CategoryEdit', params: { id: category.id } }"
                        class="btn btn-outline-primary btn-sm"
                      >
                        <i class="bi bi-pencil-fill"></i> Edit
                      </router-link>
                      <button
                        @click="confirmDelete(category.id)"
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
      <p class="loading-text">Loading expense categories...</p>
    </section>

    <section v-if="!loading && categories.length === 0" class="empty-section">
      <div class="alert alert-info" role="alert">
        <i class="bi bi-info-circle-fill"></i> No expense categories found. Click the "Create Category" button to add
        one.
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
  name: 'AdminCategoryList',
  data() {
    return {
      categories: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await APIService.getAdminCategoryList();
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.loading = false;
      }
    },
    async confirmDelete(categoryId) {
      const category = this.categories.find((c) => c.id === categoryId);
      const { isConfirmed } = await confirmDialog(
        `Delete Category "${category.name}"?`,
        'This action cannot be undone.',
        'warning' // Use a simple string value for icon type
      );

      if (isConfirmed) {
        try {
          await APIService.deleteAdminCategory(categoryId);
          this.categories = this.categories.filter((c) => c.id !== categoryId);
        } catch (error) {
          console.error('Delete error:', error);
          alert(
            `Failed to delete category: ${
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

.create-category-btn {
  padding: 12px 20px;
  font-size: 1.1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: #c76d32;
  border: none;
  color: white;
  margin-top: 0;
}

.create-category-btn:hover {
  background-color: #a45a23;
  transform: translateY(-1px);
}

.category-list-section {
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
  .page-header{
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
