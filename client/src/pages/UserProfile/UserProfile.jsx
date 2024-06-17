import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import {ADMIN_ROUTE} from "../../utils/consts";
import Container from "../../components/Container/Container";
import {useRecoilState} from "recoil";
import {userState} from "../../store/atoms";
import styles from './UserProfile.module.scss'
import UserStatsTest from "../../components/UserStatsTest/UserStatsTest";
import UserStatsLesson from "../../components/UserStatsLesson/UserStatsLesson";
import Workshop from "../../components/Workshop/Workshop";


const ProfileTabs = ({logOut, user, setActiveTab}) => {
    const navigate = useNavigate()

    const changeTab = (i) => {
        setActiveTab(i)
        localStorage.setItem('profileActiveTab', i.toString())
    }

    return (
        <div className={styles.profile__nav}>
            {
                profileTabs.map((e, i) =>
                    <Button key={i} onClick={() => changeTab(i)}>
                        {e.title}
                    </Button>
                )
            }
            <Button onClick={logOut}>
                Вийти
            </Button>
            {
                user.role === 'ADMIN' &&
                <Button onClick={() => navigate(ADMIN_ROUTE)}>
                    Admin
                </Button>
            }
        </div>
    )
}

const profileTabs = [
    {title: 'Результати тестування', component: <UserStatsTest/>},
    {title: 'Результати навчання', component: <UserStatsLesson/>},
    {title: 'Майстерня', component: <Workshop/>},
    ]

const UserProfile = () => {
    const [user, setUser] = useRecoilState(userState);
    const [activeTab, setActiveTab] = useState(0);


    useEffect(() => {
        let storageActiveTab = parseInt(localStorage.getItem('profileActiveTab'), 10)
        setActiveTab(isNaN(storageActiveTab) ? 0 : storageActiveTab)
    }, [])


    const logOut = () => {
        setUser(null)
        localStorage.removeItem('token')
        console.log(localStorage.getItem('token'))
    }

    return (
        <Container>
            <div className={styles.profile}>
                <ProfileTabs logOut={logOut} user={user} setActiveTab={setActiveTab}/>
                <div className={styles.profile__tabContent}>
                    {profileTabs[activeTab].component}
                </div>
            </div>
        </Container>
    );
};

export default UserProfile;
