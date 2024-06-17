import React, {memo, useEffect, useRef, useState} from 'react';
import Container from "../Container/Container";
import styles from "./ResultExercise.module.scss";
import starGrey from "../../assets/icons/star-grey.svg";
import targetGrey from "../../assets/icons/target-grey.svg";
import lightningGrey from "../../assets/icons/lightning-grey.svg";
import star from "../../assets/icons/star-ms.svg";
import target from "../../assets/icons/target-ms.svg";
import lightning from "../../assets/icons/lightning-ms.svg";
import {NavLink} from "react-router-dom";

const CheckMark = ({color}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block" width="30" height="30" viewBox="0 0 31 30"
             fill="none">
            <circle cx="15.5" cy="15" r="12" fill={color} id="circle"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M22.585 10.9643C23.157 11.5635 23.135 12.513 22.5357 13.085L14.1667 21.0737L8.46429 15.6305C7.86504 15.0585 7.84296 14.109 8.41497 13.5097C8.98698 12.9105 9.93647 12.8884 10.5357 13.4604L14.1667 16.9263L20.4643 10.915C21.0635 10.343 22.013 10.365 22.585 10.9643Z"
                  fill="white"/>
        </svg>
    )
}

const getErrorWord = (count) => {
    if (count === 1) {
        return 'помилка';
    } else if (count >= 2 && count <= 4) {
        return 'помилки';
    } else {
        return 'помилок';
    }
};

const getTitle = (isLastExercise, isLastLesson, pass) => {
    if (!pass) {
        return ['Забагато помилок, спробуй ще раз', 'Далі']
    }
    if (isLastExercise && isLastLesson) {
        return ['Курс завершено!', 'Пройти тест']
    } else if (isLastExercise) {
        return ['Урок завершено!', 'Наступий урок']
    } else {
        return ['Вправу завершено!', 'Далі']
    }
}

const ResultExercise = memo(({result, setCompleted, nextExercise, task}) => {
    const [pass, setPass] = useState(true)
    const buttonRef = useRef(null);
    const [title, textButton] = getTitle(task.isLastExercise, task.isLastLesson, pass)


    const checkResult = [
        {src: starGrey, alt: 'star', color: '#ddd', text: `менше ${task.errorLimit+1} помилок`},
        {src: targetGrey, alt: 'target', color: '#ddd', text: 'вправа без помилок'},
        {src: lightningGrey, alt: 'lightning', color: '#ddd', text: `швидкість більшу за ${task.speedLimit} зн./хв`},
    ]

    if (result.error <= task.errorLimit) {
        checkResult[0].src = star
        checkResult[0].color = '#00cc00'
    }
    if (result.error === 0) {
        checkResult[1].src = target
        checkResult[1].color = '#ff9900'
    }
    if (result.speed >= task.speedLimit) {
        checkResult[2].src = lightning
        checkResult[2].color = '#8400ff'
    }

    let redirectToTest = false
    if (task.isLastExercise && task.isLastLesson) {
        redirectToTest = true
    }

    useEffect(() => {
        if (result.error > task.errorLimit) {
            setPass(false)
        }
        buttonRef.current.focus();
    }, []);

    return (
        <Container>
            <div className={styles.result}>
                <h3 className={styles.result__title}>
                    {title}
                </h3>
                <p className={styles.result__description}>{result.speed} зн./хв., {result.error} {getErrorWord(result.error)}</p>
                <div className={styles.result__icons}>
                    {
                        checkResult.map(e =>
                            <div key={e.alt} className={styles.result__iconsItem}>
                                <img className={styles.result__icon} src={e.src} alt={e.alt}/>
                                <CheckMark color={e.color}/>
                                <p style={{color: e.color}}>{e.text}</p>
                            </div>
                        )
                    }
                </div>
                <div className={styles.result__buttons}>
                    <button className={`${styles.result__button} ${styles.result__oneMore}`}
                            onMouseMove={() => buttonRef?.current.blur()} onClick={() => setCompleted(false)}>Ще раз
                    </button>
                    {
                        pass &&
                        (
                            !redirectToTest ? <button className={`${styles.result__button} ${styles.result__next}`}
                                                     ref={buttonRef}
                                                     onClick={() => nextExercise()}
                                >{textButton}</button>
                                :
                                <NavLink className='logo' to='/test'>
                                    <button className={`${styles.result__button} ${styles.result__next}`}
                                            ref={buttonRef}
                                    >
                                        {textButton}
                                    </button>
                                </NavLink>
                        )
                    }
                </div>
            </div>
        </Container>
    )
})

export default ResultExercise;
