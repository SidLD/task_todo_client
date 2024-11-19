import {createBrowserRouter, createRoutesFromElements, Navigate, Route} from "react-router-dom"
import { Home } from "@/pages/home"
import { PrivateLayout, PublicLayout } from "./module"
import { Login } from "@/pages/login"
import AboutUs from "@/pages/about-us"
import { AdminDashboard } from "@/pages/admin/dashboard"
import { ContributorDashboard } from "@/pages/donor/dashboard"
import { UserManagement } from "@/pages/admin/user-management"
import AdminDataEntry from "@/pages/admin/data-entry"
import ContributorDataEntry from "@/pages/donor/data-entry"
import AdminSetting from "@/pages/admin/setting"
import ContributorSetting from "@/pages/donor/setting"
import RegisterLayout from "@/layouts/RegisterLayout"
import { SignUpSelection } from "@/pages/sign-up-selection"
import { AdminSignUp } from "@/pages/admin/sign-up"
import { DonorSignUp } from "@/pages/donor/sign-up"
import { GuestDonor } from "@/pages/guest-donor"
const routers = createBrowserRouter(
    createRoutesFromElements(
        <>
         <Route path="/register" element={<RegisterLayout/>}>
                <Route index element={ <SignUpSelection />} />
                <Route  path="admin" element={<AdminSignUp />} />
                <Route  path="donor" element={<DonorSignUp />} />
                <Route  path="guest-donor" element={<GuestDonor />} />
            </Route> 
            <Route element={<PublicLayout/>}>
                <Route index path="/" element={<Home />} />
                <Route  path="/login" element={<Login />} />
                <Route  path="/about" element={<AboutUs />} />
                <Route  path="*" element={<Navigate to="/" replace />} />
            </Route>   
            <Route element={<PrivateLayout/>} >
               <Route path="/admin">
                    <Route  index  element={<AdminDashboard />}/>
                    <Route  path="user-management"  element={<UserManagement />}/>
                    <Route  path="data-entry"  element={<AdminDataEntry />}/>
                    <Route  path="setting"  element={<AdminSetting />}/>
               </Route>
               <Route path="/contributor">
                    <Route  index  element ={ <ContributorDashboard /> }/>
                    <Route  path="data-entry"  element={<ContributorDataEntry />}/>
                    <Route  path="setting"  element={<ContributorSetting />}/>
               </Route>
            </Route> 

        </>
    )
)
export default routers