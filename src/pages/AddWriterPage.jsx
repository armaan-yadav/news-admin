import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { base_url } from "../config/config";
import storeContext from "../context/storeContext";

import { Input } from "../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

const AddWriter = () => {
  const navigate = useNavigate();
  const { store } = useContext(storeContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "writer",
  });

  const [loader, setLoader] = useState(false);

  const inputHandler = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const { data } = await axios.post(
        `${base_url}/api/news/writer/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      setLoader(false);
      toast.success(data.message);
      navigate("/dashboard/writers");
    } catch (error) {
      setLoader(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-md shadow-md p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Add Writer</h2>
        <Link
          to="/dashboard/writers"
          className="text-purple-600 hover:text-purple-800 font-medium"
        >
          View Writers
        </Link>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter name"
              required
              value={formData.name}
              onChange={(e) => inputHandler("name")(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              required
              value={formData.email}
              onChange={(e) => inputHandler("email")(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              required
              value={formData.password}
              onChange={(e) => inputHandler("password")(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={inputHandler("role")}
              defaultValue="writer"
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="writer">Writer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" disabled={loader} className="w-full">
          {loader ? "Adding..." : "Add Writer"}
        </Button>
      </form>
    </div>
  );
};

export default AddWriter;
