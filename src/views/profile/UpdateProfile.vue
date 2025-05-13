<template>
  <div class="update-profile-container">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Edit Profile</h5>
        <form @submit.prevent="updateProfile" enctype="multipart/form-data">
          <div class="mb-3">
            <label for="firstName" class="form-label">First Name</label>
            <input
              v-model="form.first_name"
              type="text"
              id="firstName"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label for="lastName" class="form-label">Last Name</label>
            <input
              v-model="form.last_name"
              type="text"
              id="lastName"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label for="phoneNumber" class="form-label">Phone Number</label>
            <input
              v-model="form.phone_number"
              type="text"
              id="phoneNumber"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="streetAddress" class="form-label">Street Address</label>
            <input
              v-model="form.street_address"
              type="text"
              id="streetAddress"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="zipCode" class="form-label">Zip Code</label>
            <input
              v-model="form.zip_code"
              type="text"
              id="zipCode"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="state" class="form-label">State</label>
            <input
              v-model="form.state"
              type="text"
              id="state"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="profilePicture" class="form-label"
              >Profile Picture</label
            >
            <input
              @change="handleFileUpload"
              type="file"
              id="profilePicture"
              class="form-control"
            />
          </div>          <div class="text-end">
            <button type="button" class="btn btn-secondary me-2" @click="router.push('/dashboard')">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted } from "vue";
  import { APIService } from "@/http/APIService";
  import Swal from 'sweetalert2';
  import { useRouter } from 'vue-router';

  const apiService = new APIService();

  export default {
    name: "UpdateProfile",
    setup() {
      const router = useRouter();
      const form = ref({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        street_address: "",
        zip_code: "",
        state: "",
      });
      const profilePicture = ref(null);
      const loading = ref(false);
      const error = ref("");

      const fetchProfile = async () => {
        try {
          const response = await apiService.getProfile();
          form.value = {
            ...response.data,
            ...response.data.profile,
          };
        } catch (err) {
          error.value = "Failed to load profile.";
          console.error(err);
        } finally {
          loading.value = false;
        }
      };

      const handleFileUpload = (event) => {
        profilePicture.value = event.target.files[0];
      };

      const updateProfile = async () => {
        try {
          loading.value = true;
          const formData = new FormData();
          formData.append("first_name", form.value.first_name);
          formData.append("last_name", form.value.last_name);
          formData.append("email", form.value.email);
          formData.append("phone_number", form.value.phone_number);
          formData.append("street_address", form.value.street_address);
          formData.append("zip_code", form.value.zip_code);
          formData.append("state", form.value.state);
          if (profilePicture.value) {
            formData.append("profile_picture", profilePicture.value);
          }

          await apiService.editProfile(formData);
          await Swal.fire({
            title: 'Success!',
            text: 'Your profile has been updated successfully',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#6b8068',

          });
          router.push('/dashboard');
        } catch (err) {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to update profile',
            icon: 'error',
            confirmButtonText: 'OK'            
          });
          console.error(err);
        } finally {
          loading.value = false;
        }
      };

      onMounted(fetchProfile);      return {
        form,
        profilePicture,
        loading,
        error,
        updateProfile,
        handleFileUpload,
        router,
      };
    },
  };
</script>

<style scoped>
  .update-profile-container {
    max-width: 600px;
    margin: 2rem auto;
  }
</style>
