import { jwtDecode } from "jwt-decode";

export const decode_token = (token) => {
  if (token) {
    try {
      const decoded_token = jwtDecode(token);
      const exp = new Date(decoded_token.exp * 1000);
      if (new Date() > exp) {
        localStorage.removeItem("newsToken");
        return "";
      } else {
        return decoded_token;
      }
    } catch (error) {
      return "";
    }
  } else {
    return "";
  }
};

export const uploadImageToCloudinary = async (file) => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("cloud_name", cloudName);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return res.data.secure_url;
  } catch (error) {}
};
