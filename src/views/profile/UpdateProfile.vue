<template>
  <div class="update-profile-container">
    <div class="card">
      <div class="card-body">
        <h2 class="form-title">Edit Your Profile</h2>
        <p class="form-description">
          Update your profile information below. Fields marked with an asterisk (*)
          are required.
        </p>
        <form
          @submit.prevent="updateProfile"
          enctype="multipart/form-data"
          class="profile-form"
        >
          <div class="mb-4">
            <label class="form-label">Current Profile Image</label>
            <div v-if="form.profile_picture" class="current-image-container">
              <img
                :src="form.profile_picture"
                alt="Current Profile Picture"
                class="profile-image-preview"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="profilePicture" class="form-label"
              >Change Profile Image</label
            >
            <div class="d-flex align-items-center">
              <input
                @change="handleFileUpload"
                type="file"
                id="profilePicture"
                class="form-control file-input"
                accept="image/*"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="firstName" class="form-label">First Name *</label>
            <input
              v-model="form.first_name"
              type="text"
              id="firstName"
              class="form-control"
              placeholder="First Name"
              required
            />
          </div>
          <div class="mb-4">
            <label for="lastName" class="form-label">Last Name *</label>
            <input
              v-model="form.last_name"
              type="text"
              id="lastName"
              class="form-control"
              placeholder="Last Name"
              required
            />
          </div>
          <div class="mb-4">
            <label for="email" class="form-label">Email *</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div class="mb-4">
            <label for="phoneNumber" class="form-label">Phone Number</label>
            <input
              v-model="form.phone_number"
              type="text"
              id="phoneNumber"
              class="form-control"
              placeholder="Phone Number"
            />
          </div>
          <div class="mb-4">
            <label for="streetAddress" class="form-label">Street Address</label>
            <input
              v-model="form.street_address"
              type="text"
              id="streetAddress"
              class="form-control"
              placeholder="Street Address"
            />
          </div>
          <div class="mb-4">
            <label for="city" class="form-label">City</label>
            <input
              v-model="form.city"
              type="text"
              id="city"
              class="form-control"
              placeholder="City"
            />
          </div>
          <div class="mb-4">
            <label for="zipCode" class="form-label">Zip Code</label>
            <input
              v-model="form.zip_code"
              type="text"
              id="zipCode"
              class="form-control"
              placeholder="Zip Code"
            />
          </div>
          <div class="mb-4">
            <label for="state" class="form-label">State</label>
            <input
              v-model="form.state"
              type="text"
              id="state"
              class="form-control"
              placeholder="State"
            />
          </div>
          <div class="form-actions justify-content-center">
            <button
              type="button"
              class="btn cancel-button me-2"
              @click="router.push('/dashboard')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn save-button"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { APIService } from "@/http/APIService";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

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
      profile_picture: null,
      city: "",
    });
    const profilePicture = ref(null);
    const loading = ref(false);
    const error = ref("");

    const fetchProfile = async () => {
      try {
        const response = await apiService.getProfile();
        const profileData = response.data.profile;
        form.value = {
          ...response.data,
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          phone_number: profileData.phone_number || "",
          street_address: profileData.street_address || "",
          zip_code: profileData.zip_code || "",
          state: profileData.state || "",
          profile_picture: profileData.profile_picture || null,
          city: profileData.city || "",
        };
      } catch (err) {
        error.value = "Failed to load profile.";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      profilePicture.value = file;
      form.value.profile_picture = URL.createObjectURL(file);
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
        formData.append("city", form.value.city);
        if (profilePicture.value) {
          formData.append("profile_picture", profilePicture.value);
        }

        await apiService.editProfile(formData);
        await Swal.fire({
          title: "Success!",
          text: "Your profile has been updated successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#6b8068",
        });
        router.push("/Dashboard");
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Failed to update profile",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchProfile);
    return {
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
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
}

.card {
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  background-color: white;
}

.card-body {
  padding: 30px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c463f;
  margin-bottom: 15px;
  text-align: center;
}

.form-description {
  font-size: 18px;
  color: #6b8068;
  margin-bottom: 25px;
  text-align: center;
}

.form-label {
  font-size: 18px;
  color: #34495e;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
}

.form-control {
  font-size: 18px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  padding: 12px;
  width: 100%;
}

.form-control:focus {
  border-color: #c76d32;
  box-shadow: 0 0 0 3px rgba(199, 109, 50, 0.15);
}

.form-select {
  font-size: 18px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  padding: 12px;
  width: 100%;
}

.form-select:focus {
  border-color: #c76d32;
  box-shadow: 0 0 0 3px rgba(199, 109, 50, 0.15);
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.save-button {
  background-color: #2c463f;
  color: white;
  padding: 14px 30px;
  border-radius: 10px;
  font-size: 18px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border: none;
  cursor: pointer;
}

.save-button:hover {
  background-color: #2c3e50;
  transform: translateY(-2px);
}

.cancel-button {
  background-color: #c76d32;
  color: white;
  padding: 14px 30px;
  border-radius: 10px;
  font-size: 18px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border: none;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #b85e23;
  transform: translateY(-2px);
}

.profile-form {
  margin-top: 2rem;
}

.file-input {
  width: auto;
  display: inline-flex;
}

.preview-container {
  margin-left: 15px;
  margin-top: 0;
}

.profile-image-preview {
  max-width: 150px;
  border-radius: 50%;
  border: 2px solid #6b8068;
  margin-top: 10px;
}

.current-image-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
