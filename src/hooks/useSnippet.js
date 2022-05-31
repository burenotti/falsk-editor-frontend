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

        service.getSnippet(username, snippetName, user.accessToken).then(setSnippet);
    }, [service, username, snippetName, user]);


    useEffect(() => {
        if (service && username && snippet && user) {
            service.patchSnippet(username, snippet.name, snippet, user.accessToken);
        }

    }, [service, snippet, user, username])

    const updateSnippet = (patch) => {
        setSnippet({...snippet, ...patch});
    }

    return [snippet, updateSnippet];
}