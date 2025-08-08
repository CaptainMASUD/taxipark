import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Mail() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts/visible");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/all");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.filter((u) => u._id !== currentUser._id));
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchPosts();
    fetchUsers();
  }, [currentUser, navigate]);

  const handleShare = async () => {
    if (!selectedPost || selectedUsers.length === 0) {
      alert("Select a post and at least one user to share with.");
      return;
    }

    try {
      const res = await fetch("/api/posts/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: selectedPost._id,
          sharedWith: selectedUsers,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to share post");
      }

      alert("Post shared successfully!");
      setSelectedPost(null);
      setSelectedUsers([]);

      // Reload posts
      const reloadRes = await fetch("/api/posts/visible");
      const updatedPosts = await reloadRes.json();
      setPosts(updatedPosts);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Hello, {currentUser?.name || "User"}! Shared Code Posts & Mail
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <>
          <div className="mb-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              Your Posts (Owned & Shared)
            </h2>
            <ul className="space-y-4">
              {posts.map((post) => (
                <li
                  key={post._id}
                  className={`border rounded-md p-4 cursor-pointer ${
                    selectedPost?._id === post._id
                      ? "bg-blue-100 border-blue-600"
                      : "bg-white hover:bg-blue-50"
                  }`}
                  onClick={() => setSelectedPost(post)}
                >
                  <h3 className="font-semibold text-lg text-gray-900">
                    {post.title}
                  </h3>
                  <pre className="bg-gray-100 p-2 rounded text-sm font-mono overflow-auto max-h-40 whitespace-pre-wrap">
                    {post.code}
                  </pre>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(post.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Shared with:{" "}
                    {post.sharedWith.length > 0
                      ? post.sharedWith.map((u) => u.name).join(", ")
                      : "No one"}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {selectedPost && (
            <div className="max-w-4xl mx-auto border rounded p-6 bg-white shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Share Post:{" "}
                <span className="italic">{selectedPost.title}</span>
              </h2>

              <label className="block mb-2 font-medium text-gray-700">
                Select Users to Share With:
              </label>
              <select
                multiple
                value={selectedUsers}
                onChange={(e) =>
                  setSelectedUsers(
                    Array.from(e.target.selectedOptions, (opt) => opt.value)
                  )
                }
                className="w-full border rounded p-2 mb-4"
              >
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>

              <button
                onClick={handleShare}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Share Post
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
