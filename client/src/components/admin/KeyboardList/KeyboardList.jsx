import React, {useCallback, useEffect, useState} from "react";
import styles from "./KeyboardList.module.scss";
import {addKeyboard, deleteKeyboard, getKeyboard, updateKeyboard} from "../../../http/keyboardAPI";
import AdminInput from "../AdminInput/AdminInput";
import ButtonIcon from "../../UI/ButtonIcon/ButtonIcon";
import updateIcon from "../../../assets/icons/update.png";
import deleteIcon from "../../../assets/icons/delete.png";
import confirmIcon from "../../../assets/icons/confirm.png";
import crossIcon from "../../../assets/icons/cross.png";
import listIcon from "../../../assets/icons/open-list.png";
import Select from "../../UI/Select/Select";
import {addLanguage, getLanguage, updateLanguage} from "../../../http/languageAPI";
import {getLayout} from "../../../http/layoutAPI";

const colors = {
    grey: '#dcdcdc',
    purple: '#dba7ff',
    green: '#b0ffa7',
    orange: '#ffd3a7',
    blue: '#a7e8ff',
    yellow: '#ffeda7',
}

const templateKeyboard = [
    [
        {width: 1, color: colors.grey, value: "`", shiftValue: "~"},
        {width: 1, color: colors.purple, value: "1", shiftValue: "!"},
        {width: 1, color: colors.purple, value: "2", shiftValue: "@"},
        {width: 1, color: colors.green, value: "3", shiftValue: "#"},
        {width: 1, color: colors.orange, value: "4", shiftValue: "$"},
        {width: 1, color: colors.blue, value: "5", shiftValue: "%"},
        {width: 1, color: colors.blue, value: "6", shiftValue: "^"},
        {width: 1, color: colors.yellow, value: "7", shiftValue: "&"},
        {width: 1, color: colors.orange, value: "8", shiftValue: "*"},
        {width: 1, color: colors.green, value: "9", shiftValue: "("},
        {width: 1, color: colors.purple, value: "0", shiftValue: ")"},
        {width: 1, color: colors.purple, value: "-", shiftValue: "_"},
        {width: 1, color: colors.purple, value: "=", shiftValue: "+"},
        {width: 2, color: colors.grey, value: "←", shiftValue: "←"},
    ],
    [
        {width: 1.5, color: colors.grey, value: "Tab", shiftValue: "Tab"},
        {width: 1, color: colors.purple, value: "q", shiftValue: "Q"},
        {width: 1, color: colors.green, value: "w", shiftValue: "W"},
        {width: 1, color: colors.orange, value: "e", shiftValue: "E"},
        {width: 1, color: colors.blue, value: "r", shiftValue: "R"},
        {width: 1, color: colors.blue, value: "t", shiftValue: "T"},
        {width: 1, color: colors.yellow, value: "y", shiftValue: "Y"},
        {width: 1, color: colors.yellow, value: "u", shiftValue: "U"},
        {width: 1, color: colors.orange, value: "i", shiftValue: "I"},
        {width: 1, color: colors.green, value: "o", shiftValue: "O"},
        {width: 1, color: colors.purple, value: "p", shiftValue: "P"},
        {width: 1, color: colors.purple, value: "[", shiftValue: "{"},
        {width: 1, color: colors.purple, value: "]", shiftValue: "}"},
        {width: 1.2, color: colors.grey, value: "\\", shiftValue: "|"},
    ],
    [
        {width: 2, color: colors.grey, value: "Caps", shiftValue: "Caps"},
        {width: 1, color: colors.purple, value: "a", shiftValue: "A"},
        {width: 1, color: colors.green, value: "s", shiftValue: "S"},
        {width: 1, color: colors.orange, value: "d", shiftValue: "D"},
        {width: 1, color: colors.blue, value: "f", shiftValue: "F"},
        {width: 1, color: colors.blue, value: "g", shiftValue: "G"},
        {width: 1, color: colors.yellow, value: "h", shiftValue: "H"},
        {width: 1, color: colors.yellow, value: "j", shiftValue: "J"},
        {width: 1, color: colors.orange, value: "k", shiftValue: "K"},
        {width: 1, color: colors.green, value: "l", shiftValue: "L"},
        {width: 1, color: colors.purple, value: ";", shiftValue: ":"},
        {width: 1, color: colors.purple, value: "'", shiftValue: "\""},
        {width: 2, color: colors.grey, value: "Enter", shiftValue: "Enter"},
    ],
    [
        {width: 3, color: colors.grey, value: "Shift", shiftValue: "Shift"},
        {width: 1, color: colors.purple, value: "z", shiftValue: "Z"},
        {width: 1, color: colors.green, value: "x", shiftValue: "X"},
        {width: 1, color: colors.orange, value: "c", shiftValue: "C"},
        {width: 1, color: colors.blue, value: "v", shiftValue: "V"},
        {width: 1, color: colors.blue, value: "b", shiftValue: "B"},
        {width: 1, color: colors.yellow, value: "n", shiftValue: "N"},
        {width: 1, color: colors.yellow, value: "m", shiftValue: "M"},
        {width: 1, color: colors.orange, value: ",", shiftValue: "<"},
        {width: 1, color: colors.green, value: ".", shiftValue: ">"},
        {width: 1, color: colors.purple, value: "/", shiftValue: "?"},
        {width: 3, color: colors.grey, value: "Shift", shiftValue: "Shift"},
    ],
    [
        {width: 4, color: "transparent", value: "", shiftValue: ""},
        {width: 5, color: colors.grey, value: "⠀", shiftValue: "⠀"},
        {width: 5, color: "transparent", value: "", shiftValue: ""},
    ],
]


