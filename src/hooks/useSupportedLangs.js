import {useEffect, useState} from "react";
import BulbService from "../services/bulbService";

const useSupportedLangs = () => {
    const [langs, setLangs] = useState([]);
    useEffect(() => {
        const service = new BulbService("http://localhost:8000");
        service
            .getSupportedLanguages()
            .then(setLangs);
    }, []);

    return langs;
}

export default useSupportedLangs;