<template>
    <div class="auth-page">
      <header class="header">
        <nav class="navbar">
          <div class="logo">
            <router-link to="/">TrackSpend</router-link>
          </div>
          <div class="nav-links">
            <router-link to="/users" class="sign-in-button">Back to Users</router-link>
          </div>
        </nav>
      </header>
  
      <main class="auth-container">
        <div class="auth-card">
          <h2 class="auth-title">{{ pageTitle }}</h2>
          
          <div v-if="showMsg === 'error'" class="auth-alert error">
            {{ errorMessage }}
          </div>
  
          <form @submit.prevent="handleSubmit" class="auth-form">
            <div class="form-group">
              <label>Username</label>
              <input
                v-model="user.username"
                type="text"
                required
                class="form-input"
                placeholder="Enter username"
              />
            </div>
  
            <div class="form-group">
              <label>Email</label>
              <input
                v-model="user.email"
                type="email"
                required
                class="form-input"
                placeholder="Enter email"
              />
            </div>
  
            <div class="form-group">
              <label>Password</label>
              <input
                v-model="user.password"
                type="password"
                :required="!isUpdate"
                class="form-input"
                placeholder="Enter password"
              />
            </div>
  
            <div class="name-fields">
              <div class="form-group">
                <label>First Name</label>
                <input
                  v-model="user.first_name"
                  type="text"
                  class="form-input"
                  placeholder="First name"
                />
              </div>
  
              <div class="form-group">
                <label>Last Name</label>
                <input
                  v-model="user.last_name"
                  type="text"
                  class="form-input"
                  placeholder="Last name"
                />
              </div>
            </div>
  
            <div class="form-group">
              <label>Admin Privileges</label>
              <select v-model="user.is_staff" class="form-input">
                <option :value="false">Regular User</option>
                <option :value="true">Administrator</option>
              </select>
            </div>
  
            <div class="action-buttons">
              <button type="submit" class="auth-button">
                {{ isUpdate ? 'Update' : 'Create' }}
              </button>
              <button type="button" class="auth-button secondary" @click="cancelOperation">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import router from '../router';
  
  export default {
    name: 'UserCreate',
    data() {
      return {
        user: {
          username: '',
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          is_staff: false
        },
        pageTitle: 'Create New User',
        isUpdate: false,
        showMsg: '',
        errorMessage: ''
      };
    },
    beforeCreate() {
      const isAuthenticated = localStorage.getItem('access_token');
      const isAdmin = JSON.parse(localStorage.getItem('is_staff') || false)
      
      if (!isAuthenticated || !isAdmin) {
        router.push('/auth');
      }
    },
    methods: {
      async handleSubmit() {
        try {
          if (this.isUpdate) {
            await this.updateUser();
          } else {
            await this.createUser();
          }
        } catch (error) {
          this.handleError(error);
        }
      },
      async createUser() {
        const response = await axios.post(
          'http://localhost:8000/api/users/',
          this.user,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        );
        
        if (response.status === 201) {
          router.push('/users');
        }
      },
      async updateUser() {
        const response = await axios.put(
          `http://localhost:8000/api/users/${this.$route.params.id}/`,
          this.user,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        );
        
        if (response.status === 200) {
          router.push('/users');
        }
      },
      cancelOperation() {
        router.push('/users');
      },
      handleError(error) {
        this.showMsg = 'error';
        if (error.response) {
          switch (error.response.status) {
            case 401:
              this.errorMessage = 'Session expired. Please login again.';
              router.push('/auth');
              break;
            case 403:
              this.errorMessage = 'You do not have permission for this action.';
              break;
            case 400:
              this.errorMessage = error.response.data.detail || 'Invalid input data.';
              break;
            default:
              this.errorMessage = 'Server error. Please try again later.';
          }
        } else {
          this.errorMessage = 'Network error. Please check your connection.';
        }
      }
    },
    async mounted() {
      if (this.$route.params.id) {
        this.isUpdate = true;
        this.pageTitle = 'Edit User';
        
        try {
          const response = await axios.get(
            `http://localhost:8000/api/users/${this.$route.params.id}/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
              }
            }
          );
          this.user = response.data;
        } catch (error) {
          this.handleError(error);
        }
      }
    }
  };
  </script>
  
  <style scoped>

  .auth-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .auth-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background-color: #f5f7fb;
  }
  
  .auth-card {
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .secondary {
    background-color: #6c757d;
  }
  
  .secondary:hover {
    background-color: #5a6268;
  }
  
  </style>