import React, { useState, useRef } from "react";

// Mock Lucide Icon (UploadCloud) - In a real shadcn setup, you'd import this from lucide-react
const UploadCloudIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

// --- Mock Shadcn/UI Components ---
// These are simplified versions. Real shadcn/ui components are more complex.

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

// const CardFooter = ({ children, className = '' }) => ( // Not used directly by Profile in this version
//   <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
// );

const Avatar = ({ children, className = "" }) => (
  <div
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
  >
    {children}
  </div>
);

const AvatarImage = ({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    className={`aspect-square h-full w-full ${className}`}
  />
);

const AvatarFallback = ({ children, className = "" }) => (
  <span
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-500 ${className}`}
  >
    {children}
  </span>
);

const Input = React.forwardRef(({ className = "", type, ...props }, ref) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
));

const Label = ({ children, htmlFor, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
  >
    {children}
  </label>
);

const Button = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700/90",
    destructive: "bg-red-500 text-white hover:bg-red-600/90",
    outline: "border border-gray-300 hover:bg-gray-100 hover:text-gray-800",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200/80",
    ghost: "hover:bg-gray-100 hover:text-gray-800",
    link: "underline-offset-4 hover:underline text-blue-600",
  };
  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Profile Component ---
const Profile = () => {
  // Mock user data based on the schema
  // In a real app, this would come from props or a state management store (e.g., context, Redux)
  const [userData, setUserData] = useState({
    name: "Sheikh Farid",
    email: "farid@example.com",
    role: "Education",
    image: "", // Initially no image, will use placeholder or uploaded
    isActive: true, // Not typically displayed directly
  });

  const [imagePreview, setImagePreview] = useState(userData.image || "");
  const fileInputRef = useRef(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // Good practice

  const [message, setMessage] = useState({ text: "", type: "" }); // For success/error messages

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Basic file type validation (example)
      if (!file.type.startsWith("image/")) {
        showMessage(
          "Please select a valid image file (e.g., PNG, JPG).",
          "error"
        );
        return;
      }
      // Basic file size validation (example: 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showMessage("Image size should not exceed 5MB.", "error");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // In a real app, you would then upload this file to a server
        // and update userData.image with the returned URL.
        // For now, we just update the preview.
        setUserData((prev) => ({ ...prev, image: reader.result })); // Simulate update
        showMessage("Profile image updated (preview).", "success");
      };
      reader.onerror = () => {
        showMessage("Failed to read the image file.", "error");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      showMessage("All password fields are required.", "error");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showMessage("New passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 8) {
      // Example: Stricter password validation
      showMessage("New password must be at least 8 characters long.", "error");
      return;
    }
    // Example: Add more password strength checks (e.g., uppercase, lowercase, number, symbol)
    // const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordStrengthRegex.test(newPassword)) {
    //   showMessage("Password must include uppercase, lowercase, number, and special character.", "error");
    //   return;
    // }

    // In a real app, you'd send oldPassword and newPassword to your backend
    console.log("Changing password:", { oldPassword, newPassword });
    showMessage(
      "Password change request submitted (check console).",
      "success"
    );
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000); // Clear message after 5 seconds
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "??";
    const parts = name.trim().split(" ");
    if (parts.length === 0 || parts[0] === "") return "??";
    if (parts.length === 1) return name.substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    // Removed container, mx-auto, p-4 etc. as this is now a component
    // The parent component should handle overall layout.
    <div className="font-sans w-full">
      {message.text && (
        <div
          className={`p-3 mb-4 rounded-md text-sm border ${
            message.type === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Details Card (Column 1) */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              View and update your profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32 text-4xl">
                <AvatarImage
                  src={
                    imagePreview ||
                    "https://placehold.co/128x128/E0E0E0/B0B0B0?text=No+Image"
                  }
                  alt={`${userData.name}'s profile picture`}
                  onError={(e) => {
                    e.target.onerror = null; // Prevents infinite loop if fallback also fails
                    e.target.src =
                      "https://placehold.co/128x128/E0E0E0/B0B0B0?text=Error";
                  }}
                />
                <AvatarFallback>{getInitials(userData.name)}</AvatarFallback>
              </Avatar>
              <input
                type="file"
                id="profilePicture"
                className="hidden"
                accept="image/png, image/jpeg, image/gif" // More specific accept types
                onChange={handleImageChange}
                ref={fileInputRef}
                aria-labelledby="profilePictureLabel"
              />
              <Button
                variant="outline"
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
                id="profilePictureLabel"
              >
                <UploadCloudIcon className="mr-2 h-4 w-4" /> Change Photo
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-gray-600">
                  Name
                </Label>
                <Input
                  id="name"
                  value={userData.name}
                  readOnly
                  className="mt-1 bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-600">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  readOnly
                  className="mt-1 bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-gray-600">
                  Role
                </Label>
                <Input
                  id="role"
                  value={userData.role}
                  readOnly
                  className="mt-1 bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card (Column 2) */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your account password. Ensure it's strong and unique.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  aria-required="true"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password (min. 8 characters)"
                  required
                  aria-required="true"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  aria-required="true"
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
