import { Avatar } from "@radix-ui/react-avatar";
import { Card } from "../components/ui/card";
import React, { useState } from "react";
import { AvatarImage } from "@/components/ui/avatar";
import userLogo from "../assets/user.jpg";
import { Link } from "react-router-dom";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { API_URL } from "@/lib/api";

const Profile = () => {
  const [open, setOpen] = useState(false);

  const { user, loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    firstname: user?.firstname,
    lastname: user?.lastname,
    occupation: user?.occupation,
    bio: user?.bio,
    facebook: user?.facebook,
    linkedin: user?.linkedin || "www.linkdin.com",
    github: user?.github || "www.github.com",
    instagram: user?.instagram || "www.instagram.com",
    file: user?.photoUrl,
  });

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log(input);

    const formData = new FormData();
    formData.append("firstname", input.firstname);
    formData.append("lastname", input.lastname);
    formData.append("bio", input.bio);
    formData.append("occupation", input.occupation);
    formData.append("facebook", input.facebook);
    formData.append("linkedin", input.linkedin);
    formData.append("instagram", input.instagram);
    formData.append("github", input.github);
    if (input?.file) {
      formData.append("file", input?.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.put(
        `${API_URL}/users/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setOpen(false);
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <div className="pt-20 md:ml-[320px] md:h-screen">
      <div className="max-w-6xl mx-auto mt-8 ">
        <Card className=" flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
          {/* image section */}
          <div className="flex flex-col items-center justify-center md:w-[400px]">
            <Avatar className="w-40 h-40 ">
              <AvatarImage
                className="rounded-full"
                src={user?.photoUrl || userLogo}
              />
            </Avatar>
            <h1 className="text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3">
              {user?.occupation}
            </h1>
            <div className="flex gap-4 items-center">
              {input.facebook && (
                <Link to={input.facebook} target="_blank">
                  <FaFacebook className="w-6 h-6 text-gray-800 dark:text-gray-300" />
                </Link>
              )}
              {input.linkedin && (
                <Link to={input.linkedin} target="_blank">
                  <FaLinkedin className="w-6 h-6 dark:text-gray-300 text-gray-800" />
                </Link>
              )}
              {input.github && (
                <Link to={input.github} target="_blank">
                  <FaGithub className="w-6 h-6 dark:text-gray-300 text-gray-800" />
                </Link>
              )}
              {input.instagram && (
                <Link to={input.instagram} target="_blank">
                  <FaInstagram className="w-6 h-6 text-gray-800 dark:text-gray-300" />
                </Link>
              )}
            </div>
          </div>
          {/* info section  */}
          <div>
            <h1 className="font-bold text-center md:text-start text-4xl mb-7">
              Welcome {user?.firstname || "user"} {user?.lastname || "user"}!
            </h1>
            <p className="">
              <span className="font-semibold">
                Email : {user?.email || "example@gmail.com"}
              </span>
            </p>
            <div className="flex flex-col gap-2 items-start justify-start my-5">
              <Label className="">About Me</Label>
              <p className="border dark:border-gray-600 p-6  rounded-lg">
                {user?.bio || "Write you bio....."}
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              {/* <DialogTrigger asChild> */}
              <Button onClick={() => setOpen(true)}>Edit Profile</Button>
              {/* </DialogTrigger> */}
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex gap-2">
                    <div>
                      <Label htmlFor="name" className="text-right">
                        First Name
                      </Label>
                      <Input
                        id="firstname"
                        name="firstname"
                        value={input.firstname}
                        onChange={changeEventHandler}
                        placeholder="First Name"
                        type="text"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name" className="text-right">
                        Last Name
                      </Label>
                      <Input
                        id="lastname"
                        name="lastname"
                        value={input.lastname}
                        onChange={changeEventHandler}
                        placeholder="Last Name"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div>
                      <Label>Facebook</Label>
                      <Input
                        id="facebook"
                        name="facebook"
                        value={input.facebook}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                    <div>
                      <Label>Instagram</Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        value={input.instagram}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div>
                      <Label>Linkedin</Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={input.linkedin}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                    <div>
                      <Label>Github</Label>
                      <Input
                        id="github"
                        name="github"
                        value={input.github}
                        onChange={changeEventHandler}
                        placeholder="Enter a URL"
                        className="col-span-3 text-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="name" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="bio"
                      value={input.bio}
                      onChange={changeEventHandler}
                      name="bio"
                      placeholder="Enter a description"
                      className="col-span-3 text-gray-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name" className="text-right">
                      Picture
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      className="w-[277px]"
                      onChange={changeFileHandler}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" onClick={submitHandler}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
