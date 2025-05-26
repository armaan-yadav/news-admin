import axios from "axios";
import { base_url } from "../config/config";

class NewsServices {
  constructor() {}

  getAllNews = async () => {};

  getAllCategoriesWithName = async () => {
    console.log("called");
    try {
      const { data } = await axios.get(`${base_url}/api/category/all-name`);
      console.log(data.categories);
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
}

const newsServices = new NewsServices();
export default newsServices;
