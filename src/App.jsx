// App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setBlog } from "@/redux/blogSlice";

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
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const res = await axios.get(
          `https://your-backend.onrender.com/api/v1/blog/get-all-blogs`, // ✅ all users blogs
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllBlogs();
  }, []);

  return <RouterProvider router={router} />;
}

const App = () => {
  return <AppInit />;
};

export default App;