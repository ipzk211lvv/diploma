import React from 'react';
import styles from './SectionText.module.scss';

const SectionText = ({ title, text }) => {

    return (
        <div className={styles.section}>
            <h3 className={styles.section__title}>{title}</h3>
            {text.split('\\n').map((paragraph, index) => (
                <p key={index} className={styles.section__text}>{paragraph}</p>
            ))}
        </div>
    );
};

export default SectionText;
