import { lazy } from 'react'
import type { RouteProps } from 'react-router-dom'


const Demos = lazy(()=> import('@/app/(home)/page'))

const Demo1 = lazy(() => import('@/app/(demos)/layout-1/page'))
const Demo2 = lazy(() => import('@/app/(demos)/layout-2/page'))
const Demo3 = lazy(() => import('@/app/(demos)/layout-3/page'))
const Demo4 = lazy(() => import('@/app/(demos)/layout-4/page'))
const Demo5 = lazy(() => import('@/app/(demos)/layout-5/page'))
const Demo6 = lazy(() => import('@/app/(demos)/layout-6/page'))
const Demo7 = lazy(() => import('@/app/(demos)/layout-7/page'))

export type RoutesProps = {
  path: RouteProps['path']
  name: string
  element: RouteProps['element']
  exact?: boolean
}

const demoPages: RoutesProps[] = [
  {
    path: '/',
    name: 'root',
    element: <Demos />,
  },
  {
    path: '/layout-1',
    name: 'root',
    element: <Demo1 />,
  },
  {
    path: '/layout-2',
    name: 'Index 2',
    element: <Demo2 />,
  },
  {
    path: '/layout-3',
    name: 'Index 3',
    element: <Demo3 />,
  },
  {
    path: '/layout-4',
    name: 'Index 4',
    element: <Demo4 />,
  },
  {
    path: '/layout-5',
    name: 'Index 5',
    element: <Demo5 />,
  },
  {
    path: '/layout-6',
    name: 'Index 6',
    element: <Demo6 />,
  },
  {
    path: '/layout-7',
    name: 'Index 7',
    element: <Demo7 />,
  },


]

export const appRoutes = [...demoPages]
