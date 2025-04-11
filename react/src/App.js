import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from './pages/Admin';
import Login from './pages/Login';
import User from './pages/User';
import Dashboard from './pages/Dashboard';
import NoPage from "./pages/NoPage";
import PrivateRoute from './components/PrivateRoute';
import UserInsert from "./pages/users/UserInsert";
import UserUpdate from "./pages/users/UserUpdate";
import PasswordUpdate from "./pages/users/UserChangePass";
import Student from "./pages/Student";
import Tutor from "./pages/Tutor";
import Meeting from './pages/Meeting';
import MeetingInsert from "./pages/meeting/MeetingInsert";
import MeetingUpdate from "./pages/meeting/MeetingUpdate";
import Document from "./pages/Document";
import Forum from "./pages/Forum";
import './App.css';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="user" element={<User />} />
          <Route path="user/insert" element={<UserInsert />} />
          <Route path="user/update/:id" element={<UserUpdate />} />
          <Route path="user/change-password/:id" element={<PasswordUpdate />} />
          <Route path="forum" element={<Forum />} />
          <Route path="document" element={<Document />} />
          <Route path="meeting" element={<Meeting />} />
          <Route path="meeting/insert" element={<MeetingInsert />} />
          <Route path="meeting/update/:id" element={<MeetingUpdate />} />
          <Route path="student" element={<Student />} />
          <Route path="tutor" element={<Tutor />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
