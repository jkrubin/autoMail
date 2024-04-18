import { useToast } from "../Context/toast";
import { AuthContextType, useAuth } from "./Auth";

export const API_URL = process.env.NODE_ENV === 'production' ? "undefined" : "localhost:8080"
export const API_ENDPOINT = `http://${API_URL}/v1`

export const useApi = () => {
    let auth: AuthContextType | null = null
    let toast:any = null
    try{
        auth = useAuth()
    }catch(err){
        console.log('auth not set')
    }
    try{
        toast = useToast().toast
    }catch(err){
        console.log('toast not set')
    }
    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'x-access-token': `${auth?.token}`
    })

    async function fetchAPI<T> (endpoint: string, options: RequestInit = {}):Promise<T>{
        try{
            const res = await fetch(`${API_ENDPOINT}/${endpoint}`, {
                ...options,
                headers: {
                    ...options.headers,
                    ...getHeaders()
                }
            })
            const data = await res.json() as T
            if (!res.ok) {
                if(res.status === 440){
                    auth?.logout()
                }
                throw new Error(`Server Responded with status ${res.status}`);
            }
            return data
        }catch(err){
            console.log(err)
            toast && toast.error(`Error: ${err instanceof Error ? err.message : "Unknown error"}`)
            throw err
        }
    }

    return {fetchAPI}
}