import React from 'react';
import styles from './ButtonIcon.module.scss'

const ButtonIcon = ({src, alt, onClick}) => {
    const handleButtonClick = (e) => {
        e.stopPropagation()
        onClick()
    }

    return (
        <button className={styles.button} onClick={handleButtonClick}>
            <img className={styles.button__image} src={src} alt={alt ? alt : ''}/>
        </button>
    );
};

export default ButtonIcon;
