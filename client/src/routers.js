import Admin from "./pages/Admin/Admin";
import {ADMIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE} from "./utils/consts";
import Auth from "./pages/Auth/Auth";
import Exercise from "./pages/Exercise/Exercise";
import UserProfile from "./pages/UserProfile/UserProfile";
import App from "./components/App";
import Test from "./pages/Test/Test";
import CourseSelect from "./pages/CourseSelect/CourseSelect";
import Home from "./pages/Home/Home";
import UserExercise from "./pages/UserExercise/UserExercise";

export const authRouters = [
    {
        path: ADMIN_ROUTE,
        Component: Admin,
    },
    {
        path: '/typing',
        Component: Exercise,
    },
    {
        path: '/test',
        Component: Test,
    },
    {
        path: '/user',
        Component: UserProfile,
    },
    {
        path: '/user-exercise',
        Component: UserExercise,
    }
]

export const publicRouters = [
    {
        path: '/',
        Component: Home,
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth,
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth,
    },
    {
        path: '/course-select',
        Component: CourseSelect,
    },
]
