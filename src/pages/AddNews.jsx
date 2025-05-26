import axios from "axios";
import JoditEditor from "jodit-react";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdCloudUpload } from "react-icons/md";
import { Link } from "react-router-dom";
import { base_url } from "../config/config";
import storeContext from "../context/storeContext";
import Gallery from "../components/Gallery";
import newsServices from "../services/newsServices";
import { Dropdown } from "primereact/dropdown";

const AddNews = () => {
  const { store } = useContext(storeContext);

  const [show, setShow] = useState(false);
  const editor = useRef(null);

  const [title, setTitle] = useState("i am title");
  const [subTitle, setSubTitle] = useState("i am sbtitle");
  const [image, setImage] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("something");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const imageHandle = (e) => {
    const { files } = e.target;

    if (files.length > 0) {
      setImg(URL.createObjectURL(files[0]));
      setImage(files[0]);
    }
  };
  const [loader, setLoader] = useState(false);

  const uploadNews = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("category", currentCategory);

    try {
      setLoader(true);
      console.log("Form Data:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      const { data } = await axios.post(`${base_url}/api/news/add`, formData, {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      setLoader(false);
      console.log(data);
      toast.success(data.message);
    } catch (error) {
      setLoader(false);
      toast.success(error.response.data.message);
    }
  };
  const [images, setImages] = useState([]);

  const [imagesLoader, setImagesLoader] = useState(false);

  const imageHandler = async (e) => {
    console.log("images);");
    const files = e.target.files;
    try {
      const formData = new FormData();

      setImagesLoader(true);

      const { data } = await axios.post(
        `${base_url}/api/images/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      setImagesLoader(false);
      console.log(data);
      setImages([...images, data.images]);
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      setImagesLoader(false);
      toast.error(error.response.data.message);
    }
  };

  const getCategories = async () => {
    const res = await newsServices.getAllCategoriesWithName();
    setCategories(res);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="bg-white rounded-md">
      <div className="flex justify-between p-4">
        <h2 className="text-xl font-medium">Add News</h2>
        <Link
          className="px-3 py-[6px] bg-purple-500 rounded-sm text-white hover:bg-purple-600"
          to="/dashboard/news"
        >
          News
        </Link>
      </div>

      <div className="p-4">
        <form onSubmit={uploadNews}>
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
              type="subTitle"
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
                required
                name="image"
                onChange={imageHandle}
                className="hidden"
                type="file"
                id="img"
              />
            </div>
          </div>
          {/* CATEGORY */}
          <Dropdown
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.value)}
            options={categories}
            style={{ width: "100%", border: "1px solid #ccc" }}
            optionLabel="category"
            placeholder="Select a Category"
            className="w-full md:w-14rem"
          />
          {/* DESCIRPTION */}
          <div className="flex flex-col gap-y-2 mb-6">
            <div className="flex justify-start items-center gap-x-2">
              <h2>Description</h2>
              <div onClick={() => setShow(true)}>
                <span className="text-2xl cursor-pointer">
                  <MdCloudUpload />
                </span>
              </div>
            </div>
            <div>
              <JoditEditor
                ref={editor}
                value={description}
                tabIndex={1}
                onBlur={(value) => setDescription(value)}
                config={{
                  readonly: false,
                  height: 400,
                  uploader: {
                    insertImageAsBase64URI: true, // ✅ Inserts as base64. Set false if uploading to server
                    // If you want to upload to server:
                    // url: "https://your-api.com/upload",
                    // format: "json",
                    // method: "POST",
                    // headers: { Authorization: "Bearer <token>" },
                  },
                  buttons: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "ul",
                    "ol",
                    "outdent",
                    "indent",
                    "font",
                    "fontsize",
                    "paragraph",
                    "image",
                    "file",
                    "video",
                    "table",
                    "link",
                    "align",
                    "undo",
                    "redo",
                    "hr",
                    "eraser",
                    "copyformat",
                    "source",
                  ],
                  image: {
                    editSrc: true,
                    preview: true,
                    resize: true,
                    width: "300px",
                    height: "auto",
                  },
                }}
                onChange={() => {}}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-4">
            <button
              disabled={loader}
              className="px-3 py-[6px] bg-purple-500 rounded-sm text-white hover:bg-purple-600"
            >
              {" "}
              {loader ? "loading..." : "Add News"}
            </button>
          </div>
        </form>
      </div>
      <input
        onChange={imageHandler}
        type="file"
        multiple
        name="images"
        id="images"
        className="hidden"
      />
      {/* {show && <Gallery setShow={setShow} images={images} />} */}
    </div>
  );
};

export default AddNews;
