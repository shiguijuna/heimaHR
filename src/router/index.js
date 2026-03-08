import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import approvalRouter from './modules/approval'
import attendanceRouter from './modules/attendance'
import departmentRouter from './modules/department'
import employeeRouter from './modules/employee'
import permissionRouter from './modules/permission'
import roleRouter from './modules/role'
import salaryRouter from './modules/salary'
import socialRouter from './modules/social'

// 1.静态路由
export const constantRoutes = [
  {
    path: '/login', // 登录
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404', // 404
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/', // 首页
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

// 2.动态路由
export const asyncRoutes = [
  // 组织
  departmentRouter,
  // 角色
  roleRouter,
  // 员工
  employeeRouter,
  // 权限
  permissionRouter,
  // 考勤
  attendanceRouter,
  // 审批
  approvalRouter,
  // 工资
  salaryRouter,
  // 社保
  socialRouter
]
// 3.创建路由对象
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 重置路由对象
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
