// client/src/components/UserList.js - Component with state management
import React, { useState, useMemo } from "react";
import { useFetch } from "../hooks/useFetch";
import UserCard from "./UserCard";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users with pagination
  const { data, loading, error, refetch } = useFetch(
    `/api/users?page=${searchTerm ? 1 : currentPage}&limit=${itemsPerPage}`
  );

  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error.message}</div>;

  return (
    <div className="user-list-container">
      <div className="controls">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <button onClick={refetch} className="refresh-btn">
          Refresh
        </button>
      </div>

      <div className="user-grid">
        {filteredUsers.map((user) => (
          <UserCard key={user._id} user={user} onUpdate={refetch} />
        ))}
      </div>

      {data && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {filteredUsers.length === 0 && (
        <div className="no-results">No users found matching "{searchTerm}"</div>
      )}
    </div>
  );
};

export default UserList;