const KeyboardList = () => {
    const [keyboards, setKeyboards] = useState([])
    const [keyboardUpdate, setKeyboardUpdate] = useState(null)
    const [languages, setLanguages] = useState([])
    const [layouts, setLayouts] = useState([])
    const [showKeyboard, setShowKeyboard] = useState([])

    function fetchData() {
        getKeyboard().then(data => setKeyboards(data))
    }

    useEffect(() => {
        fetchData()
        getLanguage().then(data => setLanguages(data))
        getLayout().then(data => setLayouts(data))
    }, [])

    const handleUpdateKeyboard = (keyboard) => {
        setKeyboardUpdate(keyboard)
    }


    const handleConfirm = () => {
        if (keyboardUpdate?.id !== 0) {
            updateKeyboard(keyboardUpdate.id, keyboardUpdate.languageId, keyboardUpdate.layoutId, keyboardUpdate.keyboard).then(r => fetchData())
        } else {
            addKeyboard(keyboardUpdate.languageId, keyboardUpdate.layoutId, keyboardUpdate.keyboard).then(r => fetchData())
        }
        setKeyboardUpdate(null)
    }

    const handleCansel = () => {
        setKeyboardUpdate(null)
        if (keyboardUpdate?.id === 0) {
            setKeyboards(keyboards.filter(e => e.id !== 0))
        }
    }

    const handleDeleteKeyboard = (id) => {
        deleteKeyboard(id).then(r => fetchData())
    }

    const addNewKeyboard = useCallback(() => {
        if (!keyboardUpdate) {
            const newKeyboard = {id: 0, layoutId: layouts[0].id, languageId: languages[0].id, keyboard: templateKeyboard}
            setKeyboardUpdate(newKeyboard)
            setKeyboards([...keyboards, newKeyboard])
        }
    }, [languages, layouts])


    const handleShowKeyboard = (id) => {
        if (showKeyboard.includes(id)) {
            setShowKeyboard(showKeyboard.filter(e => e !== id))
        } else {
            setShowKeyboard([...showKeyboard, id])
        }
    }

    if (!languages.length || !layouts.length) {
        return <div>loading...</div>
    }

    return (
        <div className={styles.keyboards}>
            <button className={styles.keyboards__addButton} onClick={addNewKeyboard}>
                Додати клавіатуру
            </button>
            {
                keyboards.length ?
                    keyboards.map(keyboard =>
                        <div className={styles.keyboards__item} key={keyboard.id}>
                            <div className={styles.keyboards__itemInfo}>
                                <ButtonIcon src={listIcon} onClick={() => handleShowKeyboard(keyboard.id)}/>
                                { keyboardUpdate?.id !== keyboard.id ?
                                    <>
                                        <div>{languages.find(e => e.id === keyboard.languageId).name}</div>
                                        <div>{layouts.find(e => e.id === keyboard.layoutId).name}</div>
                                        <ButtonIcon src={updateIcon} onClick={() => handleUpdateKeyboard(keyboard)}/>
                                        <ButtonIcon src={deleteIcon} onClick={() => handleDeleteKeyboard(keyboard.id)}/>
                                    </> :
                                    <>
                                        <Select options={languages?.map(e => {return {value: e.id, label: e.name}})}
                                                selectedId={keyboard.languageId}
                                                onChange={(e) => setKeyboardUpdate({...keyboardUpdate, languageId: e.value})}
                                        />
                                        <Select options={layouts?.map(e => {return {value: e.id, label: e.name}})}
                                                selectedId={keyboard.layoutId}
                                                onChange={(e) => setKeyboardUpdate({...keyboardUpdate, layoutId: e.value})}
                                        />
                                        <ButtonIcon src={confirmIcon} onClick={handleConfirm}/>
                                        <ButtonIcon src={crossIcon} onClick={handleCansel}/>
                                    </>
                                }
                            </div>
                            <div>
                                {
                                    showKeyboard.includes(keyboard.id) &&
                                    <KeyboardDesigner currentKeyboard={keyboard.keyboard}
                                                      setCurrentKeyboard={updKeyboard => setKeyboardUpdate({...keyboardUpdate, keyboard: updKeyboard})}
                                                      isUpdate={keyboardUpdate?.id === keyboard.id}/>
                                }
                            </div>
                        </div>
                    )
                    : <div>Пусто</div>
            }
        </div>
    )
}

