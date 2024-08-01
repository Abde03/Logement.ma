import React from 'react'
import { Link , useLocation } from 'react-router-dom'

export default function AccountNav() {
    const {pathname} = useLocation();
    let subpage = pathname.split('/')[2];
    if ( subpage === undefined) {
        subpage = 'profile'
    }

    function linkClasses (type = null) {
        let classes = 'py-2 px-4 rounded-full'
        if (subpage === type) {
            classes += ' bg-primary text-white'
        }
        return classes;
    }
  return (
    <nav className='w-full flex mt-12 justify-center gap-4'>
        <Link className={linkClasses('profile')} to={'/profile'}>Mon profile</Link>
        <Link className={linkClasses('bookings')} to={'/profile/bookings'}>Mes réservations</Link>
        <Link className={linkClasses('places')} to={'/profile/places'}>Mes lieux</Link>
    </nav>
  )
}
