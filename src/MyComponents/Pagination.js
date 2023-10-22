import React from "react";
import "./Pagination.css";

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  onHandleDeleteSelected,
}) => {
  const handlePageClick = (newPage) => {
    onPageChange(newPage);
  };

  return (
    <div className="pagination">
      <div className="delete-button">
        <button onClick={onHandleDeleteSelected}>Delete selected</button>
      </div>
      <ul>
        <li>
          <button
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </button>
        </li>
        <li>
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
        </li>
        {Array.from({ length: totalPages }, (v, i) => (
          <li key={i}>
            <button
              onClick={() => handlePageClick(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </li>
        <li>
          <button
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
          >
            {">>"}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
