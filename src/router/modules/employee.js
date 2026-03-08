import layout from '@/layout'
export default {
  path: '/employee',
  name: 'employee',
  component: layout,
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  },
  {
    path: 'detail/:id?',
    name: 'detail',
    component: () => import('@/views/employee/detail'),
    meta: {
      title: '员工详情'
    },
    hidden: true // 在侧边栏隐藏路由
  }

  ]
}
