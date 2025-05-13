<template>
    <div class="user-profile-container">
        <div class="card">
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <img :src="profile.profile_picture" alt="Profile Picture" class="profile-picture me-3" />
                    <div>
                        <h5 class="card-title mb-0">{{ profile.first_name }} {{ profile.last_name }}</h5>
                        <p class="text-muted mb-0">{{ profile.email }}</p>
                    </div>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <strong>Phone:</strong> {{ profile.phone_number }}
                    </li>
                    <li class="list-group-item">
                        <strong>Address:</strong> {{ profile.street_address }}
                    </li>
                    <li class="list-group-item">
                        <strong>State:</strong> {{ profile.state }}
                    </li>
                </ul>
            </div>
            <div class="card-footer text-end">
                <router-link to="/profile/update" class="btn btn-primary">Edit Profile</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from "vue";
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
                    ...response.data.profile
                };
            } catch (err) {
                error.value = "Failed to load profile.";
                console.error(err);
            } finally {
                loading.value = false;
            }
        };

        onMounted(fetchProfile);

        return {
            profile,
            loading,
            error,
        };
    },
};
</script>

<style scoped>
.profile-picture {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
}
</style>