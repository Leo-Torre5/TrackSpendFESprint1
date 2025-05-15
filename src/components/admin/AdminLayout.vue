<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <nav class="menu">
        <router-link to="/admin/users" :class="{ active: $route.path.startsWith('/admin/users') }" class="menu-item">
          <i class="bi bi-people"></i> Users
        </router-link>
        <router-link to="/admin/categories" :class="{ active: $route.path.startsWith('/admin/categories') }" class="menu-item">
          <i class="bi bi-tags"></i> Expense Categories
        </router-link>
        <router-link to="/admin/budgets" :class="{ active: $route.path.startsWith('/admin/budgets') }" class="menu-item">
          <i class="bi bi-wallet"></i> User Budgets
        </router-link>
      </nav>
    </aside>
    <main class="admin-content">
       <div class="page-content">
        <router-view></router-view>
      </div>
      <footer class="content-footer">
        <p>&copy; 2025 TrackSpend Admin. All rights reserved.</p>
      </footer>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminLayout'
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

/* Sidebar Styles */
.admin-sidebar {
  width: 280px;
  background: #2c463f;
  color: white;
  transition: width 0.3s ease;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.admin-sidebar .logo {
  padding: 20px;
  text-align: center;
}
.sidebar-logo{
  height: 50px;
  width: auto;
}

.admin-sidebar .menu {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.admin-sidebar .menu-item {
  color: white;
  text-decoration: none;
  padding: 15px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  font-size: 1.1rem;
}

.admin-sidebar .menu-item:hover {
  background: black;
  transform: translateX(4px);
}

.admin-sidebar .menu-item.active {
  background: #c76d32;
  color: white;
  font-weight: 600;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.admin-sidebar .menu-item i {
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
}

/* Content Styles */
.admin-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  /* background-color: #f0f4f8; */
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.content-header .page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.header-actions{
  display: flex;
  align-items: center;
  gap: 15px;
}

.content-footer {
  text-align: center;
  padding-top: 15px;
  margin-top: 20px;
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* Breadcrumb Styles */
.breadcrumb {
  background-color: transparent;
  padding: 0;
  margin: 0;
  font-size: 1rem;
}

.breadcrumb-item a {
  color: #3498db;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: #217dbb;
}

.breadcrumb-item.active {
  color: #555;
}

/* User Dropdown Styles */
.user-dropdown {
  position: relative;
  display: inline-block;
}

.user-button {
  background-color: transparent;
  color: #555;
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.user-button:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}
.user-name{
  font-weight: 500;
}

.user-button i {
  font-size: 1.2rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: none; /* Initially hidden */
  min-width: 180px;
}

.user-dropdown:hover .dropdown-menu {
  display: block; /* Show on hover */
}

.dropdown-menu a {
  padding: 10px 15px;
  display: block;
  text-decoration: none;
  color: #333;
  transition: background-color 0.3s ease;
  font-size: 1rem;
}

.dropdown-menu a:hover {
  background-color: #f0f0f0;
}
.page-content{
  padding: 25px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  margin-top: 10px;
  min-height: 500px;
}

/* Responsive Media Queries */
@media (max-width: 1200px) {
  .admin-sidebar {
    width: 260px;
  }

  .admin-content {
    padding: 15px;
  }

  .content-header .page-title {
    font-size: 1.8rem;
  }
  .nav-link{
    font-size: 1.1rem;
  }
}

@media (max-width: 992px) {
  .admin-sidebar {
    width: 240px;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .header-actions{
    gap: 10px;
  }

  .content-header .page-title {
    font-size: 1.6rem;
  }
  .user-button{
    font-size: 0.9rem;
    padding: 8px 12px;
  }
  .nav-link{
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    height: auto;
    overflow-y: auto;
    transition: transform 0.3s ease;
    transform: translateX(-100%);
  }
  .admin-sidebar.show{
    transform: translateX(0);
  }

  .admin-content {
    padding-left: 20px;
    padding-top: 70px;
  }

  .content-header .page-title {
    font-size: 1.4rem;
  }
  .user-button{
    font-size: 0.8rem;
    padding: 6px 10px;
  }
  .nav-link{
    font-size: 0.9rem;
  }
  .header-actions{
    flex-direction: column;
    align-items: flex-start;
  }
  .breadcrumb{
    font-size: 0.85rem;
  }
}
</style>
