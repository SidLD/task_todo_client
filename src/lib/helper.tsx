import { auth } from "./services"
export const dataHeader = () => {
    return { headers: { "x-access-token": auth.getToken() } }
}
export const fetchProvincs = async (code:string) => {
    try {
        const data = await fetch(`https://psgc.gitlab.io/api/provinces/${code}`)
            .then((result) => result.json())
        return (
            {label: data.name, code:data.code}
        ) 
    } catch (error) {
        console.log(error)
    }
}

export const fetchCity = async (code:string) => {
    try {
        const data = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${code}`)
            .then((result) => result.json())
        return (
            {label: data.name, code:data.code}
        ) 
    } catch (error) {
        console.log(error)
    }
}

export const getRoleRoutePath = ():string => {
    const role = auth.getRole()
    switch (role) {
        case "ADMIN":
            return "/admin/"
            break;
        default:
            return "/contributor/"
            break;
    }
}

