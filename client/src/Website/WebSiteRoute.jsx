import { Routes, Route } from "react-router-dom";
import Footer from "../Website/layout/Footer";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import Listings from "./pages/Listings";
import ListingDetails from "./pages/ListingDetails";
import Contact from "./pages/Contact";
import About from "./pages/About";

const WebsiteRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listingDetails/:id" element={<ListingDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
  );
};

export default WebsiteRoutes;
