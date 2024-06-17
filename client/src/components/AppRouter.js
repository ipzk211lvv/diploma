import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {authRouters, publicRouters} from "../routers";
import {useRecoilState, useRecoilValue} from "recoil";
import {userState} from "../store/atoms";

const AppRouter = () => {
    const [user, setUser] = useRecoilState(userState);

    return (
        <Routes>
            {user && authRouters.map((({path, Component}) =>
                <Route key={path} path={path} Component={Component}/>
            ))}
            {publicRouters.map((({path, Component}) =>
                <Route key={path} path={path} Component={Component}/>
            ))}
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
};

export default AppRouter;
