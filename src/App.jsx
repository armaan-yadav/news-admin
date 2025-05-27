import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { lazy, Suspense, useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import storeContext from "./context/storeContext";
import "primeicons/primeicons.css";
import TestPage from "./pages/TestPage";

// Lazy imports
const MainLayout = lazy(() => import("./layout/MainLayout"));
const AddWriter = lazy(() => import("./pages/AddWriter"));
const AdminIndex = lazy(() => import("./pages/AdminIndex"));
const AddNews = lazy(() => import("./pages/AddNews"));
const EditNews = lazy(() => import("./pages/EditNews"));
const Login = lazy(() => import("./pages/Login"));
const News = lazy(() => import("./pages/News"));
const Profile = lazy(() => import("./pages/Profile"));
const Signup = lazy(() => import("./pages/Signup"));
const Unable = lazy(() => import("./pages/Unable"));
const WriterIndex = lazy(() => import("./pages/WriterIndex"));
const Writers = lazy(() => import("./pages/Writers"));
const ProtectDashboatd = lazy(() => import("./middleware/ProtectDashboard"));
const ProtectRole = lazy(() => import("./middleware/ProtectRole"));

function App() {
  const { store } = useContext(storeContext);

  return (
    <BrowserRouter>
      <PrimeReactProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<TestPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectDashboatd />}>
              <Route path="" element={<MainLayout />}>
                <Route
                  path=""
                  element={
                    store.userInfo?.role === "admin" ? (
                      <Navigate to="/dashboard/admin" />
                    ) : (
                      // <Navigate to="/dashboard/writer" />
                      <Navigate to="/dashboard/admin" /> // todo FIXME: Set correct route
                    )
                  }
                />
                <Route path="unable-access" element={<Unable />} />
                <Route path="news" element={<News />} />
                <Route path="profile" element={<Profile />} />

                <Route path="" element={<ProtectRole role="admin" />}>
                  <Route path="admin" element={<AdminIndex />} />
                  <Route path="writer/add" element={<AddWriter />} />
                  <Route path="writers" element={<Writers />} />
                </Route>

                <Route path="" element={<ProtectRole role="writer" />}>
                  <Route path="writer" element={<WriterIndex />} />
                  <Route path="news/create" element={<AddNews />} />
                  <Route path="news/edit/:news_id" element={<EditNews />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </PrimeReactProvider>
    </BrowserRouter>
  );
}

export default App;
