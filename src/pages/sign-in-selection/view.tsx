import { User } from 'lucide-react'
import logo from '../../assets/logo.png'

const SignInSelectionView: React.FC = () => {
    return (
        <div className="w-full h-full bg-[#3D0000] rounded-3xl p-2 shadow-2xl flex-col items-center ">
            <div className="z-20 flex items-center text-white/90">
                <img width={60} src={logo} alt="logo" />
            </div>
            <div className="items-center justify-center min-h-[25rem] p-6 ">
                <h1 className="mb-8 text-2xl font-bold text-center text-white">
                LOGIN AS 
                </h1>
        
                <div className="flex flex-col items-center justify-center grid-cols-1 gap-8 ">
                <a 
                    href="/register/admin"
                    className="flex items-center w-[50%] gap-3 px-6 py-4 transition-colors bg-white rounded-lg hover:bg-white/90 group"
                >
                    <User className="w-6 h-6 text-[#3D0000]" />
                    <span className="text-[#3D0000] text-xl font-bold">ADMIN</span>
                </a>
        
                <a 
                    href="/register/donor"
                    className="flex items-center w-[50%] gap-3 px-6 py-4 transition-colors bg-white rounded-lg hover:bg-white/90 group"
                >
                    <User className="w-6 h-6 text-[#3D0000]" />
                    <span className="text-[#3D0000] text-xl font-bold">DONOR</span>
                </a>
                </div>
            </div>
        </div>
  )
}

export default SignInSelectionView
