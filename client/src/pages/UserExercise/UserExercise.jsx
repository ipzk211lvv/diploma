import React, {useCallback, useEffect, useState} from 'react';
import TextBox from "../../components/TextBox/TextBox";
import {useRecoilState} from "recoil";
import {usersExerciseState} from "../../store/atoms";
import Container from "../../components/Container/Container";
import styles from './UserExercise.module.scss'
import {useNavigate} from "react-router-dom";
import {addProgressExercise, addProgressTest} from "../../http/userAPI";
import TestResult from "../TestResult/TestResult";

const UserExercise = () => {
    const [userExercise, setUserExercise] = useRecoilState(usersExerciseState);
    const navigate = useNavigate()
    const [completed, setCompleted] = useState(false)
    const [result, setResult] = useState(null)

    useEffect(() => {
        if (!userExercise) {
            navigate('/user')
        }
    }, [])

    const userAddProgress = (speed, error) => {
        let target = (100 - (error * 100 / userExercise.text.length)).toFixed(1)
        if (target < 0) target = 0
        setResult({speed, target})
    }

    if (completed) {
        return (
            <Container>
                <TestResult speed={result.speed} target={result.target} setCompleted={setCompleted} userExercise={true}/>
            </Container>
        )
    }

    if (!userExercise) {
        return <div>loading</div>
    }

    return (
        <Container>
            <h2 className={styles.userExercise__name}>Завдання "{userExercise.name}"</h2>
            <TextBox text={userExercise.text} setCompleted={setCompleted} userAddProgress={userAddProgress} completed={completed}
                     keyboard={false}/>
        </Container>
    );
};

export default UserExercise;
