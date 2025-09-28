import { CiUser, CiMail } from "react-icons/ci"
import { Link } from "react-router-dom"

export default function Footer() {

    return (
        <footer className="border-spacing-4 border-t-2 border-gray-200 dark:border-gray-700 mt-16 pt-4">
            {/* Desktop Footer */}
            <div className="hidden md:flex justify-between">
                <div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">Logement.ma</h3>
                    <p className="text-gray-800 dark:text-gray-300">Find your ideal accommodation</p>
                    <p className="text-gray-800 dark:text-gray-300">Abde@2025</p>
                </div>
                <div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">Contact</h3>
                    <p className="text-gray-800 dark:text-gray-300"><a href="mailto:azzaoui03dev@gmail.com" className="hover:text-red-500 transition-colors duration-200">Azzaoui03dev@gmail.com</a></p>
                    <p className="text-gray-800 dark:text-gray-300"><a href="https://github.com/Abde03" className="hover:text-red-500 transition-colors duration-200">Github</a></p>
                </div>         
            </div>
            {/* Mobile Footer */}
            <div className="md:hidden flex justify-between">
                <div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">Logement.ma</h3>
                    <p className="text-gray-800 dark:text-gray-300">Abde@2024</p>
                </div>
                <div className="flex flex-col items-center">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">Contact</h3>
                    <div className="flex gap-2">
                    <Link to="mailto:azzaoui03dev@gmail.com">
                        <CiMail className="text-gray-800 w-6 h-6" />
                    </Link>
                    <Link to="https://github.com/Abde03">
                        <CiUser className="text-gray-800 w-6 h-6"/>
                    </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}