import { RouterProvider } from "react-router-dom"
import routers from "./modules/router"
import { ToastProvider } from "@radix-ui/react-toast"
import { Toaster } from "./components/ui/toaster"


function App() {
  return (
        <RouterProvider
          router={routers}
      />
  )
}

export default App
