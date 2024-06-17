import {useRecoilState} from "recoil";
import {userState} from "../../store/atoms";
import React, {useEffect, useState} from "react";
import {getResultTest} from "../../http/userAPI";
import styles from "./UserStatsTest.module.scss";
import {formatDateTime} from "../../utils/formatDateUtils";
import {CartesianGrid, Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import lightningIcon from "../../assets/icons/lightning-ms.svg";
import platinumIcon from "../../assets/icons/medal-platinum.png";
import goldIcon from "../../assets/icons/medal-gold.png";
import silverIcon from "../../assets/icons/medal-silver.png";
import {useNavigate} from "react-router-dom";


const medals = {
    platinum: platinumIcon,
    gold: goldIcon,
    silver: silverIcon,
}

const UserStatsTest = () => {
    const [user, setUser] = useRecoilState(userState);
    const [stats, setStats] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        getResultTest(user.id, user.courseId).then(data => {
            if (data.tests.length) {
                let maxSpeed = 0
                let maxTarget = 0
                const treatmentData = data.tests.map(e => {
                    if (e.speed > maxSpeed) {
                        maxSpeed = e.speed
                        maxTarget = e.target
                    }
                    return {...e, createdAt: formatDateTime(e.createdAt)}
                })
                setStats({...data, tests: treatmentData, maxSpeed, maxTarget })
                return
            }
            setStats(data)
        })
    }, [])


    if (!stats) {
        return <div>Loading...</div>
    }

    if (!stats.tests?.length) {
        return (
            <>
                <div className={styles.header}>
                    <img className={styles.header__image} src={lightningIcon} alt='target'/>
                    <h2 className={styles.header__title}>Результатів тестування немає</h2>
                </div>
                <div className={styles.course}>
                    <div className={styles.course__content}>
                        <h3 className={styles.course__name}>{stats.course.name}</h3>
                        <p className={styles.course__select}
                           onClick={() => navigate('/course-select')}>
                            Вибрати інший курс
                        </p>
                    </div>
                    <button className={styles.course__next}
                            onClick={() => navigate('/test')}>
                        Пройти тестування
                    </button>
                </div>
            </>
        )
    }

    return (
        <div className={styles.result} style={{width: "100%"}}>
            <div className={styles.header}>
                <img className={styles.header__image} src={lightningIcon} alt='target'/>
                <h2 className={styles.header__title}>Результати тестування</h2>
            </div>
            <ProgressChart data={stats.tests}/>
            <div className={styles.course}>
                <div className={styles.course__content}>
                    <h3 className={styles.course__name}>{stats.course.name}</h3>
                    <p className={styles.course__progress}>Рекордні результати: {stats.maxSpeed} зн./хв. | {stats.maxTarget}%</p>
                </div>
                <div className={styles.course__buttons}>
                    <p className={styles.course__select}
                       onClick={() => navigate('/course-select')}>
                        Вибрати інший курс
                    </p>
                    <button className={styles.course__next}
                            onClick={() => navigate('/test')}>
                        Покращити
                    </button>
                </div>
            </div>
            <div className={`${styles.statsTable} ${styles.statsTable__header}`}>
                <div>Швидкість</div>
                <div>Точність</div>
                <div>Дата / Час</div>
            </div>
            {
                stats.tests.map(e => <div className={styles.statsTable} key={e.id}>
                    <div className={styles.statsTable__item}>
                        <span className={styles.statsTable__itemText}>{e.speed} зн./хв.
                            {
                                e.certificate &&
                                <img className={styles.statsTable__image} src={medals[e.certificate]} alt='medal'/>
                            }
                        </span>
                    </div>
                    <div className={styles.statsTable__item}>{e.target}%</div>
                    <div className={styles.statsTable__item}>{e.createdAt}</div>
                </div>)
            }
        </div>
    )
}

const ProgressChart = ({data}) => {
    return (
        <div className={styles.graph}>
            <div className={styles.graph__wrapper}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.reverse()}>
                        <CartesianGrid strokeDasharray="1 3"/>
                        <XAxis dataKey="createdAt"/>
                        <YAxis yAxisId="left" domain={[0, 'auto']}>
                            <Label
                                value="Швидкість (зн./хв.)"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: 'middle' }}
                                stroke="#8884d8"
                            />
                        </YAxis>
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]}>
                            <Label
                                value="Точність (%)"
                                angle={-90}
                                position="insideRight"
                                style={{ textAnchor: 'middle' }}
                                stroke="#82ca9d"
                            />
                        </YAxis>
                        <Tooltip/>
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="speed"
                            stroke="#8884d8"
                            name="Швидкість"
                            unit=" зн./хв."
                            strokeWidth={3}
                            dot={false}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="target"
                            stroke="#82ca9d"
                            name="Точність"
                            unit="%"
                            strokeWidth={3}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UserStatsTest;
