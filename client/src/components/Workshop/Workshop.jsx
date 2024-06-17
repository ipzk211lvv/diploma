import React, {useEffect, useState} from 'react';
import styles from './Workshop.module.scss';
import UserExercise from "../../pages/UserExercise/UserExercise";
import {useRecoilState, useRecoilValue} from "recoil";
import {usersExerciseState, userState} from "../../store/atoms";
import {useNavigate} from "react-router-dom";
import {addUserExercise, deleteUserExercise, getUserExercise, updateUserExercise} from "../../http/userAPI";

const Workshop = () => {
    const user = useRecoilValue(userState);
    const [userExercise, setUserExercise] = useRecoilState(usersExerciseState);
    const [isCreate, setIsCreate] = useState(false)
    const [exercises, setExercises] = useState([])
    const [newExercise, setNewExercise] = useState({id: 0, name: '', text: ''})
    const navigate = useNavigate()

    const fetchData = () => {
        getUserExercise(user.id).then(data => setExercises(data))
        setNewExercise({id: 0, name: '', text: ''})
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAddButton = () => {
        setIsCreate(!isCreate)
    }
    const handleNewExercise = (obj) => {
        if (obj.text.length <= 999) {
            setNewExercise(obj)
        }
    }
    const handleUpdateExercise = (e, id) => {
        e.stopPropagation()
        setIsCreate(true)
        setNewExercise(exercises.find(e => e.id === id))
    }
    const handleDeleteExercise = (e, id) => {
        e.stopPropagation()
        deleteUserExercise(id).then(r => fetchData()).finally(() => fetchData())
    }
    const handleStart = (id) => {
        setUserExercise(exercises.find(e => e.id === id))
        navigate('/user-exercise')
    }

    const saveExercise = () => {
        if (newExercise.id === 0) {
            addUserExercise(user.id, newExercise.name, newExercise.text).then(e => fetchData())
        } else {
            updateUserExercise(newExercise.id, newExercise.name, newExercise.text).then(e => fetchData())
        }
        setIsCreate(false)
        setNewExercise({id: 0, name: '', text: ''})
    }

    return (
        <div className={styles.workshop}>
            <div className={styles.workshop__header}>
                <h4 className={styles.workshop__title}>{ isCreate ? 'Створення завдання' : 'Ваші завдання' }</h4>
                <button className={styles.workshop__headerButton} onClick={handleAddButton}>{ isCreate ? 'Список завдань' : 'Додати завдання'}</button>
            </div>
            {
                isCreate ?
                    <div className={styles.create}>
                        <input className={styles.create__name} type="text"
                               placeholder='Назва завдання...'
                               value={newExercise.name}
                               onChange={e => handleNewExercise({...newExercise, name: e.target.value})}/>
                        <div className={styles.create__textWrapper}>
                            <textarea className={styles.create__text} cols="30" rows="10"
                                      placeholder='Текст завдання...'
                                      value={newExercise.text}
                                      onChange={e => handleNewExercise({...newExercise, text: e.target.value})}/>
                            <span>{newExercise.text.length}/999</span>
                        </div>
                        <button className={styles.create__addButton} onClick={saveExercise}>Зберегти завдання</button>
                    </div>
                    : <div className={styles.exercises}>
                        {
                            exercises?.length > 0 ?
                                exercises.map(e =>
                                    <div className={styles.exercises__item} key={e.id} onClick={() => handleStart(e.id)}>
                                        <h5>{e.name}</h5>
                                        <span>{e.text.slice(0, 20)}...</span>
                                        <button className={styles.workshop__button_update}
                                            onClick={(event) => handleUpdateExercise(event, e.id)}
                                        >оновити</button>
                                        <button className={styles.workshop__button_delete}
                                                onClick={(event) => handleDeleteExercise(event, e.id)}>
                                            видалити
                                        </button>
                                    </div>
                                )
                                : <div>
                                    Завдань немає
                                </div>
                        }
                    </div>
            }
        </div>
    );
};

export default Workshop;
