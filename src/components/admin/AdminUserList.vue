<template>
  <div class="page-container">
        <section class="intro-section">
      <div class="intro-card message-card">
        <div class="intro-content">
          <h2 class="intro-title">Manage Users</h2>
          <p class="intro-text">
            As an administrator, you can manage users here.  You can view, edit, and delete users.
          </p>
        </div>
      </div>
      <div class="intro-card button-card">
        <router-link to="/users/create" class="btn btn-primary create-user-btn">
          <i class="bi bi-plus-lg"></i> Create New User
        </router-link>
      </div>
    </section>

    <section v-if="successMessage" class="alert alert-success mt-3">
      {{ successMessage }}
    </section>

    <section class="user-list-section" v-if="!loading && users.length > 0">
      <h3 class="list-title">Existing Users</h3>
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-head">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span :class="['badge', user.user_type === 2 ? 'bg-primary' : 'bg-secondary']">
                      {{ user.user_type === 2 ? 'Admin' : 'Regular' }}
                    </span>
                  </td>
                  <td>
                    <span :class="['badge', user.is_active ? 'bg-success' : 'bg-danger']">
                      {{ user.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <div class="button-group">
                      <router-link
                        :to="`/users/edit/${user.id}`"
                        class="btn btn-outline-primary btn-sm"
                      >
                        <i class="bi bi-pencil-fill"></i> Edit
                      </router-link>
                      <button
                        @click="confirmDelete(user.id)"
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
      <p class="loading-text">Loading users...</p>
    </section>

    <section v-if="!loading && users.length === 0" class="empty-section">
      <div class="alert alert-info" role="alert">
        <i class="bi bi-info-circle-fill"></i> No users found.
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
  name: 'AdminUserList',
  data() {
    return {
      users: [],
      loading: true,
      error: null,
      successMessage: null,
    };
  },
  async created() {
    // Check for success query parameter
    if (this.$route.query.created) {
      this.successMessage = 'User created successfully!';
      // Clear the query parameter
      this.$router.replace({ query: null });
    }
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await APIService.getAdminUserList();
        this.users = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error fetching users:', {
          error: error.response?.data,
          status: error.response?.status,
          headers: error.config?.headers,
        });
      } finally {
        this.loading = false;
      }
    },
    async confirmDelete(userId) {
      const user = this.users.find((u) => u.id === userId);
      const result = await confirmDialog(
        `Delete User ${user.username}?`,
        'This action cannot be undone.',
        'warning'
      );

      if (result.isConfirmed) {
        try {
          await APIService.deleteAdminUser(userId);
          this.users = this.users.filter((u) => u.id !== userId);
        } catch (error) {
          alert(
            `Failed to delete user: ${
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

.create-user-btn {
  padding: 12px 20px;
  font-size: 1.1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: #c76d32;
  border: none;
  color: white;
  margin-top: 0;
}

.create-user-btn:hover {
  background-color: #a45a23;
  transform: translateY(-1px);
}

.user-list-section {
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
