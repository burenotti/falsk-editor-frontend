import useBulbService from "./useBulbService";
import {useEffect, useState} from "react";
import useCurrentUser from "./useCurrentUser";

export default function useSnippet(username, snippetName) {
    const service = useBulbService();
    const [user] = useCurrentUser();
    const [snippet, setSnippet] = useState(null);
    useEffect(() => {
        if (!(service && username && snippetName && user)) {
            return
        }
        console.log(service, username, snippetName);

        service.getSnippet(username, snippetName, user.accessToken).then(setSnippet);
    }, [service, username, snippetName, user]);

    return snippet;
}