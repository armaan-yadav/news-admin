import axios from "axios";
import { convert } from "html-to-text";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { base_url } from "../config/config";
import storeContext from "../context/storeContext";
import ActionButton from "./ActionButton";

const NewsContent = () => {
  const { store } = useContext(storeContext);
  const [news, setNews] = useState([]);
  const [all_news, set_all_news] = useState([]);
  const [parPage, setParPage] = useState(5);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); // Added loading state

  const get_news = async () => {
    console.log(store.token);
    setLoading(true); // Set loading to true when starting fetch
    try {
      const { data } = await axios.get(`${base_url}/api/news`, {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      set_all_news(data.news);
      setNews(data.news);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch news");
    } finally {
      setLoading(false); // Set loading to false when fetch completes
    }
  };

  useEffect(() => {
    get_news();
  }, []);

  useEffect(() => {
    if (news.length > 0) {
      const calculate_page = Math.ceil(news.length / parPage);
      setPages(calculate_page);
    }
  }, [news, parPage]);

  const type_filter = (e) => {
    if (e.target.value === "") {
      setNews(all_news);
      setPage(1);
      setParPage(5);
    } else {
      const tempNews = all_news.filter((n) => n.status === e.target.value);
      setNews(tempNews);
      setPage(1);
      setParPage(5);
    }
  };

  const serach_news = (e) => {
    const tempNews = all_news.filter(
      (n) => n.title.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1
    );
    setNews(tempNews);
    setPage(1);
    setParPage(5);
  };

  const [res, set_res] = useState({
    id: "",
    loader: false,
  });

  const update_status = async (status, news_id) => {
    try {
      set_res({
        id: news_id,
        loader: true,
      });
      const { data } = await axios.put(
        `${base_url}/api/news/status-update/${news_id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      set_res({
        id: "",
        loader: false,
      });
      toast.success(data.message);
      get_news();
    } catch (error) {
      set_res({
        id: "",
        loader: false,
      });
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="text-gray-600 text-sm">Loading news...</p>
      </div>
    </div>
  );

  // Loading skeleton for table rows
  const LoadingSkeleton = () => (
    <tr className="bg-white border-b animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-10 h-10 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="px-4 py-3 flex gap-x-3">
        <select
          onChange={type_filter}
          disabled={loading} // Disable filters while loading
          name=""
          className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
          id=""
        >
          <option value="">---select type---</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="deactive">Deactive</option>
        </select>
        <input
          onChange={serach_news}
          disabled={loading} // Disable search while loading
          type="text"
          placeholder="search news"
          className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="relative overflow-x-auto p-4">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-7 py-3">No</th>
              <th className="px-7 py-3">Title</th>
              <th className="px-7 py-3">Image</th>
              <th className="px-7 py-3">Category</th>
              <th className="px-7 py-3">Description</th>
              <th className="px-7 py-3">Date</th>
              <th className="px-7 py-3">Status</th>
              <th className="px-7 py-3">Active</th>
              <th className="px-7 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Show loading skeleton rows
              Array.from({ length: parPage }).map((_, i) => (
                <LoadingSkeleton key={i} />
              ))
            ) : news.length > 0 ? (
              news.slice((page - 1) * parPage, page * parPage).map((n, i) => (
                <tr key={i} className="bg-white border-b">
                  <td className="px-6 py-4">{i + 1}</td>
                  <td className="px-6 py-4">{n.title.slice(0, 15)}...</td>
                  <td className="px-6 py-4">
                    <img className="w-[40px] h-[40px]" src={n.image} alt="" />
                  </td>
                  <td className="px-6 py-4">{n.category}</td>
                  <td className="px-6 py-4">
                    {convert(n.description).slice(0, 15)}...
                  </td>
                  <td className="px-6 py-4">{n.date}</td>
                  {store?.userInfo?.role === "admin" ? (
                    <td className="px-6 py-4">
                      {n.status === "pending" && (
                        <span
                          onClick={() => update_status("active", n._id)}
                          className="px-2 py-[2px] bg-blue-100 text-blue-800 rounded-lg text-xs cursor-pointer"
                        >
                          {res.loader && res.id === n._id
                            ? "Loading..."
                            : n.status}
                        </span>
                      )}

                      {n.status === "active" && (
                        <span
                          onClick={() => update_status("deactive", n._id)}
                          className="px-2 py-[2px] bg-green-100 text-green-800 rounded-lg text-xs cursor-pointer"
                        >
                          {res.loader && res.id === n._id
                            ? "Loading..."
                            : n.status}
                        </span>
                      )}
                      {n.status === "deactive" && (
                        <span
                          onClick={() => update_status("active", n._id)}
                          className="px-2 py-[2px] bg-red-100 text-red-800 rounded-lg text-xs cursor-pointer"
                        >
                          {res.loader && res.id === n._id
                            ? "Loading..."
                            : n.status}
                        </span>
                      )}
                    </td>
                  ) : (
                    <td className="px-6 py-4">
                      {n.status === "pending" && (
                        <span className="px-2 py-[2px] bg-blue-100 text-blue-800 rounded-lg text-xs cursor-pointer">
                          {n.status}
                        </span>
                      )}
                      {n.status === "active" && (
                        <span className="px-2 py-[2px] bg-green-100 text-green-800 rounded-lg text-xs cursor-pointer">
                          {n.status}
                        </span>
                      )}
                      {n.status === "deactive" && (
                        <span className="px-2 py-[2px] bg-red-100 text-red-800 rounded-lg text-xs cursor-pointer">
                          {n.status}
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex justify-start items-center gap-x-4 text-white">
                      <Link className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50">
                        <FaEye />
                      </Link>
                      {store?.userInfo?.role === "writer" && (
                        <>
                          <Link
                            to={`/dashboard/news/edit/${n._id}`}
                            className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                          >
                            <FaEdit />
                          </Link>
                          <div className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50">
                            <FaTrash />
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="flex items-center justify-center h-full px-6 py-4">
                    <ActionButton newsId={n._id} token={store.token} />
                  </td>
                </tr>
              ))
            ) : (
              // Show empty state when no news found
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg">No news found</p>
                    <p className="text-sm">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end px-10 gap-x-3 text-slate-600">
        <div className="flex gap-x-3 justify-center items-center">
          <p className="px-4 py-3 font-semibold text-sm">News par Page</p>
          <select
            value={parPage}
            onChange={(e) => {
              setParPage(parseInt(e.target.value));
              setPage(1);
            }}
            disabled={loading}
            name="category"
            id="category"
            className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <p className="px-6 py-3 font-semibold text-sm">
          {loading
            ? "Loading..."
            : `${(page - 1) * parPage + 1}/${news.length} - of ${pages}`}
        </p>
        <div className="flex items-center gap-x-3">
          <IoIosArrowBack
            onClick={() => {
              if (page > 1 && !loading) setPage(page - 1);
            }}
            className={`w-5 h-5 cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
          <IoIosArrowForward
            onClick={() => {
              if (page < pages && !loading) setPage(page + 1);
            }}
            className={`w-5 h-5 cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsContent;
