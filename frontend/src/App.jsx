import { Routes, Route } from "react-router-dom";
import AuthForm from "./pages/AuthForm";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import AddBlog from "./pages/AddBlog";
import BlogPage from "./pages/BlogPage";
import VerifyUser from "./components/VerifyUser";

function App() {
  
    return (
        // <div className=" w-screen h-screen ">
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route
                        path="/"
                        element={<HomePage/>}
                    ></Route>
                    <Route
                        path="/signin"
                        element={<AuthForm type={"signin"} />}
                    ></Route>
                    <Route
                        path="/signup"
                        element={<AuthForm type={"signup"} />}
                    ></Route>
                    <Route
                        path="/add-blog"
                        element={<AddBlog />}
                    ></Route>
                    <Route
                        path="/blog/:id"
                        element={<BlogPage />}
                    ></Route>
                    <Route
                        path="/edit/:id"
                        element={<AddBlog/>}
                    ></Route>
                    <Route
                        path="/verify-email/:verificationToken"
                        element={<VerifyUser/>}
                    ></Route>
                </Route>
            </Routes>
        // </div>
    );
}

export default App;
