// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

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
    component: () => import('@/components/UserCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users/edit/:id',
    name: 'UserEdit',
    component: () => import('@/components/UserCreate.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Authentication guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('access_token');
  
  // Only protect routes that explicitly require auth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Auth' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
