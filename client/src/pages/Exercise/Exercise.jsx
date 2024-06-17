import React, {useCallback, useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue} from "recoil";
import {keyboardState, userState} from "../../store/atoms";
import Container from "../../components/Container/Container";
import styles from './Exercise.module.scss'
import {getCourse, getCourseDetail, getCourses, getLastExercise, getNextExercise} from "../../http/courseAPI";
import ResultExercise from "../../components/ResultExercise/ResultExercise";
import TextBox from "../../components/TextBox/TextBox";
import {addProgressExercise} from "../../http/userAPI";
import CourseSelect from "../CourseSelect/CourseSelect";
import {NavLink, useNavigate} from "react-router-dom";
import CourseExercisesList from "../../components/CourseExercisesList/CourseExercisesList";


const Exercise = () => {
    const user = useRecoilValue(userState);
    const [keyboard, setKeyboard] = useRecoilState(keyboardState);
    const [exercise, setExercise] = useState(null);
    const [completed, setCompleted] = useState(false)
    const [result, setResult] = useState({
        speed: 0,
        error: 0,
    })
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();



    useEffect(() => {
        if (!user.courseId) {
            navigate('/course-select');
        }

        getLastExercise(user.id).then(data => {
            if (data) {
                setExercise(data)
            }
        }).then(e => setLoading(false))
    }, [user])

    const userAddProgress = useCallback((speed, error) => {
        setResult({speed, error})
        if (error <= exercise.errorLimit) {
            addProgressExercise(user.id, user.courseId, exercise.lessonId, exercise.id, true, error === 0, speed >= exercise.speedLimit)
                .then(data => console.log(data))
        }
    }, [exercise])

    const nextExercise = useCallback(() => {
        getNextExercise(exercise.id).then(data => {
            setExercise(data)
            setCompleted(false)
        })
    }, [exercise])

    if (loading) {
        return <Container>loading</Container>
    }

    if (!exercise) {
        return <Container>
            <div>
                В цьому курсі відсутні уроки. Будь ласка, <NavLink to={'/course-select'}>виберіть інший курс</NavLink>.
            </div>
        </Container>
    }

    return (
        <Container>
            {
                completed
                    ? <ResultExercise result={result} setCompleted={setCompleted} nextExercise={nextExercise}
                                      task={exercise}/>
                    :
                    <div className={styles.exercise}>
                        <CourseExercisesList exercise={exercise} setExercise={setExercise}/>
                        <TextBox text={exercise.string} userAddProgress={userAddProgress} completed={completed}
                                 setCompleted={setCompleted} keyboard={true}/>
                    </div>
            }
        </Container>
    );
};

export default Exercise;
