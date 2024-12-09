import {createBrowserRouter, createRoutesFromElements, Navigate, Route} from "react-router-dom"
import Dashboard from "@/pages/dashboard"
import Auth from "@/pages/login"
import ManagePage from "@/pages/adminDashboard"
import TodoPage from "@/pages/todoPage"
import { auth } from "@/lib/services"

const routers = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route index path="/" element={<Auth />} />
            {auth.getToken() && <Route path="/user" element={<Dashboard/>}/>}
            {auth.getToken() && <Route path="/tasks/:id" element={<TodoPage/>}/>}
            <Route path="/admin" element={<ManagePage/>}/>
            <Route  path="*" element={<Navigate to="/" replace />} />
        </>
    )
)
export default routers