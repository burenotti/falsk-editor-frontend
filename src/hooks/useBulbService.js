import {useEffect, useState} from "react";
import BulbService from "../services/bulbService";

export default function useBulbService(url) {
    const [service, setService] = useState(new BulbService());
    useEffect(() => {
        setService(new BulbService(url));
    }, [url])
    return service;
}