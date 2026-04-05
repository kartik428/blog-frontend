import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Card } from "@/components/ui/card";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setBlog } from "@/redux/blogSlice";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const YourBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog } = useSelector((store) => store.blog);
  console.log(blog);
  const getOwnBlog = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/blog/get-own-blogs`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setBlog(res.data.blogs));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteBlog = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/v1/blog/delete/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id);
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getOwnBlog();
  }, []);
  return (
    <div className="pb-10 pt-20 md:ml-80 h-screen">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full p-5 spax-y-2 dark:bg-gray-800">
          <Table>
            <TableCaption>A list of your recent blogs.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blog.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="flex gap-4 items-center">
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="w-20 rounded-md hidden md:block"
                    />
                    <h1 onClick={()=>navigate(`/blogs/${item._id}`)} className="hover:underline cursor-pointer">
                      {item.title}
                    </h1>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.createdAt.split("T")[0]}</TableCell>
                  <TableCell className="text-center">
                    {
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <BsThreeDotsVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/dashboard/write-blog/${item._id}`)
                              }
                            >
                              <Edit />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => deleteBlog(item._id)}
                            >
                              <Trash2 />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default YourBlog;
