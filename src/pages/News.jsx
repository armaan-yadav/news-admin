import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewsContent from "../components/NewsContent";
import storeContext from "../context/storeContext";
import newsServices from "../services/newsServices";

const News = () => {
  const { store } = useContext(storeContext);
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    const res = await newsServices.getAllCategories();
    setCategories(res);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="bg-white rounded-md shadow p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">News</h2>
          <p className="text-sm text-gray-500">
            Browse and manage all news articles.
          </p>
        </div>
        <Link
          className="px-4 py-2 bg-purple-600 rounded-md text-white hover:bg-purple-700 transition"
          to="/dashboard/news/create"
        >
          + Create News
        </Link>
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-purple-700 capitalize">
                {cat.category}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {cat.count} {cat.count === 1 ? "news article" : "news articles"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* News List */}
      <NewsContent />
    </div>
  );
};

export default News;
