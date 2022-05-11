import {useEffect, useRef, useState} from "react";

const useFitContent = () => {
    const [content, setContent] = useState("");
    const ref = useRef(null);
    useEffect(() => {
        ref.current.style.height = `0px`;
        const contentHeight = ref.current.scrollHeight;
        ref.current.style.height = `${contentHeight}px`;
    }, [content]);

    return [content, setContent, ref];
}

export default useFitContent;