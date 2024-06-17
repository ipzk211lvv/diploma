import React, {useEffect, useState} from 'react';
import Container from "../../components/Container/Container";
import TextBox from "../../components/TextBox/TextBox";
import styles from "./Test.module.scss"
import lightning from "../../assets/icons/lightning-ms.svg";
import {useRecoilValue} from "recoil";
import {userState} from "../../store/atoms";
import {getCourse} from "../../http/courseAPI";
import {NavLink, useNavigate} from "react-router-dom";
import {getTestByCourseId} from "../../http/testAPI";
import {addProgressTest, login} from "../../http/userAPI";
import lightningIcon from "../../assets/icons/lightning-ms.svg";
import targetIcon from "../../assets/icons/target-ms.svg";
import starIcon from "../../assets/icons/star-ms.svg";
import platinumIcon from "../../assets/icons/medal-platinum.png";
import goldIcon from "../../assets/icons/medal-gold.png";
import silverIcon from "../../assets/icons/medal-silver.png";
import SectionText from "../../components/SectionText/SectionText";
import TestResult from "../TestResult/TestResult";



const Test = () => {
    const user = useRecoilValue(userState);
    const [text, setText] = useState('')
    const [completed, setCompleted] = useState(false)
    const [result, setResult] = useState({
        speed: 0,
        error: 0,
    })
    const [course, setCourse] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user.courseId) {
            navigate('/course-select');
        }

        getCourse(user.courseId).then(data => setCourse(data))

        getTestByCourseId(user.courseId).then(data => {
            const orderTest = parseInt(localStorage.getItem('test'))
            if (!data[orderTest]) {
                setText(data[0].text)
                localStorage.setItem('test', '1')
            } else {
                setText(data[orderTest].text)
                localStorage.setItem('test', `${orderTest+1}`)
            }
        })
    }, [completed])

    const userAddProgress = (speed, error) => {
        let target = (100 - (error * 100 / text.length)).toFixed(1)
        if (target < 0) target = 0
        setResult({speed, target})
        addProgressTest(user.id, course.id, speed, target).then(data => console.log(data))
    }

    if (completed) {
        return (
            <Container>
                <TestResult speed={result.speed} target={result.target} setCompleted={setCompleted}/>
            </Container>
        )
    }



    return (
        <Container>
            <div className={styles.test}>
                <div className={styles.test__info}>
                    <div className={styles.test__infoWrapper}>
                        <img className={styles.test__image} src={lightning} alt='lightning' />
                        <h2 className={styles.test__title}>Тест швидкості друку</h2>
                    </div>
                    <p className={styles.test__description}>Пройди тест і дізнайся, як швидко ти друкуєш в курсі <NavLink to="/course-select"><u>{course?.name}</u></NavLink></p>
                </div>
                <div className={styles.test__textBox}>
                    {
                        text?.length
                        ? <TextBox text={text} userAddProgress={userAddProgress} keyboard={false} completed={completed} setCompleted={setCompleted}/>
                        : <div>В цьому курсі відсутні тести. Будь ласка, <NavLink to={'/course-select'}>виберіть інший курс</NavLink>.</div>
                    }
                </div>
            </div>
            <div className={styles.certificate__title}>
                <h3>Вдосконалюй навички набору тексту</h3>
            </div>
            <div className={styles.certificate}>
                <div className={styles.certificate__info}>
                    <p>Проходь тестування скільки завгодно разів та на будь-якій розкладці. До заліку піде лише кращий результат. Тож не бійся та пробуй знову!</p>
                    <p>Після завершення тестування ти отримаєш медаль, яка відображає твою майстерність. Чим краще ти писав, тим вище твоя медаль!</p>
                </div>
                <div className={styles.certificate__table}>
                    <div className={styles.certificate__line}>
                        <div>
                            <img className={styles.certificate__icon} src={starIcon} alt='star'/>
                            <span>рівень</span>
                        </div>
                        <div>
                            <img className={styles.certificate__icon} src={lightningIcon} alt='lightning'/>
                            <span>швидкість</span>
                        </div>
                        <div>
                            <img className={styles.certificate__icon} src={targetIcon} alt='target'/>
                            <span>точність</span>
                        </div>
                    </div>
                    <div className={styles.certificate__line}>
                        <div><img className={styles.certificate__medal} src={platinumIcon} alt='platinum'/> platinum</div>
                        <div>350 зн./хв</div>
                        <div>99.5%</div>
                    </div>
                    <div className={styles.certificate__line}>
                        <div><img className={styles.certificate__medal} src={goldIcon} alt='gold'/> gold</div>
                        <div>250 зн./хв</div>
                        <div>98.7%</div>
                    </div>
                    <div className={styles.certificate__line}>
                        <div><img className={styles.certificate__medal} src={silverIcon} alt='silver'/> silver</div>
                        <div>200 зн./хв</div>
                        <div>96%</div>
                    </div>
                </div>
            </div>
            <div className={styles.info}>
                <SectionText
                    title="Навіщо проходити тест швидкості друку?"
                    text="Щоб дізнатися свою швидкість і точність друку, зрозуміти чи потрібно щось поліпшити. Середня швидкість друку становить 200 зн./хв., спробуй перевершити її! Ти можеш пройти тест кілька разів і побачити, як твоя швидкість друку поліпшується з часом."
                />
                <SectionText
                    title="Як ми вимірюємо швидкість друку?"
                    text="Ми вимірюємо швидкість друку в зн./хв  — скільки знаків на хвилину без помилок ти набрав. «Знаком» вважається будь-який символ включно з пропусками. Ми враховуємо тільки правильно набрані слова.\nТому, якщо зроблено помилку, підрахунок символів зупиняється, поки ти її не виправиш."
                />
            </div>
        </Container>
    );
};

export default Test;
