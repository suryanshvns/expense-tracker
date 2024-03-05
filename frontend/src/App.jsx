import { Navigate,Routes,Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import TransactionsPage from "./pages/TransactionsPage"
import LoginPage from "./pages/LoginPage"
import NotFoundPage from "./pages/NotFoundPage"
import Header from "./components/ui/Header"
import { useQuery } from "@apollo/client"
import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query';
import { Toaster } from "react-hot-toast"

function App() {
  const {loading, data, error } = useQuery(GET_AUTHENTICATED_USER);
  console.log("Loading:", loading)
  console.log("Authenticated User:", data);
  console.log("error", error);

  if(loading) return null;

  return (  
    <>
    {data?.authUser && <Header/>}
     <Routes>
       <Route path="/" element={data.authUser ? <HomePage /> : <Navigate to="/login"/>} />
       <Route path="/login" element={!data.authUser ? <LoginPage /> : <Navigate to="/"/> } />
       <Route path="/signup" element={!data.authUser ? <SignUpPage /> : <Navigate to="/"/> } />
       <Route path="/transactions/:id" element={data.authUser ? <TransactionsPage /> : <Navigate to="/login"/>} />
       <Route path = "*" element={<NotFoundPage/>}/>
     </Routes>
     <Toaster/>
    </>
  )
}

export default App
