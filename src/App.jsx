import './App.css'
import { Box } from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'
import Reports from './pages/Reports'
import ProtectedRoute from './components/common/ProtectedRoute'
import Layout from './components/common/Layout'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import ProductsPage from './pages/products/ProductsPage'
import TransactionsPage from './pages/transactions/TransactionsPage'

function App() {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Routes>
          <Route path='/login' element={<Login />} />

          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/dashboard/products' element={<ProductsPage />} />
            <Route path='/dashboard/transactions' element={<TransactionsPage />} />
            <Route path='/dashboard/reports' element={<Reports />} />
            <Route path='/dashboard/analysis' element={<Reports />} />
          </Route>

          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />
          {/* <Route
            path="*"
            element={<Navigate to="/dashboard/dashboard" replace />}
          /> */}
        </Routes>
      </Box>
    </>
  )
}

export default App
