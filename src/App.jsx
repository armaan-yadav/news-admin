import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { lazy, Suspense, useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import storeContext from "./context/storeContext";
import CategoriesPage from "./pages/CategoriesPage";
import DraftsPage from "./pages/DraftsPage";
import ManageWriterPage from "./pages/ManageWriterPage";
import TestPage from "./pages/TestPage.jsx";

// Lazy imports
const MainLayout = lazy(() => import("./layout/MainLayout"));
const AddWriter = lazy(() => import("./pages/AddWriterPage"));
const AdminIndex = lazy(() => import("./pages/AdminIndexPage"));
const AddNews = lazy(() => import("./pages/AddNewsPage"));
const EditNews = lazy(() => import("./pages/EditNewsPage"));
const Login = lazy(() => import("./pages/LoginPage"));
const News = lazy(() => import("./pages/NewsPage"));
const Profile = lazy(() => import("./pages/ProfilePage"));
const Signup = lazy(() => import("./pages/SignupPage"));
const Unable = lazy(() => import("./pages/UnablePage"));
const WriterIndex = lazy(() => import("./pages/WriterIndexPage"));
const Writers = lazy(() => import("./pages/WritersPage"));
const ProtectDashboard = lazy(() => import("./middleware/ProtectDashboard"));
const ProtectRole = lazy(() => import("./middleware/ProtectRole"));

function App() {
  const { store } = useContext(storeContext);
  console.log(store.userInfo);

  return (
    <BrowserRouter>
      <PrimeReactProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<TestPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/dashboard" element={<ProtectDashboard />}>
              <Route path="" element={<MainLayout />}>
                <Route
                  index
                  element={
                    store.userInfo?.role === "admin" ? (
                      <Navigate to="/dashboard/admin" replace />
                    ) : (
                      <Navigate to="/dashboard/writer" replace />
                    )
                  }
                />

                {/* Admin protected routes */}
                <Route element={<ProtectRole role="admin" />}>
                  <Route path="admin" element={<AdminIndex />} />
                  <Route path="writer/add" element={<AddWriter />} />
                  <Route path="writers" element={<Writers />} />
                  <Route
                    path="writers/manage/:writer_id"
                    element={<ManageWriterPage />}
                  />
                </Route>

                <Route path="writer" element={<WriterIndex />} />
                <Route path="news/create" element={<AddNews />} />
                <Route path="news/drafts" element={<DraftsPage />} />

                <Route path="news" element={<News />} />
                <Route path="profile" element={<Profile />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="news/edit/:news_id" element={<EditNews />} />
                <Route path="unable-access" element={<Unable />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </PrimeReactProvider>
    </BrowserRouter>
  );
}

export default App;
