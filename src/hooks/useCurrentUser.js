import {useEffect, useState} from "react";
import User from "../services/user";

export default function useCurrentUser() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        try {
            const user = User.loadFromLocalstorage();
            setUser(user);

        } catch (e) {
            setError(e);
        }
    }, []);

    useEffect(() => {
        if (user && user.isAuthorized)
            user.dumpToLocalStorage();
    }, [user])
    return [user, setUser, error];
}