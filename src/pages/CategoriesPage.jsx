import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import newsServices from "@/services/newsServices";
import slugify from "slugify";
import CategoriesOverview from "@/components/CategoriesOverview";
import storeContext from "@/context/storeContext";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const { store } = useContext(storeContext);

  const getCategories = async () => {
    try {
      const res = await newsServices.getAllCategoriesWithName();
      setCategories(res);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAdd = async () => {
    if (!newCategory.trim()) return;

    try {
      await newsServices.addCategory(newCategory.trim(), store.token);
      toast("Category added successfully.");
      setNewCategory("");
      getCategories();
    } catch (error) {
      console.log(error);
      toast("Failed to add category.");
    }
  };

  const handleDelete = async (categoryId) => {

    try {
      await newsServices.deleteCategory(categoryId, store.token);
      toast("Category deleted.");
      getCategories();
    } catch (error) {
      toast("Failed to delete category.");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="mx-auto p-4 space-y-4">
      {/* <CategoriesOverview categories={categories} /> */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="flex items-center justify-between bg-muted p-2 rounded-md"
              >
                <span>{cat.name}</span>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(cat._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
