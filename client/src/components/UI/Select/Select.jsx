import React, {useEffect, useState} from 'react';
import styles from './Select.module.scss'

const Select = ({ options, onChange, selectedId}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (options.find(e => e.value === selectedId)) {
            setSelectedOption(options.find(e => e.value === selectedId))
        } else {
            setSelectedOption(options[0])
        }
    }, [options])

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        if (onChange) {
            onChange(option);
        }
    };

    return (
        <div className={styles.select}>
            <div className={styles.select__selected} onClick={toggleDropdown}>
                {selectedOption ? selectedOption.label : 'List clear'}
            </div>
            {isOpen && (
                <div className={styles.select__options}>
                    {options.filter(e => e.value !== selectedOption?.value).map((option, index) => (
                        <div className={styles.select__option} key={index} onClick={() => handleOptionClick(option)}>
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Select;
