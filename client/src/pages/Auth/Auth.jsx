import React, {memo, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE} from "../../utils/consts";
import styles from './Auth.module.scss'
import {login, registration} from "../../http/userAPI";
import {useRecoilState} from "recoil";
import {keyboardState, userState} from "../../store/atoms";
import Container from "../../components/Container/Container";
import authImage from "../../assets/images/auth.png";

const Auth = () => {
    const [user, setUser] = useRecoilState(userState);
    const [keyboard, setKeyboard] = useRecoilState(keyboardState);

    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const click = async (e) => {
        e.preventDefault();
        try {
            let data;
            if (isLogin) {
                data = await login(email, password)
            } else {
                data = await registration(username, email, password)
            }
            setUser(data)
            setKeyboard(null)
            navigate('/typing')
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <Container>
            <div className={styles.auth}>
                <img className={styles.auth__image} src={authImage} alt="auth"/>
                <h2 className={styles.auth__title}>{isLogin ? 'Авторизація' : 'Реєстрація'}</h2>
                <form className={styles.auth__form} action="">
                    {
                        !isLogin && <input className={styles.auth__input} type="text" placeholder="Введіть ваше ім'я..." value={username}
                                          onChange={e => setUsername(e.target.value)}/>
                    }
                    <input className={styles.auth__input} type="text" placeholder='Введіть ваш email...' value={email}
                           onChange={e => setEmail(e.target.value)}/>
                    <input className={styles.auth__input} type="password" placeholder='Введіть ваш пароль...'
                           value={password} onChange={e => setPassword(e.target.value)}/>
                    <div className={styles.buttonWrapper}>
                        <span>{
                            isLogin
                                ? <>Немає аккаунту? <Link to={REGISTRATION_ROUTE}>Зареєструватися</Link></>
                                : <>Є аккаунт? <Link to={LOGIN_ROUTE}>Увійти</Link></>
                        }</span>
                        <button
                            className={styles.auth__button}
                            onClick={(e) => click(e)}
                        >
                            {isLogin ? 'Увійти' : 'Зареєструватися'}
                        </button>
                    </div>
                </form>
            </div>
        </Container>
    );
};

export default memo(Auth);
