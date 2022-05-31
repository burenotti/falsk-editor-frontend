import useAuthorizationCode from "../hooks/useAuthorizationCode";
import useBulbService from "../hooks/useBulbService";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";
import User from "../services/user";

export default function Authorize() {
    const code = useAuthorizationCode();
    const service = useBulbService();
    const navigate = useNavigate();
    const [, setUser,] = useCurrentUser();
    useEffect(() => {
        if (!(code)) return;

        service.getToken(code).then((token) => {
            setUser(User.fromJWT(token));
            setTimeout(() =>
                navigate('/'), 1000);
        })
    }, [code,/*accessToken, code, navigate, service, setUser*/]);
}