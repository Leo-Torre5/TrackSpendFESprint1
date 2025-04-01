<template>
  <div id="app" class="app-container d-flex flex-column min-vh-100">
    <!-- Navbar - simplified structure -->
    <nav class="navbar navbar-expand-lg navbar-dark custom-navbar px-3">
      <router-link to="/" class="navbar-brand">
        <img 
          src="@/assets/images/TrackSpendMainLogo.png" 
          alt="TrackSpend Logo"
          class="nav-logo"
        >
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
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link" :class="{ active: $route.path === '/about' }">
              About
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact" class="nav-link" :class="{ active: $route.path === '/contact' }">
              Contact
            </router-link>
          </li>
          
          <li class="nav-item" v-if="authenticated">
            <router-link to="/expenses" class="nav-link" :class="{ active: $route.path === '/expenses' }">
              <i class="bi bi-cash-stack me-1"></i> Expenses
            </router-link>
          </li>
          <li class="nav-item" v-if="authenticated">
            <router-link to="/budgets" class="nav-link" :class="{ active: $route.path.startsWith('/budgets') }">
              <i class="bi bi-wallet2 me-1"></i> Budgets
            </router-link>
          </li>
        </ul>
        
        <div class="auth-buttons">
          <template v-if="!authenticated">
            <router-link to="/register" class="btn btn-register">
              Register
            </router-link>
            <router-link to="/auth" class="btn btn-login">
              Login
            </router-link>
          </template>
          
          <a v-if="authenticated" href="#" class="btn btn-logout" @click.prevent="logout">
            <i class="bi bi-box-arrow-left me-1"></i> Logout
          </a>
        </div>
      </div>
    </nav>
    
    <!-- Main Content - simplified -->
    <router-view class="main-content" />
    
    <!-- Footer -->
    <footer class="global-footer">
      <div class="container">
        <div class="footer-content">
          <p class="mb-0">&copy; 2025 TrackSpend. All rights reserved.</p>
          <div class="footer-links">
            <router-link to="/about" class="footer-link">About</router-link>
            <router-link to="/contact" class="footer-link">Contact</router-link>
            <router-link to="/privacy" class="footer-link">Privacy Policy</router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter();

    const authenticated = computed(() => store.state.authenticated);

    const logout = () => {
      localStorage.clear();
      store.commit('SET_AUTHENTICATED', false);
      router.push('/auth');
    };

    return {
      authenticated,
      logout
    };
  }
};
</script>

<style scoped>

html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}


.custom-navbar {
  margin: 0 !important;
  padding: 0.25rem 1rem !important;
  background: #6b8068;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  padding: 0 !important;
}


.main-content {
  flex: 1 0 auto;
  margin: 0;
  padding: 0;
  width: 100%;
}

.global-footer {
  flex-shrink: 0;
  background: #2c463f;
  color: white;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}


.nav-logo {
  height: 80px;
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
  position:relative;
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
  content: '';
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
  border: 2px solid white;
}

.btn-register {
  background-color: #2c463f;
  color: white;
}

.btn-register:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-login {
  background-color: #2c463f;
  color: white;
}

.btn-login:hover {
  background-color: #f8f9fa;
  color: #2c463f; 
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-logout {
  background-color: #2c463f;
  color: white;
  border-color: white;
}

.btn-logout:hover {
  background-color: white;
  border-color: black;
  transform: translateY(-1px);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
}

.footer-link:hover {
  color: white;
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
  
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 0.5rem;
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
