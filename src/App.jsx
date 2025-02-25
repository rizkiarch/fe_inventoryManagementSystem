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
import StocksPage from './pages/stocks/StocksPage'
import TransactionsReportsPage from './pages/reports/TransactionsReportsPage'
import StocksReportsPage from './pages/reports/StocksReportsPage'

function App() {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Routes>
          <Route path='/' element={<Login />} />

          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/dashboard/products' element={<ProductsPage />} />
            <Route path='/dashboard/transactions' element={<TransactionsPage />} />
            <Route path='/dashboard/stocks' element={<StocksPage />} />
            <Route path='/dashboard/reports/transactions' element={<TransactionsReportsPage />} />
            <Route path='/dashboard/reports/stocks' element={<StocksReportsPage />} />
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
