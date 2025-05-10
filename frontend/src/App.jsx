import { Routes , Route } from "react-router-dom"
import IndexPage from "./pages/IndexPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import Layout from "./layout.jsx"
import axios from "axios"
import ProfilePage from "./pages/ProfilePage.jsx"
import PlacesPage from "./pages/PlacesPage.jsx"
import PlaceFormPage from "./pages/PlaceFormPage.jsx"
import PlacePage from "./pages/PlacePage.jsx"
import BookingsPage from "./pages/BookingsPage.jsx"
import BookingPage from "./pages/BookingPage.jsx"
import ResetPassword from "./pages/ResetPassword.jsx"
import {ToastContainer} from 'react-toastify';

function App() {
  
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.withXSRFToken = true;
  axios.defaults.withCredentials = true;
  

  return (
    <>
      <ToastContainer position="bottom-center" />
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index  element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ResetPassword />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/places" element={<PlacesPage />} />
          <Route path="/profile/places/new" element={<PlaceFormPage />} />
          <Route path="/profile/places/:id" element={<PlaceFormPage />} />
          <Route path="/profile/bookings/:id" element={<BookingPage />} />
          <Route path="/profile/bookings" element={<BookingsPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
