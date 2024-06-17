import './App.module.scss';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./AppRouter";
import {useRecoilState} from "recoil"
import Header from "./Header/Header";
import {keyboardState, userState} from "../store/atoms";
import {useEffect, useState} from "react";
import {check, login} from "../http/userAPI";
import Container from "./Container/Container";
import '../index.scss'
import Footer from "./Footer/Footer";
import styles from './App.module.scss'

const App = () => {
    const [user, setUser] = useRecoilState(userState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        check().then(data => {
            setUser(data)
        }).finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <span>Loading ...</span>
    }

    return (
        <BrowserRouter>
            <Header/>
            <main className={styles.main}>
                <AppRouter />
            </main>
            <Footer/>
        </BrowserRouter>
  );
};

export default App;
