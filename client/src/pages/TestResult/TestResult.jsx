import React from 'react';
import starIcon from "../../assets/icons/star-ms.svg";
import lightningIcon from "../../assets/icons/lightning-ms.svg";
import targetIcon from "../../assets/icons/target-ms.svg";
import styles from "./TestResult.module.scss";
import Button from "../../components/UI/Button/Button";
import {useNavigate} from "react-router-dom";


const TestResult = ({speed, target, setCompleted, userExercise}) => {
    const navigate = useNavigate()

    return (
        <div className={styles.result}>
            <img className={styles.result__image} src={starIcon} alt='star' />
            <span className={styles.result__title}>Гарна робота!</span>
            <div className={styles.stats}>
                <div className={styles.stats__speed}>
                    <div className={styles.stats__speedTitle}>
                        <img className={styles.stats__image} src={lightningIcon} alt='lightningIcon' />
                        <span>Швидкість</span>
                    </div>
                    <div className={styles.stats__body}>
                        <span className={styles.stats__value}>{speed}</span>
                        <span>зн./хв</span>
                    </div>
                </div>
                <div className={styles.stats__target}>
                    <div className={styles.stats__targetTitle}>
                        <img className={styles.stats__image} src={targetIcon} alt='targetIcon' />
                        <span>Точність</span>
                    </div>
                    <div className={styles.stats__body}>
                        <span className={styles.stats__value}>{target}</span>
                        <span>%</span>
                    </div>
                </div>
            </div>
            <div className={styles.buttons}>
                <button className={styles.buttons__item}
                        onClick={() => setCompleted(false)}>
                    Спробуй ще
                </button>
                {
                    userExercise && <button className={styles.buttons__item} onClick={() => navigate('/user')}>
                        Повернутися до завдань
                    </button>
                }
            </div>
        </div>
    );
};

export default TestResult;
