import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import React from 'react'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Admin from './pages/Admin'
import UserDashboard from './pages/UserDasgboard'
import CreatePostPage from './pages/CreatePosts'
import ShowPosts from './pages/ShowPosts'
import AdminRoute from '@/routes/AdminRoute'
import SinglePostPage from './pages/SinglePostPage';
import EditPostPage from './pages/EditPostPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminPostsPage from './pages/AdminPostsPage'
import ManagerRoute from '@/routes/ManagerRoute'
import Manager from './pages/Manager'
import ManagerUsersPage from './pages/ManagerUsersPage'
import ManagerPostsPage from './pages/MnagerPostsPage'

function App() {

  return (
   <>
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Homepage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    <Route path="/admin" element={
      <AdminRoute>
        <Admin />
      </AdminRoute>
      } />
    <Route path="/manager" element={
      <ManagerRoute>
        <Manager />
      </ManagerRoute>
      } />
    <Route path="/userdashboard" element={<UserDashboard />} />
    <Route path="/createposts" element={<CreatePostPage />} />
    <Route path="/showposts" element={<ShowPosts />} />
    <Route path="/post/:id" element={<SinglePostPage />} />
    <Route path="/edit-post/:id" element={<EditPostPage />} />
    <Route path='/admin/users' element={<AdminUsersPage />} />
    <Route path='/manager/users' element={<ManagerUsersPage />} />
    <Route path='/admin/posts' element={<AdminPostsPage />} />
    <Route path='/manager/posts' element={<ManagerPostsPage />} />

   </Routes>
   </BrowserRouter>
   </>
  )
}

export default App
