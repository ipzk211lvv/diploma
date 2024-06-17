import React from 'react';
import styles from "./Admin.module.scss";

const AdminInput = ({type, valueName, onChange, data, updateData}) => {
    const currentValue = updateData?.id === data.id ? updateData[valueName] : data[valueName]
    const disabled = updateData?.id !== data.id

    return (
        <input className={styles.adminInput}
               type={type}
               value={currentValue}
               onChange={onChange}
               disabled={disabled}
               data-name={valueName}
        />
    )
}

export default AdminInput;
