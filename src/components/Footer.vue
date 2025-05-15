<template>
    <footer class="global-footer modern-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-left">
            <router-link to="/home" class="footer-brand">
              <img
                src="@/assets/images/TrackSpendMainLogo2.png"
                alt="TrackSpend Logo"
                class="footer-logo"
              />
            </router-link>
            <p class="footer-description">
              TrackSpend is your modern solution for managing expenses
              efficiently.
            </p>
          </div>
          <div class="footer-center">
            <h3 class="footer-heading">Explore</h3>
            <div class="footer-links">
              <router-link to="/about" class="footer-link">About Us</router-link>
              <router-link to="/contact" class="footer-link">Contact Us</router-link>
              <router-link to="/privacy" class="footer-link">Privacy Policy</router-link>
            </div>
          </div>
          <div class="footer-right">
            <h3 class="footer-heading">Connect</h3>
            <div class="footer-socials">
              <a
                href="#"
                class="footer-social-icon"
                aria-label="Facebook"
                title="Facebook"
              >
                <i class="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                class="footer-social-icon"
                aria-label="Twitter"
                title="Twitter"
              >
                <i class="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                class="footer-social-icon"
                aria-label="Instagram"
                title="Instagram"
              >
                <i class="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-copyright">
            &copy; 2025 TrackSpend. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  import { computed, ref, onMounted } from "vue";
  import { useStore } from "vuex";
  import { useRouter } from "vue-router";
  
  export default {
    name: "FooterSection",
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
        router.push("/Home");
      };
  
      const isDropdownOpen = ref(false);
      const dashboardTimeout = ref(null);
      const dropdownTimeoutId = ref(null);
      const dropdownRef = ref(null);
      const adminButtonRef = ref(null);
      const dashboardLinkRef = ref(null);
  
      const toggleDropdown = (event) => {
        if (event.type === "mouseenter") {
          clearTimeout(dropdownTimeoutId.value);
          dashboardTimeout.value = setTimeout(() => {
            isDropdownOpen.value = true;
          }, 100);
        } else if (event.type === "mouseleave") {
          clearTimeout(dashboardTimeout.value);
          dropdownTimeoutId.value = setTimeout(() => {
            isDropdownOpen.value = false;
          }, 100);
        }
      };
  
      const navigateToDashboard = () => {
        router.push({ name: "Dashboard" });
        isDropdownOpen.value = false;
      };
  
      const handleDropdownMouseLeave = () => {
        clearTimeout(dashboardTimeout.value);
        dropdownTimeoutId.value = setTimeout(() => {
          isDropdownOpen.value = false;
        }, 100);
      };
  
      const handleDropdownMouseEnter = () => {
        clearTimeout(dashboardTimeout.value);
      };
  
      const goToAdmin = () => {
        router.push({ name: "AdminUsers" });
      };
  
      onMounted(() => {
        router.afterEach(() => {
          isDropdownOpen.value = false;
          if (adminButtonRef.value) {
            adminButtonRef.value.classList.remove("active");
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
        dashboardLinkRef,
      };
    },
  };
  </script>
  
  <style scoped>
  .global-footer {
    background-color: #2c463f;
    color: white;
    padding: 2rem 0;
    margin-top: .5rem;
  }
  
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .footer-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .footer-left {
    text-align: left;
    max-width: 300px;
  }
  
  .footer-brand {
    padding: 0 !important;
    margin-bottom: 1.5rem;
    display: inline-flex;
  }
  
  .footer-logo {
    height: 50px;
    width: auto;
    transition: transform 0.2s ease;
  }
  
  .footer-logo:hover {
    transform: scale(1.05);
  }
  
  .footer-description {
    font-size: 0.95rem;
    color: #ddd;
    line-height: 1.5;
  }
  
  .footer-center {
    text-align: left;
  }
  
  .footer-heading {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: white;
  }
  
  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .footer-link {
    color:  white;
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s ease;
  }
  
  .footer-link:hover {
    color: #c76d32;
  }
  
  .footer-right {
    text-align: left;
  }
  
  .footer-socials {
    display: flex;
    gap: 1.25rem;
    margin-top: 0.75rem;
  }
  
  .footer-social-icon {
    color: white;
    font-size: 1.5rem;
    transition: transform 0.2s ease;
  }
  
  .footer-social-icon:hover {
    transform: scale(1.1);
    color: #c76d32;
  }
  
  .footer-bottom {
    text-align: center;
    padding-top: 1rem;
  }
  
  .footer-copyright {
    font-size: 0.8rem;
    color: #bbb;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      text-align: center;
    }
  
    .footer-left,
    .footer-center,
    .footer-right {
      margin-bottom: 2rem;
      text-align: center;
    }
  
    .footer-links {
      flex-direction: column;
      align-items: center;
    }
  
    .footer-socials {
      justify-content: center;
    }
  }
  </style>
  