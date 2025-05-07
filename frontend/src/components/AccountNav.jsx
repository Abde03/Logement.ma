import { Link , useLocation } from 'react-router-dom'
import { useContext } from 'react';
import { UserContext } from '../context/user-context'

export default function AccountNav() {
    const {pathname} = useLocation();
    let subpage = pathname.split('/')[2];
    if ( subpage === undefined) {
        subpage = 'profile'
    }
    const {user} = useContext(UserContext)

    function linkClasses (type = null , disabled = false) {
        let classes = 'py-2 px-4 rounded-full'
        if (subpage === type) {
            classes += ' bg-primary text-white'
        }
        if (disabled) {
            classes += 'disabled-link opacity-50 cursor-not-allowed'
        }
        return classes;
    }

    const isVerified = user?.isAccountVerified


  return (
    <nav className='w-full flex mt-8 justify-center text-center gap-4'>
        <Link className={linkClasses('profile')} to={'/profile'}>My profile</Link>
        {
            isVerified ? (
                <>
                    <Link className={linkClasses('bookings')} to={'/profile/bookings'}>My reservations</Link>
                    <Link className={linkClasses('places')} to={'/profile/places'}>My places</Link>
                </>
            ) : (
                <>
                    <Link className={linkClasses('bookings',true)} to={'/profile'}>My reservations</Link>
                    <Link className={linkClasses('places',true)} to={'/profile'}>My places</Link>
                </>
            )
        }
    </nav>
  )
}
