import "./App.css";
import { Routes, Route } from "react-router";

import Home from "./pages/Home";
import MainLayouts from "./components/layouts/MainLayouts";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Forget from "./pages/Forget";
import Verify from "./pages/Verify";
import Reset from "./pages/Reset";
import Contact from "./pages/Contact";
import About from "./pages/About";
import TrackOrder from "./components/TrackOrder";
import UserDashboard from "./pages/dashboard/UserDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import VerifyEmail from "./pages/VerifyEmail";
import Settings from "./pages/dashboard/Setting";
import OrderHistory from './pages/dashboard/OrderHistory';
import OrderDetails from './pages/dashboard/OrderDetails';

import DashboardLayout from "./components/layouts/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import Products from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminLogin from "./pages/admin/AdminLogin";
import CouponList from "./pages/admin/coupons/CouponList";
import AddCoupon from "./pages/admin/coupons/AddCoupon";
import EditCoupon from "./pages/admin/coupons/EditCoupon";
import CouponRecycleBin from "./pages/admin/coupons/CouponRecycleBin";

import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminPublicRoute from "./routes/AdminPublicRoute";
import RecycleBinProducts from "./pages/admin/RecycleBinProducts";
import BulkAddProducts from "./pages/admin/BulkAddProducts";
import AdminSettings from "./components/admindashboard/AdminSettings";
import AddCategory from "./pages/admin/AddCategory";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";

import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import PaymentCancelled from "./pages/PaymentCancelled";
import CategoryList from "./pages/admin/CategoryList";
import EditCategory from "./pages/admin/EditCategory";
import Error from "./pages/Error";
import Faq from "./pages/Faq";
import Blog from "./pages/Blog";
import SingleBlog from "./pages/SingleBlog";
import AdminBlogList from "./pages/admin/AdminBlogList";
import AdminCreateBlog from "./pages/admin/AdminCreateBlog";
import AdminEditBlog from "./pages/admin/AdminEditBlog";

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC WEBSITE ================= */}
      <Route element={<MainLayouts />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/resetpassword" element={<Reset />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product-details/:slug" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<SingleBlog />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/error" element={<Error />} />

        <Route path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />

        <Route path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          } />

        <Route path="/payment/failed"
          element={
            <ProtectedRoute>
              <PaymentFailed />
            </ProtectedRoute>
          } />

        <Route path="/payment/cancelled"
          element={
            <ProtectedRoute>
              <PaymentCancelled />
            </ProtectedRoute>
          } />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-history"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-details/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ================= ADMIN LOGIN ================= */}
      <Route
        path="/admin"
        element={
          <AdminPublicRoute>
            <AdminLogin />
          </AdminPublicRoute>
        }
      />

      {/* ================= ADMIN DASHBOARD ================= */}
      <Route
        path="/admin-dashboard"
        element={
          <AdminProtectedRoute>
            <DashboardLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />

        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetails />} />

        <Route path="users" element={<AdminUsers />} />

        <Route path="analytics" element={<AdminAnalytics />} />

        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/add" element={<AddCategory />} />
        <Route path="categories/edit/:slug" element={<EditCategory />} />

        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="bulk-add-products" element={<BulkAddProducts />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="products/recycle-bin" element={<RecycleBinProducts />} />
        
        <Route path="coupons" element={<CouponList />} />
        <Route path="coupons/add" element={<AddCoupon />} />
        <Route path="coupons/edit/:id" element={<EditCoupon />} />
        <Route path="coupons/recycle-bin" element={<CouponRecycleBin />} />

        <Route path="blogs" element={<AdminBlogList />} />
        <Route path="blogs/create" element={<AdminCreateBlog />} />
        <Route path="blogs/edit/:id" element={<AdminEditBlog />} />

        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;