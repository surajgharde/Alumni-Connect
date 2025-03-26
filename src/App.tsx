import { ChakraProvider, Box } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Placeholder pages - we'll create these files shortly
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'
import Alumni from './pages/Alumni'
import Messages from './pages/Messages'
import NotFound from './pages/NotFound'
import ResetDatabase from './pages/ResetDatabase'
import Events from './pages/Events'

// Placeholder components - we'll create these files shortly
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'

// Import AuthProvider
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Box minH="100vh" display="flex" flexDirection="column">
            <Header />
            <Box flex="1" as="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/me" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/profile/edit" element={
                  <PrivateRoute>
                    <ProfileEdit />
                  </PrivateRoute>
                } />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/alumni" element={<Alumni />} />
                <Route path="/events" element={<Events />} />
                <Route path="/messages" element={
                  <PrivateRoute>
                    <Messages />
                  </PrivateRoute>
                } />
                <Route path="/messages/:id" element={
                  <PrivateRoute>
                    <Messages />
                  </PrivateRoute>
                } />
                <Route path="/reset" element={<ResetDatabase />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
