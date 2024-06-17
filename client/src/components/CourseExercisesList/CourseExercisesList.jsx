import React, {useEffect, useRef, useState} from 'react';
import {useRecoilValue} from "recoil";
import {userState} from "../../store/atoms";
import {getCourseDetail} from "../../http/courseAPI";
import styles from "./CourseExercisesList.module.scss";
import starGrey from "../../assets/icons/star-grey.svg";
import targetGrey from "../../assets/icons/target-grey.svg";
import lightningGrey from "../../assets/icons/lightning-grey.svg";
import star from "../../assets/icons/star-ms.svg";
import target from "../../assets/icons/target-ms.svg";
import lightning from "../../assets/icons/lightning-ms.svg";
import lock from "../../assets/icons/lock.svg";
import {useNavigate} from "react-router-dom";


const CourseExercisesList = ({exercise, setExercise}) => {
    const user = useRecoilValue(userState);
    const [showCourseDetails, setShowCourseDetails] = useState(false)
    const [courseDetails, setCourseDetails] = useState(null)
    const navigate = useNavigate()
    const targetRef = useRef(null);


    useEffect(() => {
        getCourseDetail(user.id, user.courseId).then(data => {
            setCourseDetails(data)
        })
    }, [exercise])

    useEffect(() => {
        handleScroll()
    }, [showCourseDetails])

    const handleScroll = () => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    if (!courseDetails) {
        return (
            <div>loading...</div>
        )
    }

    return (
        <div className={`${styles.courseDetails} ${showCourseDetails && styles.courseDetails_active}`}>
            <div className={`${styles.courseDetails__button} ${showCourseDetails && styles.courseDetails__button_active}`}
                    onClick={() => setShowCourseDetails(!showCourseDetails)}>
                {courseDetails.course.name}
            </div>
            { showCourseDetails &&
                <div className={styles.courseDetails__body}>
                    {
                        courseDetails.lessons.map(lesson =>
                            <div key={lesson.id}>
                                <h5 className={styles.courseDetails__bodyLesson} ref={exercise.id === lesson.exercises[0]?.id ? targetRef : null}>
                                    Урок {lesson.orderId} "{lesson.name}"
                                </h5>
                                <div className={styles.courseDetails__bodyExercises}>
                                    {
                                        lesson.exercises.map(ex =>
                                            ex.lock ?
                                                <div className={styles.courseDetails__bodyExerciseWrapper}
                                                     onClick={() => setExercise(ex)} key={ex.id}>
                                                    <div className={styles.courseDetails__bodyExercise} style={{borderColor: `${exercise.id === ex.id ? '#ff9f63' : '#dee0ff'}`}}>
                                                        <img src={ex.star ? star : starGrey} alt='star'/>
                                                        <img src={ex.target ? target : targetGrey} alt='target'/>
                                                        <img src={ex.lightning ? lightning : lightningGrey} alt='lightning'/>
                                                    </div>
                                                    <div>{ex.orderId}</div>
                                                </div>
                                                : <div className={styles.courseDetails__bodyExerciseWrapper}>
                                                    <div className={styles.courseDetails__bodyExercise} style={{borderColor: `${exercise.id === ex.id ? 'red' : '#dcdcdc'}`}}>
                                                        <img src={lock} alt='lock'/>
                                                    </div>
                                                </div>

                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                    <button className={styles.courseDetails__buttonChange} onClick={() => navigate('/course-select')}>
                        Змінити курс
                    </button>
                </div>
            }
        </div>
    )
}

export default CourseExercisesList;
