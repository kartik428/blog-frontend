// App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Blogs from "./pages/Blogs.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import YourBlog from "./pages/YourBlog.jsx";
import Comments from "./pages/Comments.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import UpdateBlogs from "./pages/UpdateBlogs.jsx";
import BlogView from "./pages/BlogView.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar /><Home /></>,
  },
  {
    path: "/about",
    element: <><Navbar /><About /></>,
  },
  {
    path: "/blogs",
    element: <><Navbar /><Blogs /></>,
  },
  {
    path: "/login",
    element: <><Navbar /><Login /></>,
  },
  {
    path: "/signup",
    element: <><Navbar /><Signup /></>,
  },
  {
    path: "/blogs/:blogId",
    element: <><Navbar /><BlogView /></>,
  },
  {
    path: "/dashboard",
    element: <><Navbar /><Dashboard /></>,
    children: [
      { path: "profile", element: <Profile /> },
      { path: "your-blog", element: <YourBlog /> },
      { path: "comments", element: <Comments /> },
      { path: "write-blog", element: <CreateBlog /> },
      { path: "write-blog/:blogId", element: <UpdateBlogs /> },
    ],
  },
]);

function AppInit() {
  return <RouterProvider router={router} />;
}

const App = () => {
  return <AppInit />;
};

export default App;