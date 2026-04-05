import React from "react";
import { Button } from "./ui/button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { Search, User } from "lucide-react";
import { FaMoon, FaRegComment, FaSun, FaRegEdit  } from "react-icons/fa";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "../redux/authSlice";
import { LuChartColumnIncreasing } from "react-icons/lu";
import userLogo from "../assets/user.jpg"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const Navbar = () => {
  // const user = false; //dummy user authentication status
  const { user } = useSelector((store) => store.auth);
  const { theme } = useSelector((store) => store.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    //logout logic here
    try {
      const res = await axios.get("https://your-backend.onrender.com/api/v1/users/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/");
        dispatch(setUser(null));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error logging out");
    }
  };
  return (
    <>
      <div className="py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-2 bg-white z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0 ">
          {/* logo section */}
          <div className="flex gap-7 items-center ">
            <Link to={"/"}>
              <div className="flex gap-2 items-center ">
                <img
                  src={Logo}
                  alt=""
                  className="w-9 h-9 md:w-1o dark:invert"
                />
                <h1 className="font-bold text-gray-900 dark:invert text-3xl md:text-4xl">
                  BloGers
                </h1>
              </div>
            </Link>
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-[240px] p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 
              bg-white dark:bg-gray-900 
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500 
               focus:ring-2 outline-none transition"
              />
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2 
             bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 
             text-gray-600 dark:text-gray-300 
             rounded-md transition"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
          {/* nav section */}
          <nav className="flex md:gap-7 gap-4 items-center">
            <ul className="hidden md:flex gap-7 items-center text-xl font-semibold text-gray-900 dark:invert">
              <NavLink to={"/"} className="cursor-pointer">
                <li className="hover:underline" >Home</li>
              </NavLink>
              <NavLink to={"/blogs"} className={`cursor-pointer`}>
                <li className="hover:underline" >Blogs</li>
              </NavLink>
              <NavLink to={"/about"} className={`cursor-pointer`}>
                <li className="hover:underline" >About</li>
              </NavLink>
            </ul>
            <div className="flex">
              <Button onClick={() => dispatch(toggleTheme())} className="">
                {theme === "light" ? (
                  <FaMoon className="w-5 h-5" />
                ) : (
                  <FaSun size={20} />
                )}
              </Button>
              {user ? (
                <div className="ml-7 flex gap-3 items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar>
                        <AvatarImage
                          className="h-10 w-10 rounded-full "
                          src={user?.photoUrl || userLogo}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                          <User/>
                          <span>Profile</span> 
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/dashboard/your-blog")}>
                       <LuChartColumnIncreasing />
                          Your Blogs
                          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/dashboard/comments")}>
                        
                          <FaRegComment />
                          Comments
                          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                        </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/dashboard/write-blog")}>
                          <FaRegEdit />
                          Write Blog
                          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                       <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logoutHandler}> 
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button className="cursor-pointer " onClick={logoutHandler}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="ml-7 md:flex gap-2 ">
                  <Link to={"/login"}>
                    <Button className="cursor-pointer ">Login</Button>
                  </Link>
                  <Link className="hidden md:block" to={"/signup"}>
                    <Button className="cursor-pointer ">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
