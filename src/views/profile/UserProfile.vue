<template>
  <div class="user-profile-container">
    <div class="card">
      <div class="card-body">
        <div class="profile-header">
          <img
            :src="profile.profile_picture"
            alt="Profile Picture"
            class="profile-picture"
          />
          <div class="name-section">
            <h5 class="profile-name">
              {{ profile.first_name }} {{ profile.last_name }}
            </h5>
          </div>
        </div>
        <div class="details-section">
          <ul class="list-group list-group-flush">
            <li class="list-group-item contact-phone">
              <strong>Phone:</strong>
              <span class="detail-value">
                {{ formattedPhoneNumber }}
              </span>
            </li>
            <li class="list-group-item contact-email">
              <strong>Email:</strong>
              <span class="detail-value">
                {{ profile.email }}
              </span>
            </li>
            <li class="list-group-item combined-address">
              <strong>Location:</strong>
              <span class="detail-value">
                {{ profile.street_address }}, {{ profile.city }},
                {{ profile.state }} {{ profile.zip_code }}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="card-footer text-center">
        <router-link to="/profile/update" class="btn edit-button">
          Edit Profile
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { APIService } from "@/http/APIService";
const apiService = new APIService();

export default {
  name: "UserProfile",
  setup() {
    const profile = ref({});
    const loading = ref(true);
    const error = ref("");

    const fetchProfile = async () => {
      try {
        const response = await apiService.getProfile();
        profile.value = {
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

    onMounted(fetchProfile);

    const formattedPhoneNumber = computed(() => {
      if (profile.value.phone_number) {
        const cleaned = profile.value.phone_number.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return profile.value.phone_number; // Return original if format is invalid
      }
      return "";
    });

    return {
      profile,
      loading,
      error,
      formattedPhoneNumber,
    };
  },
};
</script>

<style scoped>
.user-profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 5vh;
  padding: 20px;
}

.card {
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  background-color: white;
}

.card-body {
  padding: 20px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #6b8068;
  margin-bottom: 20px;
}

.profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
  border: 4px solid #2c463f;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.profile-picture:hover {
  transform: scale(1.05);
}

.name-section {
  text-align: center;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  color: #2c463f;
  margin-bottom: 5px;
  letter-spacing: -0.02em;
}

.profile-email {
  font-size: 16px;
  color: #6b8068;
  opacity: 0.9;
}

.details-section {
  padding: 20px;
}

.list-group-item {
  padding: 8px 0;
  font-size: 16px;
  color: #34495e;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-group-item:last-child {
  border-bottom: none;
}

.list-group-item strong {
  color: #2c463f;
  margin-right: 10px;
  font-weight: 600;
}

.detail-value {
  color: #4a5568;
  font-weight: 500;
}

.card-footer {
  background-color: transparent;
  padding: 20px;
  text-align: center;
  border-top: none;
}

.edit-button {
  background-color: #c76d32;
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #2c463f;
  transform: translateY(-2px);
}

/* Added for combined address */
.combined-address {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.combined-address .detail-value {
  display: inline-block;
  white-space: nowrap;
}
.contact-phone {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.contact-phone .detail-value {
  display: inline-block;
  white-space: nowrap;
}
.contact-email{
    display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.contact-email .detail-value {
  display: inline-block;
  white-space: nowrap;
}
</style>
