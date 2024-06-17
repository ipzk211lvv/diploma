import React, {useState} from 'react';
import styles from './Tabs.module.scss';

const Tabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`${styles.tab} ${activeTab === index ? styles.active : ''}`}
                        onClick={() => handleTabClick(index)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <div className={styles.tabContent}>
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default Tabs;
