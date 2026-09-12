import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import "./index.css";

import App from "./App.jsx";
import store from "./store.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import './i18n';
import { CurrencyProvider } from './context/CurrencyContext.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
    mutations: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />

        <AuthProvider>
          <CurrencyProvider>
            <App />
          </CurrencyProvider>
        </AuthProvider>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnHover
          newestOnTop
        />
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);