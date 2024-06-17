import React, {useEffect} from 'react';
import {useRecoilState} from "recoil";
import {userState} from "../../store/atoms";
import {NavLink} from "react-router-dom";
import styles from './Header.module.scss'
import Container from "../Container/Container";
import Button from "../UI/Button/Button";

import logo from '../../assets/images/logo.svg'

const Header = () => {
    const [user, setUser] = useRecoilState(userState);

    useEffect(() => {
        // console.log(user)
    }, [user])

    return (
        <header className={styles.header}>
            <Container>
                <div className={styles.header__wrapper}>
                    <div className={styles.header__button}>
                        <NavLink className='logo' to='/'>
                            <div className={styles.header__logo}>
                                <img src={logo} alt="LOGO"/>
                                <span>BunnyType</span>
                            </div>
                        </NavLink>
                    </div>
                    <nav className={styles.header__menu}>
                        <NavLink to='/typing'>
                            <Button>
                                Тренажер
                            </Button>
                        </NavLink>
                        <NavLink to='/test'>
                            <Button>
                                Тестування
                            </Button>
                        </NavLink>
                    </nav>
                    <div className={styles.header__button}>
                        {
                            user
                                ?
                                <NavLink to='/user'>
                                    <Button>
                                        Профіль
                                    </Button>
                                </NavLink>
                                :
                                <NavLink to='/login'>
                                    <Button>
                                        Увійти
                                    </Button>
                                </NavLink>
                        }
                    </div>
                </div>
            </Container>
        </header>
    );
};

export default Header;
