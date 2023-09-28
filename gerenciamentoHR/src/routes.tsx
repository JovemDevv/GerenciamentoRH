import { Route, Routes } from "react-router-dom"
import Login from "./pages/Users/login"
import Historico from "./pages/history"
import UserCreate from "./pages/Users/Create"
import UserEdit from "./pages/Users/Edit"
import UserList from "./pages/Users/List"
import Dashboard from "./pages/Dashboard"
import SignUp from "./pages/Users/signup"

// import NotFound from "./pages/NotFound"

export function AppRoutes() { 
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserCreate />} />
        <Route path="/users/:id" element={<UserEdit />} />
        <Route path="/historico/:id" element={<Historico />} />
        
    </Routes>
  )
}
