import {useEffect, useState} from "react";
import useBulbService from "./useBulbService";

const useSupportedLangs = () => {
    const [langs, setLangs] = useState([]);
    const service = useBulbService();
    useEffect(() => {
        if (service !== null)
            service
                .getSupportedLanguages()
                .then(setLangs);
    }, [service]);

    return langs;
}

export default useSupportedLangs;