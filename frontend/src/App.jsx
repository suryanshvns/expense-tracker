import { Routes,Route } from "react-router-dom"

import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import TransactionsPage from "./pages/TransactionsPage"
import LoginPage from "./pages/LoginPage"
import NotFoundPage from "./pages/NotFoundPage"
import Header from "./components/ui/Header"

function App() {
  const authUser = true;
  return (
    <>
    {authUser && <Header/>}
     <Routes>
       <Route path="/" element={<HomePage />} />
       <Route path="/login" element={<LoginPage />} />
       <Route path="/signup" element={<SignUpPage />} />
       <Route path="/transactions" element={<TransactionsPage />} />
       <Route path = "*" element={<NotFoundPage/>}/>
     </Routes>
    </>
  )
}

export default App
