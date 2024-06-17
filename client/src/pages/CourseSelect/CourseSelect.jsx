import React, {useCallback, useEffect, useState} from 'react';
import {getCourse, getCourses} from "../../http/courseAPI";
import styles from './CourseSelect.module.scss';
import {useRecoilState, useResetRecoilState } from "recoil";
import {keyboardState, userState} from "../../store/atoms";
import {login, updateUserCourse} from "../../http/userAPI";
import {useNavigate} from "react-router-dom";
import Container from "../../components/Container/Container";
import ProgressBar from "../../components/ProgressBar/ProgressBar";

const CourseSelect = () => {
    const [courses, setCourses] = useState([])
    const [user, setUser] = useRecoilState(userState);
    const [keyboard, setKeyboard] = useRecoilState(keyboardState);
    const navigate = useNavigate();

    useEffect(() => {
        getCourses(user.id).then(data => setCourses(data))
    }, [])


    const selectedNewCourse = (courseId) => {
        updateUserCourse(user.id, courseId).then(data => {
            console.log(data)
            const course = courses.find(e => e.id === courseId)
            setKeyboard(course.keyboard.keyboard)
            setUser(data)
            navigate(-1, {replace: true})
        })
    }

    return (
        <Container>
            <div className={styles.courseSelect}>
                <h2 className={styles.courseSelect__title}>Виберіть курс для навчання</h2>
                {
                    courses.length
                        ?
                        <div className={styles.courseSelect__wrapper}>
                            {
                                courses.map(course =>
                                    <div className={styles.courseSelect__item} key={course.id}
                                         onClick={() => selectedNewCourse(course.id)}>
                                        <h3 className={styles.courseSelect__itemTitle}>
                                            {course.name}
                                        </h3>
                                        <p>Розкладка: {course.keyboard.layout.name}</p>
                                        <p>Мова: {course.keyboard.language.name}</p>
                                        <p className={styles.progressBar}>
                                            <div className={styles.progressBar__wrapper}>
                                                <ProgressBar from={course.completedLesson} to={course.countLesson} />
                                            </div>
                                            <span className={styles.progressBar__title}>
                                                Урок {course.completedLesson} / {course.countLesson}
                                            </span>
                                        </p>
                                    </div>
                                )
                            }
                        </div>
                        : <div>Курсів немає</div>
                }
            </div>
        </Container>
    )
}

export default CourseSelect;
