import React, {useEffect, useState} from 'react';
import {addLayout, deleteLayout, getLayout, updateLayout} from "../../../http/layoutAPI";
import styles from './LayoutList.module.scss'
import AdminInput from "../AdminInput/AdminInput";
import ButtonIcon from "../../UI/ButtonIcon/ButtonIcon";
import updateIcon from "../../../assets/icons/update.png";
import deleteIcon from "../../../assets/icons/delete.png";
import confirmIcon from "../../../assets/icons/confirm.png";
import crossIcon from "../../../assets/icons/cross.png";
import plusIcon from "../../../assets/icons/plus.png";

const LayoutList = () => {
    const [loading, setLoading] = useState(false);
    const [layouts, setLayouts] = useState([]);
    const [layoutUpdate, setLayoutUpdate] = useState(null);

    function fetchData() {
        getLayout().then(data => {
            setLayouts(data.sort((a,b) => a.id - b.id))
            }
        ).finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])


    const handleAddLayout = () => {
        if (!layoutUpdate) {
            const newLayout = {id: 0, name: ''}
            setLayouts([...layouts, newLayout])
            setLayoutUpdate(newLayout)
        }
    }

    const handlerChangeInput = (e) => {
        setLayoutUpdate({...layoutUpdate, name: e.currentTarget.value})
    }


    const handleConfirm = () => {
        if (layoutUpdate?.id !== 0) {
            updateLayout(layoutUpdate.id, layoutUpdate.name).then(r => fetchData())
        } else {
            addLayout(layoutUpdate.name).then(r => fetchData())
        }
        setLayoutUpdate(null)
    }

    const handleCansel = () => {
        if (layoutUpdate.id !== 0) {
            setLayoutUpdate(null)
        } else {
            setLayoutUpdate(null)
            setLayouts(layouts.filter(e => e.id !== 0))
        }
    }

    const handleUpdateLayout = (Layout) => {
        if (!layoutUpdate || Layout.id !== layoutUpdate.id) {
            setLayoutUpdate(Layout)
        } else {
            addLayout(layoutUpdate.name).then(r => fetchData())
        }
    }

    const handleDeleteLayout = (LayoutId) => {
        deleteLayout(LayoutId).then(r => fetchData())
    }

    if (loading) {
        return <>LOADING...</>
    }

    return (
        <div className={styles.layouts}>
            <button className={styles.layouts__addButton} onClick={handleAddLayout}>
                Додати розкладку
            </button>
            {layouts.length ?
                layouts.map(layout =>
                    <div className={styles.layouts__item} key={layout.id}>
                        <AdminInput type='text' valueName='name' data={layout} updateData={layoutUpdate} onChange={handlerChangeInput}/>
                        { layoutUpdate?.id !== layout.id ? <>
                            <ButtonIcon src={updateIcon} onClick={() => handleUpdateLayout(layout)}/>
                            <ButtonIcon src={deleteIcon} onClick={() => handleDeleteLayout(layout.id)}/>
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

export default LayoutList;
