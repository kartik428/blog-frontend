import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useState } from "react";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setBlog } from "@/redux/blogSlice";
import { toast } from "sonner";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { API_URL } from "@/lib/api";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {blog, loading} = useSelector(store=>store.blog)

  console.log(blog);
  

  const getSelectedCategory =(value)=>{
   setCategory(value)
  }

  const createBlogHandler = async()=>{
    try {
      dispatch(setLoading(true))
      const res = await axios.post(`${API_URL}/blog`, {title, category}, {

        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true 
      })
      if (res.data.success) {
        if (!blog) {
          dispatch(setBlog([res.data.blog]))
           navigate(`/dashboard/write-blog/${res.data.blog._id}`)
           toast.success(res.data.message)
        }
        dispatch(setBlog([...blog, res.data.blog]))
       navigate(`/dashboard/write-blog/${res.data.blog._id}`)
       toast.success(res.data.message)
      }else{
        toast.error("Something went wrong")
      }
    } catch (error) {
      console.log(error);
      
    }finally{
      dispatch(setLoading(false))
    } 
   };
  return (
    <div className="p-4 md:pr-20 h-screen md:ml-[320px] pt-20">
      <Card className="md:p-10 p-4 dark:bg-gray-800 -space-y-6">
        <h1 className="text-2xl font-bold-">Let's create blog</h1>
        <p>
          {" "}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis quo
          sequi odio molestiae officia obcaecati!
        </p>
        <div className="mt-10">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              placeholder="Your blog name"
              className="bg-white dark:bg-gray-700 mt-1 "
            />
          </div>
          <div className="mt-4 mb-5">
            <Label className="mb-1">Category</Label>
            <Select onValueChange={getSelectedCategory} >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectGroup>
                <SelectContent>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Web Develoment">Web Develoment</SelectItem>
                  <SelectItem value="Digital Marketing">
                    Digital Marketing
                  </SelectItem>
                  <SelectItem value="Blogging">Blogging</SelectItem>
                  <SelectItem value="PhotoGraphy">PhotoGraphy</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                </SelectContent>
              </SelectGroup>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button disabled={loading} onClick={createBlogHandler} >
              {loading ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" />Please wait</>: "Create"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateBlog;
