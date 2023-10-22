import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Member.css";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import SearchBox from "./SearchBox";
import Pagination from "./Pagination";

const Member = () => {
  const [memberData, setMemberData] = useState(
    JSON.parse(localStorage.getItem("memberData")) || []
  );
  const [selectAllChecked, setSelectAllChecked] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchResult, setSearchResult] = useState("");
  const [editMemberId, setEditMemberId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const memberPerPage = 10;
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const jsonData = response.data;
      setMemberData(jsonData);

      localStorage.setItem("memberData", JSON.stringify(jsonData));
    } catch (error) {
      console.error("error:", error);
    }
  };

  useEffect(() => {
    const localStorageMemberData = JSON.parse(
      localStorage.getItem("memberData")
    );
    if (localStorageMemberData) {
      setMemberData(localStorageMemberData);
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("memberData", JSON.stringify(memberData));
  }, [memberData]);

  useEffect(() => {
    console.log("memberData", memberData);
  }, [memberData]);

  const filteredData = memberData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchResult.toLowerCase())
    )
  );

  const masterToggle = () => {
    if (selectAllChecked.length === currentRows.length) {
      setSelectAllChecked([]);
      setSelectedMembers([]);
    } else {
      const rowMember = currentRows.map((row) => row.id);
      setSelectAllChecked(rowMember);
      setSelectedMembers(rowMember);
    }
  };

  const toggleSelect = (rowId) => {
    if (selectedMembers.includes(rowId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== rowId));
    } else {
      setSelectedMembers([...selectedMembers, rowId]);
    }
  };

  const deletMember = (rowId) => {
    const updatedMemberData = memberData.filter((row) => row.id !== rowId);
    setMemberData(updatedMemberData);
  };

  const handleEdit = (id) => {
    setEditMemberId(id);
  };
  const handleCancel = (id) => {
    setEditMemberId(null);
  };

  const onEditChange = (id, fieldName, value) => {
    const updatedMemberData = memberData.map((row) =>
      row.id === id ? { ...row, [fieldName]: value } : row
    );
    setMemberData(updatedMemberData);
  };

  const handleSave = (id) => {
    setEditMemberId(null);

    const editedRow = memberData.find((row) => row.id === id);

    const updatedMemberData = memberData.map((row) =>
      row.id === id ? editedRow : row
    );

    setMemberData(updatedMemberData);
  };
  const handleSearch = (event) => {
    setSearchResult(event.target.value);
  };
  const indexOfLastRow = currentPage * memberPerPage;
  const indexOfFirstRow = indexOfLastRow - memberPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (newPage) => {
    setSelectAllChecked([]);
    setCurrentPage(newPage);
  };
  const deleteSelected = () => {
    const updatedMemberData = memberData.filter(
      (row) => !selectedMembers.includes(row.id)
    );
    setMemberData(updatedMemberData);

    setSelectedMembers([]);
  };

  return (
    <div>
      <SearchBox handleSearch={handleSearch} searchResult={searchResult} />
      <table>
        <thead>
          <tr>
            <th>
              <input
                className="cheakbox"
                type="checkbox"
                id="selectAll"
                name="selectAll"
                value="All"
                checked={selectAllChecked.length === currentRows.length}
                onChange={masterToggle}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr
              key={row.id}
              className={selectedMembers.includes(row.id) ? "selected-row" : ""}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(row.id)}
                  onChange={() => toggleSelect(row.id)}
                />
              </td>
              <td>
                {editMemberId === row.id ? (
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) =>
                      onEditChange(row.id, "name", e.target.value)
                    }
                  />
                ) : (
                  row.name
                )}
              </td>
              <td>
                {editMemberId === row.id ? (
                  <input
                    type="text"
                    value={row.email}
                    onChange={(e) =>
                      onEditChange(row.id, "email", e.target.value)
                    }
                  />
                ) : (
                  row.email
                )}
              </td>
              <td>
                {editMemberId === row.id ? (
                  <input
                    type="text"
                    value={row.role}
                    onChange={(e) =>
                      onEditChange(row.id, "role", e.target.value)
                    }
                  />
                ) : (
                  row.role
                )}
              </td>
              <td>
                <div className="icons">
                  {editMemberId === row.id ? (
                    <>
                      <button onClick={() => handleSave(row.id)}>
                        <FaSave /> Save
                      </button>
                      <button onClick={() => handleCancel(row.id)}>
                        <FaTimes /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(row.id)}>
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => deletMember(row.id)}>
                        <FaTrash /> Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        totalPages={Math.ceil(filteredData.length / memberPerPage)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onHandleDeleteSelected={deleteSelected}
      />
    </div>
  );
};

export default Member;
