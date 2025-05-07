import { CiUser, CiMail } from "react-icons/ci"
import { Link } from "react-router-dom"

export default function Footer() {

    return (
        <footer className="border-spacing-4 border-t-2 mt-16 pt-4">
            {/* Desktop Footer */}
            <div className="hidden md:flex justify-between">
                <div>
                    <h3 className="font-bold text-xl">Logement.ma</h3>
                    <p className="text-gray-800">Find your ideal accommodation</p>
                    <p className="text-gray-800">Abde@2025</p>
                </div>
                <div>
                    <h3 className="font-bold text-xl">Contact</h3>
                    <p className="text-gray-800"><a href="mailto:azzaoui03dev@gmail.com">Azzaoui03dev@gmail.com</a></p>
                    <p className="text-gray-800"><a href="https://github.com/Abde03">Github</a></p>
                </div>         
            </div>
            {/* Mobile Footer */}
            <div className="md:hidden flex justify-between">
                <div>
                    <h3 className="font-bold text-xl">Logement.ma</h3>
                    <p className="text-gray-800">Abde@2024</p>
                </div>
                <div className="flex flex-col items-center">
                    <h3 className="font-bold text-xl">Contact</h3>
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