
import Header from './components/header'
import { Outlet, } from 'react-router-dom'
import { SearchProvider } from './context/search-context'
import Footer from './components/footer'


export default function Layout() {
  return (
    <SearchProvider>
      <div className='p-4 px-8 flex flex-col min-h-screen max-w-4xl mx-auto'>
          <Header />
          <Outlet />
          <Footer />
      </div>
    </SearchProvider>
  )
}
