import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NoInternet from "./NoInternet";
import Login from "./Admin/Login";
import Dashboard from "./Admin/Dashboard";
import Layout from "./Admin/Common/Layout";
import PrivateRoute from "./PrivateRoute";
import Profile from "./Admin/Profile";
import Password from "./Admin/Password";
import ContactList from "./Admin/Contactus/ContactList";
import PrivacyPolicy from "./Admin/Cms/PrivacyPolicy";
import AboutUs from "./Admin/Cms/AboutUS";
import TermsConditions from "./Admin/Cms/TermsConditions";
import UserList from "./Admin/Users/UserList";
import NotificationSend from "./Admin/Notifications/NotificationSend";
import Chat from "./Admin/Chat/Chat";
import { SocketProvider } from "./Admin/context/SocketContext";
import { ToastContainer } from "react-toastify";
import { initOffcanvasBackButtonHandler } from "./Config";
import AgentList from "./Admin/Users/AgentList";
import FaqList from "./Admin/Faqs/FaqList";
import AddFaq from "./Admin/Faqs/AddFaq";
import EditFaq from "./Admin/Faqs/EditFaq";
import ViewFaq from "./Admin/Faqs/ViewFaq";
import NewsList from "./Admin/News/NewsList";
import AddNews from "./Admin/News/AddNews";
import EditNews from "./Admin/News/EditNews";
import ViewNews from "./Admin/News/ViewNews";
import ServiceList from "./Admin/Services/ServiceList";
import AddService from "./Admin/Services/AddService";
import EditService from "./Admin/Services/EditService";
import ViewService from "./Admin/Services/ViewService";
import AgricultureList from "./Admin/AgricultureListings/AgricultureList";
// import AddAgriculture from "./Admin/AgricultureListings/AddAgriculture";
// import EditAgriculture from "./Admin/AgricultureListings/EditAgriculture";
import ViewAgriculture from "./Admin/AgricultureListings/ViewAgriculture";
import AgricultureImagesList from "./Admin/AgricultureImagesListings/AgricultureImagesList";
import ViewAgricultureImages from "./Admin/AgricultureImagesListings/ViewAgricultureImages";

//website
import WebsiteRoutes from "./Website/WebSiteRoute";

const App = () => {
  const isAuthenticated = localStorage.getItem("token");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const cleanup = initOffcanvasBackButtonHandler();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      cleanup();
    };
  }, []);

  if (!isOnline) {
    return <NoInternet />;
  }
  return (
    <>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" />
                )
              }
            /> */}
            <Route element={<Layout />}>
              <Route
                path="/dashboard"
                element={<PrivateRoute element={<Dashboard />} />}
              />
              <Route
                path="/profile"
                element={<PrivateRoute element={<Profile />} />}
              />
              <Route
                path="/password"
                element={<PrivateRoute element={<Password />} />}
              />
              <Route
                path="/userlist"
                element={<PrivateRoute element={<UserList />} />}
              />
              <Route
                path="/agentlist"
                element={<PrivateRoute element={<AgentList />} />}
              />

              <Route
                path="/newsList"
                element={<PrivateRoute element={<NewsList />} />}
              />
              <Route
                path="/addNews"
                element={<PrivateRoute element={<AddNews />} />}
              />
              <Route
                path="/editNews/:id"
                element={<PrivateRoute element={<EditNews />} />}
              />
              <Route
                path="/viewNews/:id"
                element={<PrivateRoute element={<ViewNews />} />}
              />

              <Route
                path="/serviceList"
                element={<PrivateRoute element={<ServiceList />} />}
              />
              <Route
                path="/addService"
                element={<PrivateRoute element={<AddService />} />}
              />
              <Route
                path="/editService/:id"
                element={<PrivateRoute element={<EditService />} />}
              />
              <Route
                path="/viewService/:id"
                element={<PrivateRoute element={<ViewService />} />}
              />

              <Route
                path="/agricultureImagesList"
                element={<PrivateRoute element={<AgricultureImagesList />} />}
              />
              <Route
                path="/viewAgricultureImages/:id"
                element={<PrivateRoute element={<ViewAgricultureImages />} />}
              />

              <Route
                path="/agricultureList"
                element={<PrivateRoute element={<AgricultureList />} />}
              />
              {/* <Route
                path="/addAgriculture"
                element={<PrivateRoute element={<AddAgriculture />} />}
              /> */}
              {/* <Route
                path="/editAgriculture/:id"
                element={<PrivateRoute element={<EditAgriculture />} />}
              /> */}
              <Route
                path="/viewAgriculture/:id"
                element={<PrivateRoute element={<ViewAgriculture />} />}
              />

              <Route
                path="/contactlist"
                element={<PrivateRoute element={<ContactList />} />}
              />

              <Route
                path="/faqlist"
                element={<PrivateRoute element={<FaqList />} />}
              />
              <Route
                path="/addFaq"
                element={<PrivateRoute element={<AddFaq />} />}
              />
              <Route
                path="/editFaq/:id"
                element={<PrivateRoute element={<EditFaq />} />}
              />
              <Route
                path="/viewFaq/:id"
                element={<PrivateRoute element={<ViewFaq />} />}
              />

              <Route
                path="/privacypolicy"
                element={<PrivateRoute element={<PrivacyPolicy />} />}
              />
              <Route
                path="/aboutus"
                element={<PrivateRoute element={<AboutUs />} />}
              />
              <Route
                path="/termsConditions"
                element={<PrivateRoute element={<TermsConditions />} />}
              />
              <Route
                path="/notification"
                element={<PrivateRoute element={<NotificationSend />} />}
              />
              <Route
                path="/chat"
                element={<PrivateRoute element={<Chat />} />}
              />
            </Route>

            {/*  Website Routes */}
            <Route path="/*" element={<WebsiteRoutes />} />
          </Routes>
        </Router>
      </SocketProvider>
      <ToastContainer />
    </>
  );
};

export default App;
