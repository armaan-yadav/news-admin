import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { base_url } from "../config/config";
import storeContext from "../context/storeContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  Clock,
  MoreHorizontal,
  Newspaper,
  PlusCircle,
  Tag,
} from "lucide-react"; // Example icons

const AdminIndex = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add more state for other insights: categories, users, etc.
  // const [categories, setCategories] = useState([]);

  const { store } = useContext(storeContext);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${base_url}/api/news`, {
        // Ensure base_url is correctly defined
        headers: { Authorization: `Bearer ${store.token}` },
      });

      setNews(response.data.news || []); // Fallback to empty array if news is undefined
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.message || "Failed to fetch news.");
      setNews([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Dummy data for other insights until API is ready
  const totalCategories = 5; // Replace with actual data
  const pendingReviewCount = news.filter((n) => n.status === "pending").length; // Assuming news items have a 'status'
  const publishedNewsCount = news.filter(
    (n) => n.status === "published"
  ).length;

  useEffect(() => {
    if (store.token) {
      // Only fetch if token exists
      fetchNews();
      // fetchCategories(); // Example for fetching other data
    }
  }, [store.token]); // Re-fetch if token changes

  if (!store.token) {
    return (
      <div className="p-4">Please log in to view the admin dashboard.</div>
    );
  }

  if (loading) {
    return <div className="p-4">Loading dashboard data...</div>; // Add a spinner or skeleton loader
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Article
        </Button>
      </div>

      {/* Overall Insights */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Overall Insights</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total News</CardTitle>
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{news.length}</div>
              <p className="text-xs text-muted-foreground">
                articles in the system
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Published News
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedNewsCount}</div>
              <p className="text-xs text-muted-foreground">currently live</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReviewCount}</div>
              <p className="text-xs text-muted-foreground">awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Categories
              </CardTitle>
              <Tag className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCategories}</div>
              <p className="text-xs text-muted-foreground">across all news</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* News Performance & Engagement (Charts would go here) */}

      <section>
        <h2 className="text-xl font-semibold mb-3">News Performance</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Publishing Trends</CardTitle>
              <CardDescription>
                News articles published over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Chart Component (e.g., Recharts) */}
              <div className="h-[300px] bg-gray-100 flex items-center justify-center">
                Chart Placeholder
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Popular Categories</CardTitle>
              <CardDescription>
                Distribution of news by category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Chart Component */}
              <div className="h-[300px] bg-gray-100 flex items-center justify-center">
                Chart Placeholder
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent News Activity */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Recent News Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>Latest Articles</CardTitle>
            <CardDescription>
              A quick look at the most recent news submissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {news.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.slice(0, 5).map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium truncate max-w-xs">
                        {item.title || "Untitled"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "published" ? "default" : "outline"
                          }
                        >
                          {item.status || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.category.name || "Uncategorized"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No news articles found.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminIndex;

// import axios from "axios";
// import { useContext, useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import {
//   Newspaper,
//   Eye,
//   Users,
//   TrendingUp,
//   Calendar,
//   Edit,
//   Trash2,
//   Plus,
//   Search,
//   Filter,
//   MoreHorizontal,
// } from "lucide-react";

// // Mock data for demonstration - replace with your actual API calls
// const mockStats = {
//   totalNews: 245,
//   totalViews: 125430,
//   totalUsers: 8934,
//   monthlyGrowth: 12.5,
// };

// const mockRecentNews = [
//   {
//     id: 1,
//     title: "Breaking: Major Tech Announcement",
//     category: "Technology",
//     views: 2450,
//     status: "published",
//     date: "2024-01-15",
//   },
//   {
//     id: 2,
//     title: "Sports Update: Championship Results",
//     category: "Sports",
//     views: 1890,
//     status: "published",
//     date: "2024-01-14",
//   },
//   {
//     id: 3,
//     title: "Economic Forecast for 2024",
//     category: "Business",
//     views: 3200,
//     status: "draft",
//     date: "2024-01-13",
//   },
//   {
//     id: 4,
//     title: "Health Tips for Winter Season",
//     category: "Health",
//     views: 1650,
//     status: "published",
//     date: "2024-01-12",
//   },
//   {
//     id: 5,
//     title: "Climate Change Report Released",
//     category: "Environment",
//     views: 2100,
//     status: "published",
//     date: "2024-01-11",
//   },
// ];

// const mockCategoryData = [
//   { name: "Technology", value: 45, color: "#8884d8" },
//   { name: "Sports", value: 30, color: "#82ca9d" },
//   { name: "Business", value: 25, color: "#ffc658" },
//   { name: "Health", value: 35, color: "#ff7300" },
//   { name: "Environment", value: 20, color: "#00ff88" },
// ];

// const mockMonthlyData = [
//   { month: "Jan", articles: 45, views: 12000 },
//   { month: "Feb", articles: 52, views: 14500 },
//   { month: "Mar", articles: 48, views: 13200 },
//   { month: "Apr", articles: 61, views: 16800 },
//   { month: "May", articles: 55, views: 15600 },
//   { month: "Jun", articles: 67, views: 18900 },
// ];

// const AdminIndex = () => {
//   const [news, setNews] = useState([]);
//   const [stats, setStats] = useState(mockStats);
//   const [loading, setLoading] = useState(true);

//   // Your existing API call - keeping it intact
//   const fetchNews = async () => {
//     try {
//       // Uncomment and use your actual API
//       // const data = await axios.get(`${base_url}/api/news`, {
//       //   headers: { Authorization: `Bearer ${store.token}` },
//       // });
//       // setNews(data.data.news);

//       // Using mock data for now
//       setNews(mockRecentNews);
//       setLoading(false);
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNews();
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "published":
//         return "bg-green-100 text-green-800";
//       case "draft":
//         return "bg-yellow-100 text-yellow-800";
//       case "archived":
//         return "bg-gray-100 text-gray-800";
//       default:
//         return "bg-blue-100 text-blue-800";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               Admin Dashboard
//             </h1>
//             <p className="text-gray-600">Manage your news portal efficiently</p>
//           </div>
//           <Button className="flex items-center gap-2">
//             <Plus className="w-4 h-4" />
//             Create Article
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Total Articles
//               </CardTitle>
//               <Newspaper className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.totalNews}</div>
//               <p className="text-xs text-muted-foreground">
//                 +12% from last month
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Views</CardTitle>
//               <Eye className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {stats.totalViews.toLocaleString()}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 +8.5% from last month
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Active Users
//               </CardTitle>
//               <Users className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {stats.totalUsers.toLocaleString()}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 +15.2% from last month
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
//               <TrendingUp className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.monthlyGrowth}%</div>
//               <p className="text-xs text-muted-foreground">Monthly average</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Monthly Performance */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Monthly Performance</CardTitle>
//               <CardDescription>
//                 Articles published and views over time
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={mockMonthlyData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="articles"
//                     stroke="#8884d8"
//                     strokeWidth={2}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="views"
//                     stroke="#82ca9d"
//                     strokeWidth={2}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           {/* Category Distribution */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Content by Category</CardTitle>
//               <CardDescription>
//                 Distribution of articles across categories
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={mockCategoryData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, percent }) =>
//                       `${name} ${(percent * 100).toFixed(0)}%`
//                     }
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {mockCategoryData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Content Management */}
//         <Tabs defaultValue="recent" className="space-y-4">
//           <TabsList>
//             <TabsTrigger value="recent">Recent Articles</TabsTrigger>
//             <TabsTrigger value="popular">Popular Articles</TabsTrigger>
//             <TabsTrigger value="drafts">Drafts</TabsTrigger>
//           </TabsList>

//           <TabsContent value="recent" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <CardTitle>Recent Articles</CardTitle>
//                     <CardDescription>
//                       Manage your latest content
//                     </CardDescription>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Button variant="outline" size="sm">
//                       <Filter className="w-4 h-4 mr-2" />
//                       Filter
//                     </Button>
//                     <Button variant="outline" size="sm">
//                       <Search className="w-4 h-4 mr-2" />
//                       Search
//                     </Button>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {news.map((article) => (
//                     <div
//                       key={article.id}
//                       className="flex items-center justify-between p-4 border rounded-lg"
//                     >
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-lg">
//                           {article.title}
//                         </h3>
//                         <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
//                           <span className="flex items-center gap-1">
//                             <Calendar className="w-4 h-4" />
//                             {new Date(article.date).toLocaleDateString()}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Eye className="w-4 h-4" />
//                             {article.views.toLocaleString()} views
//                           </span>
//                           <Badge variant="secondary">{article.category}</Badge>
//                           <Badge className={getStatusColor(article.status)}>
//                             {article.status}
//                           </Badge>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Button variant="outline" size="sm">
//                           <Edit className="w-4 h-4" />
//                         </Button>
//                         <Button variant="outline" size="sm">
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                         <Button variant="outline" size="sm">
//                           <MoreHorizontal className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="popular">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Popular Articles</CardTitle>
//                 <CardDescription>Your most viewed content</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-center text-gray-500 py-8">
//                   Popular articles will be displayed here
//                 </p>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="drafts">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Draft Articles</CardTitle>
//                 <CardDescription>
//                   Unpublished content waiting for review
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-center text-gray-500 py-8">
//                   Draft articles will be displayed here
//                 </p>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default AdminIndex;
