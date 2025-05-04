import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./Home";
import Features from "./Features";
import About from "./About";
import Docs from "./Docs";
import NotFound404 from "./NotFound404";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
