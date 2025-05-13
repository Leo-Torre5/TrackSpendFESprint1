<script>
  import { computed } from "vue";
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
        router.push("/");
      };
      return { authenticated, isAdmin, logout };
    },
  };
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark custom-navbar px-3">
    <router-link to="/" class="navbar-brand d-flex align-items-center">
      <img
        src="@/assets/images/TrackSpendMainLogo.png"
        alt="TrackSpend Logo"
        class="nav-logo me-2"
      />
    </router-link>
    <ul class="navbar-nav align-items-lg-center flex-row ms-2 me-auto">
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
    </ul>
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
      <ul class="navbar-nav ms-auto align-items-lg-center">
        <li class="nav-item" v-if="authenticated">
          <router-link
            to="/dashboard"
            class="nav-link"
            :class="{ active: $route.path === '/dashboard' }"
          >
            Dashboard
          </router-link>
        </li>
        <li class="nav-item" v-if="authenticated">
          <router-link
            to="/expenses"
            class="nav-link"
            :class="{ active: $route.path === '/expenses' }"
          >
            Expenses
          </router-link>
        </li>
        <li class="nav-item" v-if="authenticated">
          <router-link
            to="/budgets"
            class="nav-link"
            :class="{ active: $route.path.startsWith('/budgets') }"
          >
            Budgets
          </router-link>
        </li>
        <li class="nav-item" v-if="authenticated && isAdmin">
          <router-link :to="{ name: 'AdminUsers' }" class="nav-link">
            Admin
          </router-link>
        </li>
      </ul>
      <div class="d-flex ms-lg-3 mt-3 mt-lg-0 gap-2">
        <router-link
          v-if="!authenticated"
          to="/register"
          class="btn btn-register"
          >Sign up</router-link
        >
        <router-link v-if="!authenticated" to="/login" class="btn btn-login"
          >Login</router-link
        >
        <button v-if="authenticated" class="btn btn-logout" @click="logout">
          Logout
        </button>
      </div>
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
    background: var(--primary-color);
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
    color: rgba(255, 255, 255, 0.9);
    position: relative;
    transition: all 0.5s ease;
  }

  .nav-link:hover {
    color: white;
  }

  .nav-link.active {
    color: white;
    font-weight: 600;
  }

  .nav-link.active:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 1rem;
    right: 1rem;
    height: 2px;
    background-color: white;
    border-radius: 2px;
  }

  .auth-buttons {
    display: flex;
    gap: 0.75rem;
    margin-left: 1rem;
  }

  .btn {
    padding: 0.5rem 1.25rem;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* border: 2px solid white; */
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
    /* border-color: white; */
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
</style>
