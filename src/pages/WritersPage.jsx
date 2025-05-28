import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { Link } from "react-router-dom";
import { base_url } from "../config/config";
import storeContext from "../context/storeContext";
import { toast } from "sonner";

const Writers = () => {
  const { store } = useContext(storeContext);
  const [writers, setWriters] = useState([]);
  const [writerStats, setWriterStats] = useState([]);

  const get_writers = async () => {
    try {
      const { data } = await axios.get(`${base_url}/api/news/writers`, {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      setWriters(data.writers);
    } catch (error) {
      console.error(error);
    }
  };

  const get_writers_stats = async () => {
    try {
      const { data } = await axios.get(
        `${base_url}/api/news/writers/news-count`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      setWriterStats(data.stats);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleActive = async (writerId, currentStatus) => {
    const updatedStatus = !currentStatus;
    try {
      setWriters((prev) =>
        prev.map((writer) =>
          writer._id === writerId
            ? { ...writer, isActive: updatedStatus }
            : writer
        )
      );

      await axios.put(
        `${base_url}/api/news/writers/edit/${writerId}`,
        { isActive: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      toast(
        `Writer ${updatedStatus ? "activated" : "deactivated"} successfully!`
      );
    } catch (error) {
      console.error("Failed to update active status", error);
      toast("Failed to toggle writer status.");
      setWriters((prev) =>
        prev.map((writer) =>
          writer._id === writerId
            ? { ...writer, isActive: currentStatus }
            : writer
        )
      );
    }
  };

  useEffect(() => {
    get_writers();
    get_writers_stats();
  }, []);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Writers</CardTitle>
          <Link to="/dashboard/writer/add">
            <Button>Add Writer</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {writers.map((r, i) => (
                <TableRow key={r._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.role}</TableCell>
                  <TableCell>
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src="https://res.cloudinary.com/dpj4vsqbo/image/upload/v1696952625/news/g7ihrhbxqdg5luzxtd9y.webp"
                      alt={r.name}
                    />
                  </TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleActive(r._id, r.isActive)}
                      className="text-xl"
                      title={r.isActive ? "Deactivate" : "Activate"}
                    >
                      {r.isActive ? (
                        <FaToggleOn className="text-green-500" />
                      ) : (
                        <FaToggleOff className="text-gray-400" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Link to={`/dashboard/writers/manage/${r._id}`}>
                      <Button variant="outline" size="icon">
                        <CiMenuKebab />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Writer News Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Writer Name</TableHead>
                <TableHead>Active News</TableHead>
                <TableHead>Inactive News</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {writerStats.map((stat, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{stat.writerName}</TableCell>
                  <TableCell className="text-green-600">
                    {stat.activeNewsCount}
                  </TableCell>
                  <TableCell className="text-red-600">
                    {stat.inactiveNewsCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Writers;
