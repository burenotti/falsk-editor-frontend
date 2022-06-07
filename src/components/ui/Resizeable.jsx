import {useState} from "react";
import styles from './Resizeable.module.css'

export default function Resizeable({minWidth = 0, initialWidth = 0, children}) {
    const [width, setWidth] = useState(initialWidth);

    const handler = (mouseDownEvent) => {
        const startWidth = width;
        const startPosition = mouseDownEvent.pageX;

        function onMouseMove(mouseMoveEvent) {
            setWidth(() => startWidth - startPosition + mouseMoveEvent.pageX);
        }

        function onMouseUp() {
            document.body.removeEventListener("mousemove", onMouseMove);
        }

        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp, {once: true});
    };

    return (
        <div className="flex">
            <div style={{width: width, flexGrow: 1}} className={(width < minWidth) ? 'hidden' : ''}>
                {children}
            </div>
            <div className={styles.resizer} onMouseDown={handler}></div>
        </div>
    )
}