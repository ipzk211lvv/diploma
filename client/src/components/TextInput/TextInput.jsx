import styles from "./TextInput.module.scss"
import {memo, useEffect, useRef} from "react";

const TextInput = memo(({text, cursor}) => {
    const containerRef = useRef(null);
    const cursorRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && cursorRef.current) {
            const container = containerRef.current;
            const cursor = cursorRef.current;

            const cursorPosition = cursor.offsetTop;
            const containerHeight = container.clientHeight;
            const scrollPosition = cursorPosition - containerHeight / 2;

            container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        }
    }, [text, cursor]);

    return (
        <div className={styles.inputContainer} ref={containerRef}>
            <p className={styles.inputContainer__wrapper}>
                <span className={styles.inputField}>{text.slice(0, cursor)}</span>
                <span className={styles.colorSeparator} ref={cursorRef}>{text.slice(cursor, text.length)}</span>
            </p>
        </div>
    );
})

export default TextInput
