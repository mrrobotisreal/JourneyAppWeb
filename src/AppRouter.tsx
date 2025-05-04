import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./Home";
import Features from "./Features";
import About from "./About";
import Docs from "./Docs";
import NotFound404 from "./NotFound404";
import GetStarted from "./GetStarted";
import SignIn from "./SignIn";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
