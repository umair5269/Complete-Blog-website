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
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from '@/context/AuthContext'

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>

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
            <Route

              path="/userdashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />

            <Route
              path="/createposts" element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              } />

            <Route path="/showposts"
              element={
                <ProtectedRoute>
                  <ShowPosts />
                </ProtectedRoute>
              } />


            <Route
              path="/post/:id" element={
                <ProtectedRoute>
                  <SinglePostPage />
                </ProtectedRoute>
              } />
            <Route
              path="/edit-post/:id" element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              } />
            <Route
              path='/admin/users' element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              } />
            <Route
              path='/manager/users' element={
                <ManagerRoute>
                  <ManagerUsersPage />
                </ManagerRoute>
              } />
            <Route
              path='/admin/posts' element={
                <AdminRoute>
                  <AdminPostsPage />
                </AdminRoute>
              } />
            <Route
              path='/manager/posts' element={
                <ManagerRoute>
                  <ManagerPostsPage />
                </ManagerRoute>
              } />

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
