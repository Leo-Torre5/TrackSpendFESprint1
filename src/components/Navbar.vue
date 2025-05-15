<script>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "Navbar",
  setup() {
    const store = useStore();
    const router = useRouter();
    const authenticated = computed(() => store.state.authenticated);
    const isAdmin = computed(() => {
      const user =
        store.state.user || JSON.parse(localStorage.getItem("user"));
      return (
        user && (user.is_staff || user.is_superuser || user.user_type === 2)
      );
    });
    const logout = () => {
      localStorage.clear();
      store.commit("SET_AUTHENTICATED", false);
      router.push("/login");
    };

    const isDropdownOpen = ref(false);
    const dashboardTimeout = ref(null);
    const dropdownTimeoutId = ref(null); // To store the timeout ID
    const dropdownRef = ref(null); // Ref for the dropdown menu
    const adminButtonRef = ref(null);
    const dashboardLinkRef = ref(null); // Add ref for the dashboard link

    const toggleDropdown = (event) => {
      if (event.type === 'mouseenter') {
        clearTimeout(dropdownTimeoutId.value); // Clear any existing timeout
        dashboardTimeout.value = setTimeout(() => {
          isDropdownOpen.value = true;
        }, 100); // Short delay, adjust as needed.  Reduced delay.
      } else if (event.type === 'mouseleave') {
        clearTimeout(dashboardTimeout.value);
        dropdownTimeoutId.value = setTimeout(() => { // Store the timeout ID
          isDropdownOpen.value = false;
        }, 100); // Shorter delay
      }
    };

    const navigateToDashboard = () => {
      router.push({ name: 'Dashboard' }); // Corrected route name
      isDropdownOpen.value = false; // Close dropdown after click.  Important!
    };

    const handleDropdownMouseLeave = () => {
      clearTimeout(dashboardTimeout.value); // Clear any pending timeout
      dropdownTimeoutId.value = setTimeout(() => {
        isDropdownOpen.value = false;
      }, 100);
    };

    const handleDropdownMouseEnter = () => {
      clearTimeout(dropdownTimeoutId.value); // Clear the timeout, keep open
    };

    const goToAdmin = () => {
      router.push({ name: 'AdminUsers' });
    };

    // Ensure dropdown closes on route change
    onMounted(() => {
      router.afterEach(() => {
        isDropdownOpen.value = false;
        // Reset Admin link style on route change
        if (adminButtonRef.value) {
          adminButtonRef.value.classList.remove('active');
        }
      });
    });

    return {
      authenticated,
      isAdmin,
      logout,
      router,
      isDropdownOpen,
      toggleDropdown,
      navigateToDashboard,
      dropdownRef,
      handleDropdownMouseLeave,
      handleDropdownMouseEnter,
      adminButtonRef,
      goToAdmin,
      dashboardLinkRef, // Return the ref
    };
  },
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark custom-navbar px-3">
    <router-link to="/home" class="navbar-brand d-flex align-items-center">
      <img
        src="@/assets/images/TrackSpendMainLogo.png"
        alt="TrackSpend Logo"
        class="nav-logo me-2"
      />
    </router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav align-items-lg-center me-auto">
        <li class="nav-item">
          <router-link
            to="/Home"
            class="nav-link"
            :class="{ active: $route.path === '/Home' }"
          >
            Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/about"
            class="nav-link"
            :class="{ active: $route.path === '/about' }"
          >
            About
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/contact"
            class="nav-link"
            :class="{ active: $route.path === '/contact' }"
          >
            Contact
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/privacy"
            class="nav-link"
            :class="{ active: $route.path === '/privacy' }"
          >
            Privacy
          </router-link>
        </li>
        <li class="nav-item" v-if="authenticated">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            @click.prevent="navigateToDashboard"
            @mouseenter="toggleDropdown"
            id="dashboardDropdown"
            role="button"
            aria-expanded="[object Object]"
            ref="dashboardLinkRef" 
          >
            Dashboard
          </a>
          <ul
            ref="dropdownRef"
            class="dropdown-menu"
            :class="{ show: isDropdownOpen }"
            aria-labelledby="dashboardDropdown"
            @mouseenter="handleDropdownMouseEnter"
            @mouseleave="handleDropdownMouseLeave"
            :style="{
              left: dashboardLinkRef ? `${dashboardLinkRef.offsetLeft}px` : '0',
            }"
          >
            <li>
              <router-link
                to="/expenses"
                :to="{ name: 'expenses' }"
                class="dropdown-item"
                :class="{ active: $route.path === '/expenses' }"
                @click="isDropdownOpen = false"
              >
                Expenses
              </router-link>
            </li>
            <li>
              <router-link
                to="/budgets"
                :to="{ name: 'budgets' }"
                class="dropdown-item"
                :class="{ active: $route.path.startsWith('/budgets') }"
                @click="isDropdownOpen = false"
              >
                Budgets
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
      <ul class="navbar-nav ms-auto align-items-lg-center">
        <li class="nav-item" v-if="authenticated && isAdmin">
          <button class="btn btn-logout me-2" @click="goToAdmin" ref="adminButtonRef">Staff Dashboard</button>
        </li>
        <li class="nav-item" v-if="authenticated">
          <button class="btn btn-logout" @click="logout">Logout</button>
        </li>
        <li v-if="!authenticated">
          <router-link to="/register" class="btn btn-register me-2 orange-button">
            Sign up
          </router-link>
        </li>
        <li v-if="!authenticated">
          <router-link to="/login" class="btn btn-login">Login</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

