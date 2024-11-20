import { User } from 'lucide-react'
import logo from '../../assets/logo.png'

const SignUpSelectionView: React.FC = () => {
    return (
        <div className="relative w-full h-full bg-[#3D0000] rounded-3xl md:p-12 shadow-2xl flex-col items-center ">
            <div className="relative z-20 flex items-center text-white/90">
                <img width={60} src={logo} alt="logo" />
            </div>
            <div className="items-center justify-center min-h-[30rem] p-6 ">
                <h1 className="mb-8 text-2xl font-bold text-center text-white">
                REGISTER TODAY
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
        
                <div className="mt-8 text-center">
                <a 
                    href="/register/guest-donor" 
                    className="text-sm transition-colors text-white/80 hover:text-white"
                >
                    Not a certified donor? Tap here.
                </a>
                </div>
            </div>
        </div>
  )
}

export default SignUpSelectionView
