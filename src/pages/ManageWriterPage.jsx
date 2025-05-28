import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { base_url } from "../config/config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import storeContext from "@/context/storeContext";
import { toast } from "sonner";

const ManageWriterPage = () => {
  const { writer_id } = useParams();
  const { store } = useContext(storeContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    role: "writer",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchWriter = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${base_url}/api/news/writers/${writer_id}`,
          {
            headers: {
              Authorization: `Bearer ${store.token}`,
            },
          }
        );
        const writer = res.data.writer;
        setFormData({
          name: writer.name || "",
          password: "",
          role: writer.role || "writer",
          isActive: writer.isActive ?? true,
        });
      } catch (error) {
        console.error("Failed to fetch writer", error);
      }
      setLoading(false);
    };

    if (writer_id) fetchWriter();
  }, [writer_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      await axios.put(
        `${base_url}/api/news/writers/edit/${writer_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      toast("Writer updated successfully!");
      navigate("/dashboard/writers");
    } catch (error) {
      console.error("Error updating writer", error);
      toast("Failed to update writer.");
    }

    setSaving(false);
  };

  if (loading)
    return (
      <div className="text-center py-10 text-muted-foreground">
        Loading writer info...
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <Card className="shadow-xl border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Writer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">
                Password (leave blank to keep unchanged)
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New Password"
              />
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="writer">Writer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageWriterPage;