const KeyboardDesigner = ({currentKeyboard, setCurrentKeyboard, isUpdate}) => {
    const [keyboard, setKeyboard] = useState(JSON.parse(JSON.stringify(currentKeyboard)))
    const [showShift, setShowShift] = useState(false)

    const changeKeyKeyboard = (value, i, j) => {
        setKeyboard(keyboard => {
            const newKeyboard = [...keyboard]
            if (showShift) {
                newKeyboard[i][j].shiftValue = value
            } else {
                newKeyboard[i][j].value = value
            }
            return newKeyboard
        })
    }

    return (
        <div className={styles.keyboard}>
            {
                keyboard.map((line, i) =>
                    <div key={i} className={styles.keyboard__line}>
                        {line.map((key, j) =>
                            <div className={styles.keyboard__keyWrapper} key={j}
                                 style={{backgroundColor: key.color, flex: key.width, fontSize: key.value.length > 1 ? 12 : 16}}>
                                <input className={styles.keyboard__key}
                                       type="text" value={showShift ? key.shiftValue : key.value}
                                       onChange={(e) => changeKeyKeyboard(e.currentTarget.value, i, j)}
                                    disabled={!isUpdate}
                                />
                            </div>
                        )}
                    </div>
                )
            }
            <div className={styles.keyboard__buttons}>
                <button className={styles.keyboard__button} onClick={() => setShowShift(!showShift)}>Shift {showShift ? '▼' : '▲'}</button>
                <button className={styles.keyboard__button} onClick={() => setCurrentKeyboard(keyboard)}>Save</button>
                <button className={styles.keyboard__button} onClick={() => setKeyboard(JSON.parse(JSON.stringify(currentKeyboard)))}>Return</button>
            </div>
        </div>
    )
}

export default KeyboardList;
