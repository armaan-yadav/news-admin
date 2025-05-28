import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Grid2x2 } from "lucide-react";
import { useContext } from "react";
import { AiFillDashboard, AiOutlinePlus } from "react-icons/ai";
import { BiNews } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { ImProfile } from "react-icons/im";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import storeContext from "../context/storeContext";
import { MdDrafts } from "react-icons/md";

const AppSidebar = ({ ...props }) => {
  const { store, dispatch } = useContext(storeContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const logout = () => {
    localStorage.removeItem("mewsToken");
    dispatch({ type: "logout", payload: "" });
    navigate("/login");
  };

  const navData = [
    {
      title: "Admin",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard/admin",
          icon: <AiFillDashboard />,
          isActive: pathname === "/dashboard/admin",
        },
        {
          title: "Add Writer",
          url: "/dashboard/writer/add",
          icon: <AiOutlinePlus />,
          isActive: pathname === "/dashboard/writer/add",
        },
        {
          title: "Writers",
          url: "/dashboard/writers",
          icon: <FiUsers />,
          isActive: pathname === "/dashboard/writers",
        },
      ],
    },
    {
      title: "Writer",
      items: [
        {
          title: "Writer Dashboard",
          url: "/dashboard/writer",
          icon: <AiFillDashboard />,
          isActive: pathname === "/dashboard/writer",
        },
        {
          title: "Add News",
          url: "/dashboard/news/create",
          icon: <FaPlus />,
          isActive: pathname === "/dashboard/news/create",
        },
        {
          title: "My Drafts",
          url: "/dashboard/news/drafts",
          icon: <MdDrafts />,
          isActive: pathname === "/dashboard/news/drafts",
        },
      ],
    },
    {
      title: "General",
      items: [
        {
          title: "News",
        url: "/dashboard/news",
          icon: <BiNews />,
          isActive: pathname === "/dashboard/news",
        },
        {
          title: "Profile",
          url: "/dashboard/profile",
          icon: <ImProfile />,
          isActive: pathname === "/dashboard/profile",
        },
        {
          title: "Categories",
          url: "/dashboard/categories",
          icon: <Grid2x2 />,
          isActive: pathname === "/dashboard/news/categories",
        },
      ],
    },
  ];

  const getFilteredNavData = () => {
    const userRole = store.userInfo?.role;

    if (userRole === "admin") {
      return navData;
    } else if (userRole === "writer") {
      return navData.filter(
        (section) => section.title === "Writer" || section.title === "General"
      );
    } else {
      return navData.filter((section) => section.title === "General");
    }
  };

  const filteredNavData = getFilteredNavData();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex justify-center items-center p-4">
          <Link to="/">home</Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {filteredNavData.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Logout Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  className="cursor-pointer hover:bg-red-500 hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      <IoLogOutOutline />
                    </span>
                    <span>Logout</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
