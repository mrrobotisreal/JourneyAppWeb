import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./Home";
import Features from "./Features";
import About from "./About";
import Docs from "./Docs";
import NotFound404 from "./NotFound404";
import GetStarted from "./GetStarted";
import SignIn from "./SignIn";
import RequireAuth from "./routes/RequireAuth";
import AppHome from "./app/Home";
import CreateEntry from "./app/Create";
// import EditEntry from "./app/EditEntry";
// import ViewEntry from "./app/ViewEntry";
// import Settings from "./app/Settings";

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

        <Route path="/app/:userID/*" element={<RequireAuth />}>
          <Route path="home" element={<AppHome />} />
          <Route path="create" element={<CreateEntry />} />
          {/* <Route path="edit/:entryID" element={<EditEntry />} />
          <Route path="view/:entryID" element={<ViewEntry />} />
          <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
