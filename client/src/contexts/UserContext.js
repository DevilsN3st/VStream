import React, { useContext } from "react"
import { useAsync } from "../hooks/useAsync"
import { getCookie, getCookie1, getCookie2 } from "../services/posts"

const Context = React.createContext()

export function useUser() {
    return useContext(Context)
    }

export function UserProvider({ children }) {
    const { value : data } = useAsync(getCookie)
    const user = data?.user;
    console.log("/",data)

    return (
        <Context.Provider value={{ user }}>
            {children}
        </Context.Provider>
    )
}