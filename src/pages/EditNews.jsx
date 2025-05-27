import Editor from "@/components/Editor";
import imageServices from "@/services/imageServices";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdCloudUpload } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { base_url } from "../config/config";
import storeContext from "../context/storeContext";
import newsServices from "../services/newsServices";

const EditNews = () => {
  const { news_id } = useParams();
  const { store } = useContext(storeContext);
  const editor = useRef(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [image, setImage] = useState("");
  const [img, setImg] = useState("");
  const [old_image, set_old_image] = useState("");
  const [description, setDescription] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(false);

  const imageHandle = (e) => {
    const { files } = e.target;

    if (files.length > 0) {
      setImg(URL.createObjectURL(files[0]));
      setImage(files[0]);
    }
  };

  const updateNews = async (e) => {
    e.preventDefault();
    console.log("update news called");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("category", currentCategory);

    try {
      setLoader(true);

      if (image) {
        const { url } = await imageServices.uploadImage(image, store.token);
        formData.append("image", url);
      }
      formData.append("image", old_image);

      console.log("Form Data:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const { data } = await axios.put(
        `${base_url}/api/news/update/${news_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      setLoader(false);
      console.log(data);
      toast.success(data.message);
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.message);
    }
  };

  const getCategories = async () => {
    const res = await newsServices.getAllCategoriesWithName();
    setCategories(res);
  };

  const get_news = async () => {
    try {
      const { data } = await axios.get(`${base_url}/api/news/${news_id}`, {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      setTitle(data?.news?.title || "");
      setSubTitle(data?.news?.subTitle || "");
      setDescription(data?.news?.description || "");
      setCurrentCategory(data?.news?.category || "all");
      setImg(data?.news?.image || "");
      set_old_image(data?.news?.image || "");
    } catch (error) {
      console.log(error);
      toast.error("Failed to load news data");
    }
  };

  useEffect(() => {
    getCategories();
    get_news();
  }, [news_id]);

  return (
    <div className="bg-white rounded-md">
      <div className="flex justify-between p-4">
        <h2 className="text-xl font-medium">Edit News</h2>
        <Link
          className="px-3 py-[6px] bg-purple-500 rounded-sm text-white hover:bg-purple-600"
          to="/dashboard/news"
        >
          News
        </Link>
      </div>

      <div className="p-4">
        <form onSubmit={updateNews}>
          {/* TITLE */}
          <div className="flex flex-col gap-y-2 mb-6">
            <label
              className="text-md font-medium text-gray-600"
              htmlFor="title"
            >
              Title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="title"
              name="title"
              className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10"
              id="title"
            />
          </div>

          {/* SUBTITLE */}
          <div className="flex flex-col gap-y-2 mb-6">
            <label
              className="text-md font-medium text-gray-600"
              htmlFor="subTitle"
            >
              SubTitle
            </label>
            <input
              required
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              type="text"
              placeholder="subTitle"
              name="subTitle"
              className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10"
              id="subTitle"
            />
          </div>

          {/* THUMBNAIL IMAGE */}
          <div className="mb-6">
            <div>
              <label
                htmlFor="img"
                className={`w-full h-[240px] flex rounded text-[#404040] gap-2 justify-center items-center cursor-pointer border-2 border-dashed`}
              >
                {img ? (
                  <img src={img} className="w-full h-full" alt="image" />
                ) : (
                  <div className="flex justify-center items-center flex-col gap-y-2">
                    <span className="text-2xl">
                      <MdCloudUpload />
                    </span>
                    <span>Select Image</span>
                  </div>
                )}
              </label>
              <input
                name="image"
                onChange={imageHandle}
                className="hidden"
                type="file"
                id="img"
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div className="mb-6">
            <Dropdown
              value={currentCategory}
              onChange={(e) => setCurrentCategory(e.value)}
              options={categories}
              style={{ width: "100%", border: "1px solid #ccc" }}
              optionLabel="category"
              placeholder="Select a Category"
              className="w-full md:w-14rem"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-y-2 mb-6">
            <div className="flex justify-start items-center gap-x-2">
              <h2>Description</h2>
            </div>
            <div>
              <Editor
                editor={editor}
                description={description}
                setDescription={setDescription}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-4">
            <button
              disabled={loader}
              className="px-3 py-[6px] bg-purple-500 rounded-sm text-white hover:bg-purple-600"
            >
              {loader ? "loading..." : "Update News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNews;
