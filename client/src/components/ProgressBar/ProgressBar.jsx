import React from 'react';
import styles from './ProgressBar.module.scss'

const ProgressBar = ({from, to, height}) => {
    let progress = (from / to) * 100;

    if (!progress) {
        progress = 0;
    }

    return (
        <div className={styles.progressbar}>
            <div className={styles.progressbar__done}
                style={{width: `${progress}%`, minWidth: `${height}`}}
            />
        </div>
    );
};

ProgressBar.defaultProps = {
    from: 0,
    to: 100,
    height: '15px'
};

export default ProgressBar;
