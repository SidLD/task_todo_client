import {createBrowserRouter, createRoutesFromElements, Navigate, Route} from "react-router-dom"
import Dashboard from "@/pages/dashboard"
import Auth from "@/pages/login"
import ManagePage from "@/pages/adminDashboard"

const routers = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route index path="/" element={<Auth />} />
            <Route path="/user" element={<Dashboard/>}/>
            <Route path="/admin" element={<ManagePage/>}/>
            <Route  path="*" element={<Navigate to="/" replace />} />
        </>
    )
)
export default routers