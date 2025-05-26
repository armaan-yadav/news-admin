import axios from "axios";
import { base_url } from "../config/config";

class NewsServices {
  constructor() {}

  getAllNews = async () => {};

  getAllCategoriesWithName = async () => {
    try {
      const { data } = await axios.get(`${base_url}/api/category/all-name`);
      return data.categories;
    } catch (error) {
      console.log(error);
    }
  };
  getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${base_url}/api/category/all`);
      return data.categories;
    } catch (error) {
      console.log(error);
    }
  };

  deleteNews = async (news_id, token) => {
    console.log(token);
    try {
      const { data } = await axios.delete(
        `${base_url}/api/news/delete/${news_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

const newsServices = new NewsServices();
export default newsServices;
