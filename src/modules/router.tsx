import {createBrowserRouter, createRoutesFromElements, Navigate, Route} from "react-router-dom"
import { Home } from "@/pages/home"
import { PrivateLayout, PublicLayout } from "./module"
import AboutUs from "@/pages/about-us"
import { AdminDashboard } from "@/pages/admin/dashboard"
import { ContributorDashboard } from "@/pages/donor/dashboard"
import RegisterLayout from "@/layouts/RegisterLayout"
import { SignUpSelection } from "@/pages/sign-up-selection"
import { AdminSignUp } from "@/pages/admin/sign-up"
import { DonorSignUp } from "@/pages/donor/sign-up"
import { GuestDonor } from "@/pages/guest-donor"
import { SignInSelection } from "@/pages/sign-in-selection"
import { AdminSignIn } from "@/pages/admin/sign-in"
import { DonorSignIn } from "@/pages/donor/sign-in"
import { AdminDonorList } from "@/pages/admin/donor-list"
import { AdminBloodSupply } from "@/pages/admin/blood-supply"
import { AdminCalendar } from "@/pages/admin/calendar"
const routers = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/register" element={<RegisterLayout/>}>
                <Route index element={ <SignUpSelection />} />
                <Route  path="admin" element={<AdminSignUp />} />
                <Route  path="donor" element={<DonorSignUp />} />
                <Route  path="guest-donor" element={<GuestDonor />} />
            </Route> 
            <Route path="/login" element={<RegisterLayout/>}>
                <Route index element={ <SignInSelection />} />
                <Route  path="admin" element={<AdminSignIn />} />
                <Route  path="donor" element={<DonorSignIn />} />
            </Route> 
            <Route element={<PublicLayout/>}>
                <Route index path="/" element={<Home />} />
                <Route  path="/about-us" element={<AboutUs />} />
                <Route  path="*" element={<Navigate to="/" replace />} />
            </Route>   
            <Route path="/admin" element={<PrivateLayout/>}>
                <Route  index  element={<AdminDashboard />}/>
                <Route  path="calendar"  element={<AdminCalendar />}/>
                <Route  path="donor-list"  element={<AdminDonorList />}/>
                <Route  path="blood-supply"  element={<AdminBloodSupply />}/>
            </Route>
            <Route path="/donor" element={<PrivateLayout/>}>
                <Route  index  element ={ <ContributorDashboard /> }/>
            </Route>
        </>
    )
)
export default routers