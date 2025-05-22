
// import LoginPage from "./modules/user/pages/LoginPage"

import { BrowserRouter } from "react-router-dom"
// import HomePage from "./modules/home/pages/HomePage"
import AppRoutes from "./routing/AppRoutes"

const App = () => {
  return (
    <>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    </>
  )
}

export default App


