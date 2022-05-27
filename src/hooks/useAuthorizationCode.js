import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";

const useAuthorizationCode = () => {
    const [authCode, setAuthCode] = useState(null);
    const [params,] = useSearchParams();
    useEffect(() => {
        const code = params.get('code');
        setAuthCode(code);
    }, [params])
    return authCode;
}

export default useAuthorizationCode;