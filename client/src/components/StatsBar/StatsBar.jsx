import React, {memo, useEffect, useRef, useState} from 'react';

const StatsBar = memo(({cursor, setCursor, text, userAddProgress, setCompleted}) => {
    const [speed, setSpeed] = useState(0);
    const [error, setError] = useState(0);
    const [startTime, setStartTime] = useState(null)
    const cursorRef = useRef(cursor)

    const speedCalculate = () => {
        const difference = (Date.now() - startTime) / 1000
        return Math.round(cursorRef.current / difference * 60)
    }

    const clear = () => {
        setStartTime(null)
        setCursor(0)
        setSpeed(0)
        setError(0)
    }

    useEffect(() => {
        clear()
    }, [text])

    useEffect(() => {
        document.addEventListener('keypress', handleKeyPress)
        return () => document.removeEventListener('keypress', handleKeyPress);
    }, [cursor, error, speed, text]);

    useEffect(() => {
        let intervalId;
        if (startTime !== null) {
            intervalId = setInterval(() => {
                setSpeed(speedCalculate())
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [startTime]);
    const handleKeyPress = (event) => {
        event.preventDefault();
        if (event.key === text[cursor]) {
            if (!startTime) {
                setStartTime(Date.now())
            }
            setCursor(cursor + 1)
            cursorRef.current = cursor + 1

            if (cursor >= text.length - 1) {
                const currentSpeed = speedCalculate()
                setStartTime(null)
                setCompleted(true)
                setSpeed(currentSpeed)
                userAddProgress(currentSpeed, error)
            }
            return
        }

        if (cursor > 0) {
            setError(error + 1)
        }
    }


    return (
        <div style={{display: 'flex', justifyContent: 'end', fontSize: 20, gap: 40, marginBottom: 20}}>
            <span>{error} помилок</span>
            <span>{speed} зн./хв.</span>
            <span style={{cursor: 'pointer'}} onClick={() => clear()}>⟲</span>
        </div>
    )
})

export default StatsBar;
