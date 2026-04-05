import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/blogSlice";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { setBlog } from "@/redux/blogSlice";

const UpdateBlogs = () => {

  const editor = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.blogId;
  const { blog, loading } = useSelector((store) => store.blog);
  const selectBlog = blog.find((blog) => blog._id === id);
  const [content, setContent] = useState(selectBlog.description);
  const [publish, setPublish] = useState(false);
  const [blogData, setBlogData] = useState({
    title: selectBlog?.title,
    subtitle: selectBlog?.subtitle,
    description: content,
    category: selectBlog?.category,
  });
  const [previewThumbnail, setPreviewThumbnail] = useState(
    selectBlog?.thumbnail
  );


  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectCategory = (value) => {
    setBlogData({ ...blogData, category: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData({ ...blogData, thumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateBlogHandler = async () => {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("subtitle", blogData.subtitle);
    formData.append("description", content);
    formData.append("file", blogData.thumbnail);
    try {
      dispatch(setLoading(true));
      const res = await axios.put(
        `http://localhost:3000/api/v1/blog/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/dashboard/your-blog", { replace: true });
        console.log(blogData);

      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const togglePublishUnpublish = async (action) => {
    try {
      const res = await axios.patch(`http://localhost:3000/api/v1/blog/${id}`, {
        params: {
          action
        },
        withCredentials: true
      });
      if (res.data.success) {
        setPublish(!publish);
        toast.success(res.data.message);
        navigate('/dashboard/your-blog');
      } else {
        toast.error("Failed to update publish status");
      }
    } catch (error) {
      console.log(error);

    }
  }

  const deleteBlogHandler = async () => {
    // To be implemented
    try {
      const res = await axios.delete(`http://localhost:3000/api/v1/blog/delete/${id}`, {
        withCredentials: true
      });
      if (res.data.success) {
        const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id);
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
        navigate('/dashboard/your-blog');
      } else {
        toast.error("Failed to delete blog");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };


  return (
    <div className="p-4 md:pr-20 md:ml-80 pt-20 px-3 pb-10">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full bg-white dark:bg-gray-800 p-5 -space-y-3">
          <h1 className="text-4xl font-bold">Basic Blog Information</h1>
          <p>
            Make changes to your blogs here. Click publish when you are done
          </p>
          <div className="space-x-2">
            <Button onClick={() => togglePublishUnpublish(selectBlog.isPublished ? "false" : "true")} >
              {
                selectBlog.isPublished ? "Unpublish" : "Publish"
              }
            </Button>
            <Button onClick={deleteBlogHandler} variant="destructive">Remove blog</Button>
          </div>
          <div className="pt-10">
            <Label className="mb-1">Title</Label>
            <Input
              type="text"
              placeholder="Enter a title"
              name="title"
              value={blogData.title}
              onChange={handleChange}
              className="dark:border-gray-300"
            ></Input>
          </div>
          <div className="pt-10">
            <Label className="mb-1">Subtitle</Label>
            <Input
              type="text"
              placeholder="Enter a subtitle"
              value={blogData.subtitle}
              onChange={handleChange}
              name="subtitle"
              className="dark:border-gray-300"
            ></Input>
          </div>
          <div>
            <Label className="mb-1">Description</Label>
            {/* Audit editor work // npm i jodit-react */}
            <JoditEditor
              ref={editor}
              className="jodit_toolbar"
              value={blogData.description}
              onChange={(newContent) => setContent(newContent)}
            />
          </div>
          <div>
            <Label className="mb-1">Category</Label>
            <Select
              onValueChange={selectCategory}
              className="dark: border-gray-300"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectGroup>
                <SelectContent>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Web Development">
                    Web Development
                  </SelectItem>
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
          <div>
            <Label className="mb-1">Thumbnail</Label>
            <Input
              type="file"
              id="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit dark:border-gray-300"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2"
                alt="Blog Thumbnail"
              />
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={updateBlogHandler} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </Card>
      </div >
    </div >
  );
};

export default UpdateBlogs;
