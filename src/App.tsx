// Packages
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Components
import RequireAuth from "./components/Auth";

// Layouts
import Auth from "./layouts/Auth";
import Admin from "./layouts/Admin";
import Invoice from "./layouts/Invoice";
import Treasury from "./layouts/Treasury";

// Pages
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import RegisterPage from "./pages/Register";
import InvoicesPage from "./pages/Invoices";
import TreasuriesPage from "./pages/Treasuries";
import DeptorsPage from "./pages/Deptors";
import PaymentOffices from "./pages/PaymentOffices";
import Trusts from "./pages/Trusts";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="admin"
          element={
            <RequireAuth>
              <Admin />
            </RequireAuth>
          }
        >
          <Route path="home" element={<HomePage />} />
          <Route path="treasuries" element={<Treasury />}>
            <Route path="home" element={<TreasuriesPage />} />
            <Route path="payment-offices" element={<PaymentOffices />} />
            <Route path="trusts" element={<Trusts />} />
            <Route path="deptors/:id" element={<DeptorsPage />} />
            <Route path="" element={<TreasuriesPage />} />
          </Route>
          <Route path="invoices" element={<Invoice />}>
            <Route path="home" element={<InvoicesPage />} />
            <Route path="" element={<InvoicesPage />} />
          </Route>
          <Route path="" element={<HomePage />} />
        </Route>

        <Route path="/" element={<Auth />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="" element={<LoginPage />} />
        </Route>
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
