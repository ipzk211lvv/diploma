import React, {memo, useState} from "react";
import StatsBar from "../StatsBar/StatsBar";
import TextInput from "../TextInput/TextInput";
import Keyboard from "../Keyboard/Keyboard";
import styles from './TextBox.module.scss'

const TextBox = memo(({text, userAddProgress, completed, setCompleted, keyboard}) => {
    const [cursor, setCursor] = useState(0);

    return (
        <div className={styles.textBox}>
            <StatsBar cursor={cursor} setCursor={setCursor} text={text} userAddProgress={userAddProgress}
                      completed={completed} setCompleted={setCompleted}/>
            <TextInput text={text} cursor={cursor}/>
            {keyboard && <Keyboard press={text[cursor]} cursor={cursor}/>}
        </div>
    )
})

export default TextBox;
