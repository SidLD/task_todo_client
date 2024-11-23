import { auth } from "./services"
export const dataHeader = () => {
    return { headers: { "x-access-token": auth.getToken() } }
}