.custom-navbar {
  margin: 0 !important;
  padding: 1rem 2rem !important;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  padding: 0 !important;
}

.nav-logo {
  height: 48px;
  width: auto;
  transition: transform 0.3s ease;
}

.nav-logo:hover {
  transform: scale(1.05);
}

.nav-link {
  font-weight: 600;
  font-size: 1.3rem;
  padding: 0.2rem 2rem;
  margin: 0 0.25rem;
  color: #2c463f;
  position: relative;
  transition: all 0.5s ease;
}

.nav-link:hover {
  color: #c76d32;
}

.custom-navbar .navbar-nav .nav-item .nav-link.active {
  color: #2c463f;
  font-weight: 600;
}

.nav-link.active:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0.5rem;
  right: 0.5rem;
  height: 3px;
  background-color: #c76d32;
  border-radius: 3px;
}

.btn {
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-hover-color);
  color: white;
}

.btn:hover {
  background-color: #f8f9fa;
  color: var(--primary-hover-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-hover-color);
}

.btn-logout {
  background-color: #c76d32;
}

.btn-logout:hover {
  background-color: white;
  /* border-color: black; */
  transform: translateY(-1px);
  color: var(--primary-hover-color);
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .auth-buttons {
    margin: 1rem 0 0 0;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .nav-logo {
    height: 35px;
  }

  .auth-buttons {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
  }
}

.dropdown-menu {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  top: 100%;
  left: 0;
  right: auto;
  transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
  opacity: 0;
  visibility: hidden;
  display: block;
  pointer-events: none;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translate3d(0px, 2px, 0px) !important;
  pointer-events: auto;
}


.dropdown-item {
  font-size: 1rem;
  color: #34495e;
  padding: 0.75rem 1.5rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.dropdown-item:hover,
.dropdown-item.active {
  background-color: #c76d32;
  color: white;
}

.dropdown-item.active {
  font-weight: 600;
}

.navbar-nav > li {
  margin-right: 0;
}

.navbar-nav > li:last-child {
  margin-right: 0;
}

.dropdown-toggle::after {
  display: inline-block;
  margin-left: 0.255em;
  vertical-align: 0.125em;
  content: "";
  border-top: 0.3em solid #2c463f;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}

.dropdown-toggle:empty::after {
  margin-left: 0;
}

.dropdown-toggle {
  cursor: pointer;
}

.dropdown-menu-end {
  right: 0 !important;
  left: auto !important;
}
.orange-button {
  background-color: #c76d32;
  color: white;
}

.orange-button:hover {
  background-color: #f8f9fa;
  color: #c76d32;
  border-color: #c76d32;
}
</style>
