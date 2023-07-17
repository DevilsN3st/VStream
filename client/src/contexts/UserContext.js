import React, { useContext, useEffect, useState } from "react"
import { useAsync } from "../hooks/useAsync"
import { getCookie, getCookie1, getCookie2 } from "../services/posts"
import { useUser as useUser1 } from "../hooks/useUser"

const Context = React.createContext()

export function useUser() {
    return useContext(Context)
    }

export function UserProvider({ children }) {
    const { value : data, error : error1, loading : loading1 } = useAsync(getCookie)
    let user11 = useUser1();
    const [user , setUser] = useState(user11 ? (user11?.id) : (data?.user));
    const [error, setError] = useState( user11 ? undefined : error1);
    const [loading, setLoading] = useState(user11 ? false : loading1);
    console.log("/",user)

    useEffect(() => {
        const user1 = user11?.id;
        setUser(user1);
        console.log("user11",user11)
        console.log("user11.user",user11?.user)
        console.log("user11.id",user11?.id)
        console.log("user11.user.id",user11?.user?.id)
    }, [user11?.id])
    console.log("user11 from context", user11?.id);

    return (
        <Context.Provider value={{ user, setUser, error, setError, loading, setLoading }}>
            {children}
        </Context.Provider>
    )
}