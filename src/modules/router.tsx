import {createBrowserRouter, createRoutesFromElements, Navigate, Route} from "react-router-dom"
import Dashboard from "@/pages/dashboard"
import Home from "@/pages/login"

const routers = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route index path="/" element={<Home />} />
            <Route path="/user" element={<Dashboard/>}/>
            <Route  path="*" element={<Navigate to="/" replace />} />
        </>
    )
)
export default routers