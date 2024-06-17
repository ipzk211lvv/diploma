import React, {useEffect, useState} from 'react';
import {addLanguage, deleteLanguage, getLanguage, updateLanguage} from "../../../http/languageAPI";
import styles from './LanguageList.module.scss'
import AdminInput from "../AdminInput/AdminInput";
import ButtonIcon from "../../UI/ButtonIcon/ButtonIcon";
import updateIcon from "../../../assets/icons/update.png";
import deleteIcon from "../../../assets/icons/delete.png";
import confirmIcon from "../../../assets/icons/confirm.png";
import crossIcon from "../../../assets/icons/cross.png";

const LanguageList = () => {
    const [loading, setLoading] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [languageUpdate, setLanguageUpdate] = useState(null);

    function fetchData() {
        getLanguage().then(data => {
                setLanguages(data.sort((a,b) => a.id - b.id))
            }
        ).finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAddLanguage = () => {
        if (!languageUpdate) {
            const newLanguage = {id: 0, name: ''}
            setLanguages([...languages, newLanguage])
            setLanguageUpdate(newLanguage)
        }
    }

    const handlerChangeInput = (e) => {
        setLanguageUpdate({...languageUpdate, name: e.currentTarget.value})
    }


    const handleConfirm = () => {
        if (languageUpdate?.id !== 0) {
            updateLanguage(languageUpdate.id, languageUpdate.name).then(r => fetchData())
        } else {
            addLanguage(languageUpdate.name).then(r => fetchData())
        }
        setLanguageUpdate(null)
    }

    const handleCansel = () => {
        if (languageUpdate.id !== 0) {
            setLanguageUpdate(null)
        } else {
            setLanguageUpdate(null)
            setLanguages(languages.filter(e => e.id !== 0))
        }
    }

    const handleUpdateLanguage = (language) => {
        if (!languageUpdate || language.id !== languageUpdate.id) {
            setLanguageUpdate(language)
        } else {
            addLanguage(languageUpdate.name).then(r => fetchData())
        }
    }

    const handleDeleteLanguage = (languageId) => {
        deleteLanguage(languageId).then(r => fetchData())
    }

    if (loading) {
        return <>LOADING...</>
    }

    return (
        <div className={styles.languages}>
            <button className={styles.languages__addButton} onClick={handleAddLanguage}>
                Додати мову
            </button>
            {languages.length ?
                languages.map(language =>
                    <div className={styles.languages__item} key={language.id}>
                        <AdminInput type='text' valueName='name' data={language} updateData={languageUpdate} onChange={handlerChangeInput}/>
                        { languageUpdate?.id !== language.id ? <>
                            <ButtonIcon src={updateIcon} onClick={() => handleUpdateLanguage(language)}/>
                            <ButtonIcon src={deleteIcon} onClick={() => handleDeleteLanguage(language.id)}/>
                        </> : <>
                            <ButtonIcon src={confirmIcon} onClick={handleConfirm}/>
                            <ButtonIcon src={crossIcon} onClick={handleCansel}/>
                        </>
                        }
                    </div>
                )
                : <div>Пусто</div>
            }
        </div>
    );
};

export default LanguageList;
