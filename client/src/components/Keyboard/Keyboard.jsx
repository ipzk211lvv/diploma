import React, {memo, useEffect} from "react";
import styles from "./Keyboard.module.scss";
import Hands from "../../assets/images/hands.svg";
import {useRecoilState} from "recoil";
import {keyboardState, userState} from "../../store/atoms";
import {getCourse} from "../../http/courseAPI";

const Keyboard = memo(({press, cursor}) => {
    const [user, setUser] = useRecoilState(userState);
    const [keyboard, setKeyboard] = useRecoilState(keyboardState);

    let showButtons = [press]
    let shift = false

    useEffect(() => {
        if (!keyboard) {
            getCourse(user.courseId).then(data => {
                setKeyboard(data.keyboard.keyboard)
                console.log(data)
            })
        }
    })

    if (press === ' ') {
        showButtons.push('⠀')
    } else if (press?.toUpperCase() === press) {
        showButtons.push('Shift')
        showButtons.push(press.toLowerCase())
        shift = true
    }

    return (
        <div className={styles.keyboard}>
            {
                keyboard?.map((line, i) =>
                    <div key={i} className={styles.keyboard__line}>
                        {line.map((e, j) =>
                            <div key={`${i}-${j}`}
                                className={showButtons.includes(e.value) ? styles.keyboard__key_active : styles.keyboard__key}
                                style={{flex: e.width, fontSize: e.value.length > 1 ? 12 : 16, backgroundColor: e.color}}>
                                {shift ? e.shiftValue : e.value}
                            </div>
                        )}
                    </div>
                )
            }
            {
                cursor === 0 && <img className={styles.keyboard__hands} src={Hands} alt=""/>
            }
        </div>
    )
})

export default Keyboard;
