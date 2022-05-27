import useAuthorizationCode from "../hooks/useAuthorizationCode";
import useBulbService from "../hooks/useBulbService";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import useUser from "../hooks/useUser";
import User from "../services/user";

export default function Authorize() {
    const code = useAuthorizationCode();
    const service = useBulbService();
    const navigate = useNavigate();
    const [, setUser, ] = useUser();
    const [accessToken, setAccessToken] = useState(null);
    useEffect(() => {
        if (code !== null) {
            service.getToken(code).then(setAccessToken);
        }
        if (accessToken !== null) {
            const user = User.fromJWT(accessToken)
            console.log(user);
            setUser(user);
            if (user.isAuthorized)
                navigate('/');
        }
    }, [accessToken, code, navigate, service, setUser]);
}