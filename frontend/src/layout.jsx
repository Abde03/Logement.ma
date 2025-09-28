
import Header from './components/header'
import { Outlet, } from 'react-router-dom'
import Footer from './components/footer'

export default function Layout() {
  return (
    <div className='bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200'>
      <div className='p-4 px-8 flex flex-col min-h-screen max-w-4xl mx-auto'>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}
