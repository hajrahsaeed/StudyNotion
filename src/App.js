import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";

import Login from "./Pages/Login"
import Signup from "./Pages/SignUp"
import NavBar from "./components/common/NavBar";
import ForgotPassword from "./Pages/ForgotPassword";
import UpdatePassword from "./Pages/UpdatePassword";
import VerifyEmail from "./Pages/verifyEmail";
import OpenRoute from "./components/core/Auth/OpenRoute";
import About from "./Pages/About";
import Contact from "./Pages/Contact"
import Catalog from "./Pages/Catalog";
import Error from "./Pages/Error";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Settings from "./components/core/Dashboard/Settings"
import EnrollCourses from "./components/core/Dashboard/EnrollCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse/index"
import CourseDetails from "./Pages/CourseDetails";
import ViewCourse from "./Pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Instructor from "./components/core/Dashboard/Instructor"
import { getUserDetails } from "./services/operations/profileAPI";

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {user} = useSelector((state) => state.profile)

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     const token = JSON.parse(localStorage.getItem("token"))
  //     dispatch(getUserDetails(token, navigate))
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <NavBar/>
      <Routes>
        <Route path ="/" element={<Home/>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="catalog/:catalogName" element={<Catalog/>} />
        <Route path="courses/:courseId" element={<CourseDetails/>} />
        
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />  
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        /> 
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />  

        <Route element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>    
        }
        >
          {/* Route for all users */}
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings/>}/>

          {
           user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route path="dashboard/enrolled-courses" element={<EnrollCourses />} />
              
            </>
           )
          }

          {
           user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/add-course" element={<AddCourse/>} />
              <Route path="dashboard/my-courses" element={<MyCourses/>} />
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>} />
            </>
           )
          }

        </Route>

           <Route element={
              <PrivateRoute>
                <ViewCourse/>
              </PrivateRoute>
           }>
            { user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                  <Route
                      path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                      element={<VideoDetails/>}
                  />
              </>
            )}
           </Route>



        
        


        <Route path="*" element={<Error />} />

      </Routes>
    </div>
  );
}

export default App;

