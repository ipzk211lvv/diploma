import React, {useEffect, useState} from 'react';
import {useRecoilState} from "recoil";
import {userState} from "../../store/atoms";
import {getCourseDetail} from "../../http/courseAPI";
import styles from "./UserStatsLesson.module.scss";
import star from "../../assets/icons/star-ms.svg";
import starGrey from "../../assets/icons/star-grey.svg";
import target from "../../assets/icons/target-ms.svg";
import targetGrey from "../../assets/icons/target-grey.svg";
import lightning from "../../assets/icons/lightning-ms.svg";
import lightningGrey from "../../assets/icons/lightning-grey.svg";
import lock from "../../assets/icons/lock.svg";
import ProgressBar from "../ProgressBar/ProgressBar";
import Button from "../UI/Button/Button";
import {useNavigate} from "react-router-dom";

const UserStatsLesson = () => {
    const [user, setUser] = useRecoilState(userState);
    const [stats, setStats] = useState({})
    const navigate = useNavigate()


    useEffect(() => {
        getCourseDetail(user.id, user.courseId).then(data => {
            data.course.countLesson = data.lessons.length
            data.course.completedLesson = data.lessons.filter(lesson =>
                lesson.exercises.every(exercise => exercise.star)
            ).length;
            setStats(data)
        })
    }, [])

    if (!stats?.lessons) {
        return <div>Результатів немає</div>
    }

    return (
        <div className={styles.lessons}>
            <div className={styles.lessons__wrapper}>
                <img className={styles.lessons__star} src={star} alt='star'/>
                <h2 className={styles.lessons__header}>Результати навчання</h2>
            </div>
            <div className={styles.course}>
                <div className={styles.course__content}>
                    <h3 className={styles.course__name}>{stats.course.name}</h3>
                    <span className={styles.course__progress}>
                        урок {stats.course.completedLesson} / {stats.course.countLesson}
                    </span>
                    <ProgressBar from={stats.course.completedLesson} to={stats.course.countLesson} />
                </div>
                <div className={styles.course__buttons}>
                    <p className={styles.course__select}
                        onClick={() => navigate('/course-select')}>
                        Вибрати інший курс
                    </p>
                    <button className={styles.course__next}
                        onClick={() => navigate('/typing')}>
                        Продовжити
                    </button>
                </div>
            </div>
            {
                stats.lessons.map(lesson =>
                    <div className={styles.lessons__item} key={lesson.id}>
                        <div className={styles.lessons__title}>
                            <div className={styles.lessons__content}>
                                <p className={styles.lessons__order}>Урок {lesson.orderId}</p>
                                <p className={styles.lessons__name}>{lesson.name}</p>
                            </div>
                        </div>
                        <div className={styles.exercises}>
                            {
                                lesson.exercises.map(exercise =>
                                    <div className={styles.exercises__item} key={exercise.id}>
                                        <div className={styles.exercises__body}>
                                            <img src={exercise.star ? star : starGrey} alt='star'/>
                                            <img src={exercise.target ? target : targetGrey} alt='target'/>
                                            <img src={exercise.lightning ? lightning : lightningGrey} alt='lightning'/>
                                        </div>
                                        <div className={styles.exercises__order}>{exercise.orderId}</div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default UserStatsLesson;
