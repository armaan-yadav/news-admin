import { base_url } from "@/config/config";
import axios from "axios";

class ImageServices {
  async uploadImage(file, token) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${base_url}/api/images/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Image uploaded:", response.data);
      return response.data;
    } catch (error) {
      console.error("Image upload failed:", error.message);
      throw error;
    }
  }
}

const imageServices = new ImageServices();
export default imageServices;
