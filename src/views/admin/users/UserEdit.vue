<template>
  <div class="page-container">
    <form @submit.prevent="submitForm" class="form-card">
      <div class="form-header">
        <h2 class="form-title">Edit User Account</h2>
        <p class="form-description">
          Modify the user account details below. All fields marked with an asterisk (<span class="required-star">*</span>) are required.
        </p>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label for="username" class="form-label">Username <span class="required-star">*</span></label>
          <input
            type="text"
            id="username"
            v-model="user.username"
            required
            placeholder="Enter username"
            class="input-field"
          />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email <span class="required-star">*</span></label>
          <input
            type="email"
            id="email"
            v-model="user.email"
            required
            placeholder="Enter email"
            class="input-field"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">New Password</label>
          <input
            type="password"
            id="password"
            v-model="user.password"
            placeholder="Enter new password (leave blank to keep unchanged)"
            class="input-field"
          />
        </div>

        <div class="form-group horizontal-group">
          <div class="form-subgroup">
            <label for="firstName" class="form-label">First Name <span class="required-star">*</span></label>
            <input
              type="text"
              id="firstName"
              v-model="user.first_name"
              required
              placeholder="Enter first name"
              class="input-field"
            />
          </div>
          <div class="form-subgroup">
            <label for="lastName" class="form-label">Last Name <span class="required-star">*</span></label>
            <input
              type="text"
              id="lastName"
              v-model="user.last_name"
              required
              placeholder="Enter last name"
              class="input-field"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">Phone Number</label>
          <input
            type="tel"
            id="phone"
            v-model="user.profile.phone_number"
            placeholder="Enter phone number (123) 456-7890"
            pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
            class="input-field"
          />
          <small class="form-text text-muted">Format: (123) 456-7890</small>
        </div>

        <div class="form-group">
          <label for="address" class="form-label">Street Address</label>
          <input
            type="text"
            id="address"
            v-model="user.profile.street_address"
            placeholder="Enter street address"
            class="input-field"
          />
        </div>

        <div class="form-group">
            <label for="city" class="form-label">City</label>
            <input
              type="text"
              id="city"
              v-model="user.profile.city"
              placeholder="Enter city"
              class="input-field"
            />
        </div>

        <div class="form-group horizontal-group">
          <div class="form-subgroup">
            <label for="zip" class="form-label">Zip Code</label>
            <input
              type="text"
              id="zip"
              v-model="user.profile.zip_code"
              placeholder="Enter zip code (12345)"
              pattern="[0-9]{5}"
              class="input-field"
            />
          </div>
          <div class="form-subgroup">
            <label for="state" class="form-label">State</label>
            <input
              type="text"
              id="state"
              v-model="user.profile.state"
              placeholder="Enter state (CA)"
              maxlength="2"
              style="text-transform: uppercase;"
              class="input-field"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="userType" class="form-label">User Type</label>
          <select id="userType" v-model="user.user_type" class="select-field">
            <option value="1">Regular User</option>
            <option value="2">Admin</option>
          </select>
        </div>

        <div class="form-group checkbox-group">
          <label for="isActive" class="checkbox-label">
            <input
              type="checkbox"
              id="isActive"
              v-model="user.is_active"
              class="checkbox-input"
            />
            Active User
          </label>
        </div>
      </div>

      <div class="button-container">
        <button type="submit" class="btn btn-primary create-button" :disabled="submitting">
          <span v-if="submitting" class="spinner-border spinner-border-sm"></span>
          Save Changes
        </button>
      </div>

      <div v-if="error" class="alert alert-danger mt-3">
        {{ error }}
      </div>
    </form>
    <div class="bottom-button-container">
      <a href="#" class="btn btn-secondary back-button bottom-back-button" @click.prevent="$router.go(-1)">
        <i class="bi bi-arrow-left"></i> Back to Users
      </a>
    </div>
  </div>
</template>

<script>
import APIService from '@/http/APIService';
import { confirmDialog } from '@/utils/confirmDialog';

export default {
  name: 'UserEdit',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      user: {
        id: null,
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        user_type: 1,
        is_active: true,
        profile: {
          phone_number: '',
          street_address: '',
          city: '', // Added city here
          zip_code: '',
          state: ''
        },
      },
      loading: true,
      submitting: false,
      error: null
    }
  },
  async created() {
    await this.fetchUser();
  },
  methods: {
    async fetchUser() {
      this.loading = true;
      try {
        const response = await APIService.getAdminUser(this.id);
        this.user = {
          ...response.data,
          password: '' // Don't pre-fill password
        };
        // Ensure profile is always an object.
        if (!this.user.profile) {
          this.user.profile = {};
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        this.error = error.response?.data?.message || 'Failed to load user data';
      } finally {
        this.loading = false;
      }
    },
    async submitForm() {
      const isConfirmed = await confirmDialog(
        'Confirm Changes',
        'Are you sure you want to update this user?',
        'warning',
      );

      if (!isConfirmed) return;

      this.submitting = true;
      this.error = null;

      try {
        const userData = {
          username: this.user.username,
          email: this.user.email,
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          user_type: this.user.user_type,
          is_active: this.user.is_active,
          profile: {
            phone_number: this.user.profile.phone_number,
            street_address: this.user.profile.street_address,
            city: this.user.profile.city, // Include city in the payload
            zip_code: this.user.profile.zip_code,
            state: this.user.profile.state
          },
        };

        // Only include password if provided
        if (this.user.password) {
          userData.password = this.user.password;
        }

        await APIService.updateAdminUser(this.id, userData);

        this.$router.push({
          name: 'AdminUsers',
          query: { updated: 'true' }
        });
      } catch (error) {
        console.error('Update error:', error);
        this.error = this.formatError(error);
      } finally {
        this.submitting = false;
      }
    },
    formatError(error) {
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          return Object.entries(error.response.data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
        }
        return error.response.data;
      }
      return error.message || 'Failed to update user';
    }
  }
}
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

.intro-section {
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
  gap: 25px;
  flex: 1;
}


.form-group {
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
}

.horizontal-group {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
}

.form-subgroup {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

@media (max-width: 768px) {
  .horizontal-group {
    flex-direction: column;
  }
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

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
  /*justify-content: center;*/
}

.checkbox-input {
  margin-top: 0;
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.checkbox-label {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-left: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
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

  .intro-section {
    flex-direction: column;
    text-align: center;
    display: none;
  }

  .form-card {
    padding: 25px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .button-container {
    flex-direction: column;
    gap: 15px;
  }

  .bottom-back-button {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
