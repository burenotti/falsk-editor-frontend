import {useEffect, useState} from "react";
import useBulbService from "./useBulbService";

const useSupportedLangs = () => {
    const [langs, setLangs] = useState({});
    const service = useBulbService();
    useEffect(() => {
        if (service !== null)
            service
                .getSupportedLanguages()
                .then((result) => {
                    let langs = {};
                    for (let i = 0; i < result.length; ++i) {
                        const {language, versions} = result[i];
                        langs[language] = versions;
                    }
                    setLangs(langs);
                });
    }, [service]);

    return langs;
}

export default useSupportedLangs;