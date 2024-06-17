import React, {useState} from 'react';

import Tabs from "../../components/UI/Tabs/Tabs";
import LanguageList from "../../components/admin/LanguageList/LanguageList";
import LayoutList from "../../components/admin/LayoutList/LayoutList";
import CoursesTable from "../../components/admin/CourseList/CoursesTable";

import Container from "../../components/Container/Container";
import KeyboardList from "../../components/admin/KeyboardList/KeyboardList";

const tabs = [
    { label: 'Courses', content: <CoursesTable/> },
    { label: 'Keyboard', content: <KeyboardList /> },
    { label: 'Language', content: <LanguageList /> },
    { label: 'Layout', content: <LayoutList /> },
    { label: 'Users', content: <LayoutList /> },
];

const Admin = () => {

    return (
        <Container>
            <Tabs tabs={tabs}/>
        </Container>
    );
};

export default Admin;
