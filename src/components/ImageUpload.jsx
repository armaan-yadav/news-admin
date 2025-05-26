import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "news-app"); // your preset name
    formData.append("cloud_name", "dhdshkjej"); // replace with your Cloudinary cloud name

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dhdshkjej/image/upload",
      formData
    );

    return res.data.secure_url;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
    } catch (err) {
      console.error("Upload failed", err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(imageUrl);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto"
    >
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {loading ? (
        <p>Uploading...</p>
      ) : (
        imageUrl && (
          <img src={imageUrl} alt="Uploaded" className="h-40 object-cover" />
        )
      )}
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Submit News
      </button>
    </form>
  );
};

export default ImageUpload;
