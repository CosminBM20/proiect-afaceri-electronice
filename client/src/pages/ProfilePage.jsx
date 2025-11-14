import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosAuth from "../axios/axiosAuth";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosAuth.get(`/users/${user.id}`);
        setUserData(res.data.data);
      } catch (error) {
        console.error("Failed to load user details", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUser();
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;

  if (!userData)
    return <div className="text-white p-10">Could not load user info.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-xl mx-auto rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>

        <div className="space-y-3">
          <p>
            <span className="text-slate-400">Name:</span>{" "}
            <span className="font-semibold">{userData.name}</span>
          </p>

          <p>
            <span className="text-slate-400">Email:</span>{" "}
            <span className="font-semibold">{userData.email}</span>
          </p>

          <p>
            <span className="text-slate-400">Role:</span>{" "}
            <span className="font-semibold capitalize">{user.role}</span>
          </p>

          <p>
            <span className="text-slate-400">User ID:</span>{" "}
            <span>{userData.id}</span>
          </p>
        </div>

      </div>
    </div>
  );
}
