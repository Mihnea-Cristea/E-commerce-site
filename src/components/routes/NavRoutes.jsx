import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";

import Index from "../Index";
import UserDashboard from "../user/UserDashboard";
import Test from "../Test";
import Account from "../Account";
import SignUp from "../user/SingUp";
import Login from "../user/Login";
import UserUpdate from "../user/UserUpdate";
import ProductDetail from "../catalog/ProductDetails";
import Err404 from "../Err404";
import { useAuth } from "../contexts/AuthContext";
import ForgotPassword from "../user/ForgotPassword";
import Catalog from "../catalog/Catalog";
import EditProducts from "../catalog/EditProducts";
import Cart from "../cart/Cart";
import EmailSender from "../emails/EmailSender";
import GDPR from "../footer/GDPR";
import TermsAndConditions from "../footer/TermsAndConditions";
import Contact from "../footer/Contact";
import Wishlist from "../wishlist/Wishlist";

export default function NavRoutes() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/home" element={<Index />} />
        {/* <Route path="/user" element={<UserDashboard />} /> */}
        <Route path="/test" element={<Test />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<Account />} />
        <Route path="/singup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gdpr" element={<GDPR />} />
        <Route
          path="/userdashboard"
          element={
            currentUser ? <UserDashboard /> : <Navigate replace to="/login" />
          }
        />
        <Route
          path="/user-update"
          element={
            currentUser ? <UserUpdate /> : <Navigate replace to="/login" />
          }
        />
        {/* Admin edit products */}
        <Route
          path="/edit-products"
          element={
            currentUser && currentUser.email === "admin@admin.com" ? (
              <EditProducts />
            ) : (
              <Navigate replace to="/catalog" />
            )
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/cart"
          element={currentUser ? <Cart /> : <Navigate replace to="/login" />}
        />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:query" element={<Catalog />} />
        <Route
          path="/catalog/category/:category_params"
          element={<Catalog />}
        />
        <Route
          path="/catalog/subcategory/:subcategory_params"
          element={<Catalog />}
        />
        <Route path="/edit-products" element={<EditProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/email" element={<EmailSender />}></Route>
        <Route path="*" element={<Err404 />} />
      </Routes>
    </Router>
  );
}
