import React from 'react';
import styles from './Footer.module.scss';
import Container from "../Container/Container";
import {NavLink} from "react-router-dom";
import logo from "../../assets/images/logo.svg";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.footer__wrapper}>
                    <NavLink className='logo' to='/'>
                        <div className={styles.logo}>
                            <img src={logo} alt="LOGO"/>
                        </div>
                    </NavLink>
                    <div className={styles.footer__section}>
                        <h4>Навігація</h4>
                        <ul>
                            <li>Головна</li>
                            <li>Про нас</li>
                            <li>Контакти</li>
                        </ul>
                    </div>
                    <div className={styles.footer__section}>
                        <h4>Слідкуйте за нами</h4>
                        <ul className={styles.socials}>
                            <li>Facebook</li>
                            <li>Twitter</li>
                            <li>Instagram</li>
                        </ul>
                    </div>
                    <div className={styles.footer__section}>
                        <h4>Контакти</h4>
                        <p>Email: contact@bunnytype.com</p>
                        <p>Телефон: (123) 456-7890</p>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
