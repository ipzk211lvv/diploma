import React from 'react';
import Container from "../../components/Container/Container";
import styles from './Home.module.scss';
import {NavLink} from "react-router-dom";
import starIcon from "../../assets/icons/star-ms.svg";
import targetIcon from "../../assets/icons/target-ms.svg";
import lightningIcon from "../../assets/icons/lightning-ms.svg";
import questionImage from "../../assets/images/home-question.png";
import sitImage from "../../assets/images/home-sit.png";
import keyboardImage from "../../assets/images/keyboard.png";
import speedImage from "../../assets/images/home-speed.png";

const Home = () => {
    return (
        <Container>
            <div className={styles.home}>
                <section className={styles.section}>
                    <img className={styles.section__image} src={lightningIcon} alt="lightning"/>
                    <h2 className={styles.title}>Друкуй швидше</h2>
                    <p className={styles.paragraph_center}>Навчися швидко друкувати з клавіатурним тренажером BunnyType. Використовуй наші уроки сліпого друку.</p>
                    <div className={styles.button}>
                        <NavLink to={'/typing'}>
                            <button className={styles.button__content}>Розпочати навчання</button>
                        </NavLink>
                    </div>
                </section>
                <section className={styles.section}>
                    <img className={styles.section__image} src={questionImage} alt="questionImage"/>
                    <h2 className={styles.title}>Дізнайся, як друкувати наосліп</h2>
                    <p className={styles.paragraph_center}>Головна ідея друку наосліп у тому, що за кожним пальцем закріплено свою зону клавіш. Це дозволяє друкувати не дивлячись на клавіатуру. Регулярно тренуйся та завдяки м'язовій пам'яті твої пальці знатимуть, куди натиснути.</p>
                </section>
                <section className={styles.section}>
                    <img className={styles.section__image} src={sitImage} alt="sitImage"/>
                    <h2 className={styles.title}>Поза для друку тексту</h2>
                    <ul className={styles.list}>
                        <li className={styles.list__item}>Сядь рівно та тримай спину прямою.</li>
                        <li className={styles.list__item}>Лікті тримай під прямим кутом.</li>
                        <li className={styles.list__item}>Голова має бути трохи нахилена вперед.</li>
                        <li className={styles.list__item}>Відстань від очей до монітора повинна складати 45-70 см.</li>
                        <li className={styles.list__item}>Розслаб м'язи плечей, рук і кистей.</li>
                        <li className={styles.list__item}>Кисті можуть трохи торкатися стола у нижній частині клавіатури, але не перенось вагу тіла на руки, щоб не перенапружувати кисті.</li>
                    </ul>
                </section>
                <section className={styles.section}>
                    <h2 className={styles.title}>Вихідна позиція</h2>
                    <p className={styles.paragraph_left}>Трохи зігни пальці та поклади їх на клавіші <span className={styles.labelButton}>Ф</span><span className={styles.labelButton}>І</span><span className={styles.labelButton}>В</span><span className={styles.labelButton}>А</span>і <span className={styles.labelButton}>О</span><span className={styles.labelButton}>Л</span><span className={styles.labelButton}>Д</span><span className={styles.labelButton}>Ж</span>, що знаходяться у середньому ряду. Цей ряд називається ОСНОВНИМ РЯДОМ, тому що ти завжди будеш починати з цих клавіш і повертатися до них.</p>
                    <p className={styles.paragraph_left}>На клавішах <span className={styles.labelButton}>А</span>та <span className={styles.labelButton}>О</span>, під вказівними пальцями, знаходяться невеликі виступи. Вони дозволяють орієнтуватися на клавіатурі наосліп.</p>
                </section>
                <section className={styles.section}>
                    <h2 className={styles.title}>Схема клавіатури</h2>
                    <img className={styles.section__keyboard} src={keyboardImage} alt="keyboard"/>
                    <p className={styles.paragraph_left}>Колір клавіш на цій клавіатурі допоможе тобі зрозуміти та запам'ятати, котрим пальцем на яку клавішу натискати.</p>
                    <ul className={styles.list}>
                        <li className={styles.list__item}>Тисни клавіші тільки тим пальцем, який для них призначений.</li>
                        <li className={styles.list__item}>Завжди повертай пальці до вихідної позиції «ФІВА – ОЛДЖ».</li>
                        <li className={styles.list__item}>Встанови ритм та дотримуйся його, доки друкуєш. Натискай на клавіші з однаковим інтервалом.</li>
                        <li className={styles.list__item}>Набираючи текст, уявляй розташування клавіш.</li>
                        <li className={styles.list__item}>Клавішу SHIFT завжди натискає мізинець з протилежної сторони від потрібної літери.</li>
                        <li className={styles.list__item}>Пробіл відбивай пальцем лівої або правої руки, як тобі зручніше.</li>
                    </ul>
                    <p className={styles.paragraph_left}>Спочатку цей метод може видатися незручним. Але не зупиняйся. З часом усе виходитиме швидко, легко та зручно. Щоб досягти максимального результату, вибирай курс сліпого друку для твоєї розкладки клавіатури і потрібною мовою.</p>
                </section>
                <section className={styles.section}>
                    <h2 className={styles.title}>Рух пальців</h2>
                    <p className={styles.paragraph_left}>Не підглядай на клавіатуру під час друку. Просто ковзай пальцями по клавішах, доки не знайдеш основний ряд.</p>
                    <p className={styles.paragraph_left}>Обмеж рух кистей та пальців до мінімуму, тільки щоб натискати потрібні клавіші. Тримай руки та пальці якомога ближче до вихідної позиції. Це збільшить швидкість набору тексту та зменшить навантаження на кисті.</p>
                    <p className={styles.paragraph_left}>Стеж за безіменними пальцями та мізинцями, оскільки вони часто залишаються незадіяними.</p>
                </section>
                <section className={styles.section}>
                    <img className={styles.section__image} src={speedImage} alt="speedImage"/>
                    <h2 className={styles.title}>Швидкість друку</h2>
                    <ul className={styles.list}>
                        <li className={styles.list__item}>Не намагайся одразу ж друкувати зі швидкістю світла. Починай прискорюватися, тільки коли пальці звикнуть натискати правильні клавіші.</li>
                        <li className={styles.list__item}>Не поспішай, коли друкуєш, щоб запобігти помилкам. Швидкість буде збільшуватися поступово.</li>
                        <li className={styles.list__item}>Завжди переглядай текст на одне-два слова наперед.</li>
                        <li className={styles.list__item}>Якщо у тебе виникають труднощі із набором тексту, скористайся перевіркою клавіатури, щоб визначити, це пов’язано з проблемами програмного, чи апаратного забезпечення.</li>
                        <li className={styles.list__item}>Пройди усі уроки на клавіатурному тренажері BunnyType. І твоя швидкість стане вище за середню швидкість друку.</li>
                    </ul>
                </section>
                <section className={styles.section}>
                    <h2 className={styles.title}>Бережи себе</h2>
                    <p className={styles.paragraph_center}>Зроби перерву, якщо відчуваєш, що збиваєшся і робиш багато помилок. Невеличка пауза поверне сили та увагу.</p>
                </section>
                <section className={styles.section}>
                    <h2 className={styles.title}>Час тренуватися</h2>
                    <div className={styles.button}>
                        <NavLink to={'/typing'}>
                            <button className={styles.button__content}>Розпочати навчання</button>
                        </NavLink>
                    </div>
                </section>
            </div>
        </Container>
    );
};

export default Home;
