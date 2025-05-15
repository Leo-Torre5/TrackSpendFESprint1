<template>
  <div class="auth-page">
    <main class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <img
            src="@/assets/images/TrackSpendLogo.png"
            alt="TrackSpend Logo"
            class="logo-image"
          />
        </div>
        <h2 class="auth-title">TrackSpend</h2>
        <p class="subtitle">The Smart, Personalized Way to Track & Budget.</p>
        <h2 class="auth-title">Create Account</h2>

        <div v-if="showMsg === 'error'" class="auth-alert error">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="register" class="auth-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              v-model="credentials.username"
              type="text"
              id="username"
              required
              class="form-input"
              placeholder="Enter username"
            />
          </div>
          <div class="name-fields">
            <div class="form-group">
              <label for="first_name">First Name</label>
              <input
                v-model="credentials.first_name"
                type="text"
                id="first_name"
                class="form-input"
                placeholder="First name"
              />
            </div>

            <div class="form-group">
              <label for="last_name">Last Name</label>
              <input
                v-model="credentials.last_name"
                type="text"
                id="last_name"
                class="form-input"
                placeholder="Last name"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              v-model="credentials.email"
              type="email"
              id="email"
              required
              class="form-input"
              placeholder="Enter email"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              v-model="credentials.password"
              type="password"
              id="password"
              required
              class="form-input"
              placeholder="Enter password"
            />
          </div>

          <div class="form-group">
            <label for="password2">Confirm Password</label>
            <div class="password-input">
              <input
                v-model="credentials.password2"
                type="password"
                id="password2"
                required
                class="form-input"
                placeholder="Confirm password"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="phone_number">Phone Number</label>
            <input
              v-model="credentials.phone_number"
              type="text"
              id="phone_number"
              class="form-input"
              placeholder="Enter phone number"
            />
          </div>

          <div class="form-group">
            <label for="street_address">Street Address</label>
            <input
              v-model="credentials.street_address"
              type="text"
              id="street_address"
              class="form-input"
              placeholder="Enter street address"
            />
          </div>

          <div class="form-group">
            <label for="city">City</label>
            <input
              v-model="credentials.city"
              type="text"
              id="city"
              class="form-input"
              placeholder="Enter your city"
            />
          </div>

          <div class="form-group">
            <label for="state">State</label>
            <input
              v-model="credentials.state"
              type="text"
              id="state"
              class="form-input"
              placeholder="Enter your state"
            />
          </div>

          <div class="form-group">
            <label for="zip_code">Zip Code</label>
            <input
              v-model="credentials.zip_code"
              type="text"
              id="zip_code"
              class="form-input"
              placeholder="Enter your zip code"
            />
          </div>

          <button type="submit" class="auth-button">
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account?
            <router-link to="/login">Login here</router-link>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
const API_URL = process.env.VUE_APP_API_URL || "http://localhost:8000";
import axios from 'axios';
import router from '../router';

export default {
  name: 'RegisterPage',
  data() {
    return {
      credentials: {
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: '',
        phone_number: '',
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
      },
      showMsg: '',
      errorMessage: '',
      loading: false,
      showPassword: false,
    };
  },
  methods: {
    async register() {
      this.loading = true;
      this.showMsg = '';

      // Password validation
      if (this.credentials.password !== this.credentials.password2) {
        this.showMsg = 'error';
        this.errorMessage = 'Passwords do not match';
        this.loading = false;
        return;
      }

      try {
        // Send registration data
        const response = await axios.post(`${API_URL}/register/`, {
          username: this.credentials.username,
          password: this.credentials.password,
          email: this.credentials.email,
          first_name: this.credentials.first_name,
          last_name: this.credentials.last_name,
          phone_number: this.credentials.phone_number,
          street_address: this.credentials.street_address,
          city: this.credentials.city,
          state: this.credentials.state,
          zip_code: this.credentials.zip_code,
        });

        if (response.status === 201) {
          // Extract tokens from the response
          const { access, refresh } = response.data;

          // Store tokens (you might want to use a more secure storage method)
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);

          // Set authorization header for subsequent requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

          // Redirect to the dashboard
          router.push('/Dashboard');
        }
      } catch (error) {
        this.showMsg = 'error';
        if (error.response) {
          this.errorMessage = error.response.data.detail || 'Registration failed';
        } else {
          this.errorMessage = 'Network error. Check your connection.';
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>


<style scoped>
/* Reuse auth-page styles from Auth.vue */
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

.auth-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-input {
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #42b983;
}

.name-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.auth-button {
  background-color: #2c463f;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-button:hover {
  background-color: #6b8068;
}

.auth-alert {
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.error {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.auth-footer a {
  color: #2c463f;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

/* Header styles from previous components */
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

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.sign-in-button {
  background-color: #42b983;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
}

.sign-in-button:hover {
  background-color: #359768;
}

@media (max-width: 768px) {
  .name-fields {
    grid-template-columns: 1fr;
  }

  .auth-card {
    padding: 1.5rem;
  }
}

.auth-logo {
  text-align: center;
  margin: 1rem 0 2rem;
}

.logo-image {
  max-width: 150px;
  height: auto;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

/* animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-logo {
  animation: fadeInUp 0.6s ease;
}

.subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b8068;
  cursor: pointer;
  font-size: 0.9rem;
}
</style>
