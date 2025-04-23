// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/components/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/components/About.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/components/Contact.vue')
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/components/Privacy.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/components/Auth.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/components/Register.vue')
  },
  // Expenses
  {
    path: '/expenses',
    name: 'ExpensesList',
    component: () => import('@/components/ExpensesList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses/:id',
    name: 'ExpenseUpdate',
    component: () => import('@/components/ExpenseCreateUpdate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses/create',
    name: 'ExpenseCreate',
    component: () => import('@/components/ExpenseCreateUpdate.vue'),
    meta: { requiresAuth: true }
  },
  // Budgets
  {
    path: '/budgets',
    name: 'BudgetsList',
    component: () => import('@/components/BudgetsList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/budgets/:id',
    name: 'BudgetUpdate',
    component: () => import('@/components/BudgetCreateUpdate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/budgets/create',
    name: 'BudgetCreate',
    component: () => import('@/components/BudgetCreateUpdate.vue'),
    meta: { requiresAuth: true }
  },
  // Users
  {
    path: '/users',
    name: 'UserList',
    component: () => import('@/components/UserList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users/create',
    name: 'UserCreate',
    component: () => import('@/components/admin/UserCreate.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/users/edit/:id',
    name: 'UserEdit',
    component: () => import('@/components/admin/UserEdit.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    props: true
  },
  // Admin Dashboard - Nested Routes
  {
    path: '/admin',
    component: () => import('@/components/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'Admin',
        redirect: { name: 'AdminUsers' }
      },
      // Users
      {
        path: 'users',
        children: [
          {
            path: '',
            name: 'AdminUsers',
            component: () => import('@/components/admin/AdminUserList.vue')
          },
          {
            path: 'create',
            name: 'AdminUserCreate',
            component: () => import('@/components/admin/UserCreate.vue')
          },
          {
            path: 'edit/:id',
            name: 'AdminUserEdit',
            component: () => import('@/components/admin/UserEdit.vue'),
            props: true
          }
        ]
      },
      // Categories
      {
        path: 'categories',
        children: [
          {
            path: '',
            name: 'AdminCategories',
            component: () => import('@/components/admin/AdminCategoryList.vue')
          },
          {
            path: 'create',
            name: 'CategoryCreate',
            component: () => import('@/components/admin/CategoryCreate.vue')
          },
          {
            path: 'edit/:id',
            name: 'CategoryEdit',
            component: () => import('@/components/admin/CategoryEdit.vue'),
            props: true
          }
        ]
      },
      // Budgets
      {
        path: 'budgets',
        children: [
          {
            path: '',
            name: 'AdminBudgets',
            component: () => import('@/components/admin/AdminBudgetList.vue')
          },
          {
            path: 'create',
            name: 'BudgetCreate',
            component: () => import('@/components/admin/BudgetCreate.vue')
          },
          {
            path: 'edit/:id',
            name: 'BudgetEdit',
            component: () => import('@/components/admin/BudgetEdit.vue'),
            props: true
          }
        ]
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Enhanced navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('access_token');
  const user = JSON.parse(localStorage.getItem('user')); // Assuming you store user data
  
  
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Redirect to auth page if not authenticated
      next({ name: 'Auth' });
      return;
    }
    
    // Check if route requires admin privileges
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (!user || user.user_type !== 2) { // Assuming user_type 2 is admin
        // Redirect to home or show unauthorized page
        next({ name: 'Home' });
        return;
      }
    }
  }
  
  // Proceed to the route
  next();
});

export default router;
