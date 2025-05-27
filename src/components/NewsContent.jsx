import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { base_url } from "@/config/config";
import storeContext from "@/context/storeContext";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { ChevronDown, Edit, Trash2 } from "lucide-react";
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";
import { toast } from "sonner";
import ActionButton from "./ActionButton";

// Utility function moved outside component to prevent recreation
const convertHtmlToText = (html) => {
  return html.replace(/<[^>]*>/g, "");
};

// Memoized Badge component to prevent unnecessary re-renders
const StatusBadge = memo(({ status, newsId, isClickable, onStatusChange }) => {
  const variants = {
    pending: "secondary",
    active: "default",
    deactive: "destructive",
  };

  const handleClick = useCallback(() => {
    if (!isClickable) return;

    let newStatus;
    if (status === "pending") newStatus = "active";
    else if (status === "active") newStatus = "deactive";
    else if (status === "deactive") newStatus = "active";

    onStatusChange(newStatus, newsId);
  }, [status, newsId, isClickable, onStatusChange]);

  return (
    <Badge
      variant={variants[status]}
      className={isClickable ? "cursor-pointer" : ""}
      onClick={handleClick}
    >
      {status}
    </Badge>
  );
});

// Memoized News Image component
const NewsImage = memo(({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="w-10 h-10 rounded object-cover"
    loading="lazy" // Add lazy loading for images
  />
));

// Memoized Actions component
const NewsActions = memo(({ news, isWriter, token }) => (
  <div className="flex items-center gap-2">
    {isWriter && (
      <>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </>
    )}
    <ActionButton newsId={news._id} token={token} />
  </div>
));

const NewsContent = () => {
  const { store } = useContext(storeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Server-side pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Debounced search value to prevent excessive API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Memoize user role checks
  const { isAdmin, isWriter, token } = useMemo(
    () => ({
      isAdmin: store?.userInfo?.role === "admin",
      isWriter: store?.userInfo?.role === "writer",
      token: store?.token,
    }),
    [store?.userInfo?.role, store?.token]
  );

  // Memoized status update function
  const updateStatus = useCallback(
    async (status, newsId) => {
      try {
        await axios.put(
          `${base_url}/api/news/status-update/${newsId}`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update local state
        setData((prev) =>
          prev.map((item) => (item._id === newsId ? { ...item, status } : item))
        );
        toast(`News status updated to ${status}`, { closeButton: true });
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status");
      }
    },
    [token]
  );

  // Optimized fetch function with better dependency management
  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        limit: pagination.pageSize.toString(),
      });

      // Add search filter if exists
      if (debouncedSearchTerm.trim()) {
        params.append("search", debouncedSearchTerm.trim());
      }

      // Add status filter if not 'all'
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const { data } = await axios.get(`${base_url}/api/news?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data.news);
      setData(data.news);
      setTotalItems(data.pagination.totalItems);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
    statusFilter,
    token,
  ]);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(globalFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [globalFilter]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Reset to first page when search or status filter changes
  useEffect(() => {
    if (pagination.pageIndex !== 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [debouncedSearchTerm, statusFilter]);

  // Memoized columns definition to prevent recreation on every render
  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="max-w-[200px]">
            <span className="font-medium">
              {row.getValue("title").slice(0, 30)}...
            </span>
          </div>
        ),
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => <NewsImage src={row.getValue("image")} alt="News" />,
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const category = row.getValue("category");
          const categoryName =
            typeof category === "object" && category?.name
              ? category.name
              : "N/A";

          return <Badge variant="outline">{categoryName}</Badge>;
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-[200px]">
            {convertHtmlToText(row.getValue("description")).slice(0, 50)}...
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <div>{new Date(row.getValue("date")).toLocaleDateString()}</div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const news = row.original;
          return (
            <StatusBadge
              status={news.status}
              newsId={news._id}
              isClickable={isAdmin}
              onStatusChange={updateStatus}
            />
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const news = row.original;
          return <NewsActions news={news} isWriter={isWriter} token={token} />;
        },
      },
    ],
    [isAdmin, isWriter, token, updateStatus]
  );

  // Memoized table configuration
  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  // Memoized loading skeleton
  const loadingSkeleton = useMemo(
    () => (
      <div className="w-full p-4">
        <div className="flex items-center py-4 gap-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 7 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
    []
  );

  // Memoized pagination info
  const paginationInfo = useMemo(
    () => ({
      showingFrom: pagination.pageIndex * pagination.pageSize + 1,
      showingTo: Math.min(
        (pagination.pageIndex + 1) * pagination.pageSize,
        totalItems
      ),
      currentPage: pagination.pageIndex + 1,
    }),
    [pagination.pageIndex, pagination.pageSize, totalItems]
  );

  if (loading) {
    return loadingSkeleton;
  }

  return (
    <div className="w-full p-4">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Search news..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
          disabled={loading}
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="deactive">Deactive</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <p className="text-lg">No news found</p>
                    <p className="text-sm">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 15, 20, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Showing {paginationInfo.showingFrom} to {paginationInfo.showingTo}{" "}
              of {totalItems} entries
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Page {paginationInfo.currentPage} of {totalPages}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || loading}
            >
              <span className="sr-only">Go to previous page</span>←
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || loading}
            >
              <span className="sr-only">Go to next page</span>→
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsContent;
