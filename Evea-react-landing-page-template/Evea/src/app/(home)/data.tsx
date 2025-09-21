import demo1 from '@/assets/images/demo/bg-1.png'
import demo2 from '@/assets/images/demo/bg-2.png'
import demo3 from '@/assets/images/demo/bg-3.png'
import demo4 from '@/assets/images/demo/bg-4.png'
import demo5 from '@/assets/images/demo/bg-5.png'
import demo6 from '@/assets/images/demo/bg-6.png'
import demo7 from '@/assets/images/demo/bg-7.png'


type PricingType = {
  name: string
  image: string
  path: string
}

export const pricingData: PricingType[] = [
  {
    name: 'Layout 1',
    image: demo1,
    path: '/layout-1',
  },
  {
    name: 'Layout 2',
    image: demo2,
    path: '/layout-2',
  },
  {
    name: 'Layout 3',
    image: demo3,
    path: '/layout-3',
  },
  {
    name: 'Layout 4',
    image: demo4,
    path: '/layout-4',
  },
  {
    name: 'Layout 5',
    image: demo5,
    path: '/layout-5',
  },
  {
    name: 'Layout 6',
    image: demo6,
    path: '/layout-6',
  }, 
  {
    name: 'Layout 7',
    image: demo7,
    path: '/layout-7',
  },
]
