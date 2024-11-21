import React from 'react';
import { Outlet } from 'react-router-dom';
interface RegisterPageProps {
  backgroundImageUrl?: string;
}
import background from '../assets/background2.png'
import { Toaster } from '@/components/ui/toaster';


const RegisterLayout: React.FC<RegisterPageProps> = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-black to-transparent bg-[#4b0c0c] p-4 sm:p-8 md:p-16 relative overflow-hidden">
      
      <Toaster />
      {background && (
        <img 
          src={background} 
          alt="background"
          className="absolute inset-0 z-0 object-cover w-full h-full"
        />
      )}
      <div className="z-10 flex flex-col w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-xl md:flex-row bg-opacity-90">
        <Outlet /> 
      </div>
    </div>
  );
};

export default RegisterLayout;

