import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegSave } from "react-icons/fa";
import "./table.css";
const ParentComponent = () => {
  const [data, setData] = useState([]);
  const [getData, setgetData] = useState([]);
  const [edit, setEdit] = useState(null);
  const [updatename, setupdatename] = useState("");
  const [updateemail, setupdateemail] = useState("");
  const [updaterole, setupdaterole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const itemsPerPage = 10;
  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    ).then((res) =>
      res.json().then((response) => {
        setData(response);
        setgetData(response);
      })
    );
  }, []);
  
  const handleEdit = (id, editValue) => {
    // console.log(id);
    // console.log(editValue);
    setEdit(id);
    const itemToEdit = data.find((item) => item.id === id);
    setupdatename(itemToEdit.name);
    setupdateemail(itemToEdit.email);
    setupdaterole(itemToEdit.role);
  };
  const handleUpdate = (id, updatedData) => {
    // setData(updatedData);
    setData((prevData) =>
      prevData.map((item) =>
        item.id === edit
          ? { ...item, name: updatename, email: updateemail, role: updaterole }
          : item
      )
    );
    setEdit(null);
    setupdatename("");
    setupdateemail("");
    setupdaterole("");

    // setData(updatedData)
  };
  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
    setSelectedRows((prevSelected) =>
      prevSelected.filter((row) => row.id !== id)
    );
  };
  const handleSearch = (e) => {
    // e.preventDefault()
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  
    setData((prevdata) => {
      if (term === "") {
        return getData;
      }

      return getData.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term) ||
          item.role.toLowerCase().includes(term) ||
          item.name.toLowerCase().startsWith(term) ||
          item.email.toLowerCase().startsWith(term) ||
          item.role.toLowerCase().startsWith(term)
        //     ||
        // term===''?item:''
      );
    });
    setCurrentPage(1);

    // setSearchTerm('')//
  };
  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.some((row) => row.id === id)) {
        return prevSelected.filter((row) => row.id !== id);
      } else {
        const selectedRow = data.find((row) => row.id === id);
        return [...prevSelected, selectedRow];
      }
    });
  };
  const handleSelectAll = () => {
    const allRowsOnPage = data.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    if (selectedRows.length === allRowsOnPage.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allRowsOnPage);
    }
  };

  const handleDeleteSelected = () => {
    setData((prevData) =>
      prevData.filter((item) => !selectedRows.includes(item))
    );
    setSelectedRows([]);
  };
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change the current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
      <div className="container mt-4">
        <input
          type="text"
          placeholder="Search by name, email or role"
          value={searchTerm}
          onChange={handleSearch}
          className="form-control mb-2"
        />
        <table class="table">
          <thead>
            <tr>
              <th scope="col">
                {" "}
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === currentItems.length}
                />
              </th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 &&
              currentItems &&
              currentItems.map((item, index) => {
                return (
                  <tr
                    className={
                      selectedRows.some((row) => row.id === item.id)
                        ? "selected-row"
                        : ""
                    }
                  >
                    <th scope="row">
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(item.id)}
                        checked={selectedRows.some((row) => row.id === item.id)}
                      />
                    </th>
                    <td>
                      {edit === item.id ? (
                        <input
                          type="text"
                          value={updatename}
                          onChange={(e) => setupdatename(e.target.value)}
                          checked={selectedRows.some(
                            (row) => row.id === item.id
                          )}
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td>
                      {edit === item.id ? (
                        <input
                          type="text"
                          value={updateemail}
                          onChange={(e) => setupdateemail(e.target.value)}
                        />
                      ) : (
                        item.email
                      )}
                    </td>
                    <td>
                      {edit === item.id ? (
                        <input
                          type="text"
                          value={updaterole}
                          onChange={(e) => setupdaterole(e.target.value)}
                        />
                      ) : (
                        item.role
                      )}
                    </td>

                    <td>
                      {edit === item.id ? (
                        <>
                          <span>
                            <FaRegSave
                              onClick={() => handleUpdate(item.id, item)}
                            />
                          </span>
                          <span>
                            <AiOutlineDelete
                              onClick={() => handleDelete(item.id)}
                              style={{ color: "red" }}
                            />
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            <FiEdit onClick={() => handleEdit(item.id)} />
                          </span>
                          <span>
                            <AiOutlineDelete
                              onClick={() => handleDelete(item.id)}
                              style={{ color: "red" }}
                            />
                          </span>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            {currentItems.length === 0 && (
              <>
                <tr className="text-center">
                  <td>No search result found</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        {currentItems.length > 0 && (
          <>
            <div className="d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  <li
                    className={`page-item ${currentPage === 1 && "disabled"}`}
                  >
                    <button className="page-link" onClick={() => paginate(1)}>
                      First
                    </button>
                  </li>
                  <li
                    className={`page-item ${currentPage === 1 && "disabled"}`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        paginate(currentPage > 1 ? currentPage - 1 : 1)
                      }
                    >
                      Previous
                    </button>
                  </li>
                  {/* Display page numbers dynamically */}
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${
                        currentPage === index + 1 && "active"
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages && "disabled"
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        paginate(
                          currentPage < totalPages
                            ? currentPage + 1
                            : totalPages
                        )
                      }
                    >
                      Next
                    </button>
                  </li>
                  <li
                    className={`page-item ${
                      currentPage === totalPages && "disabled"
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(totalPages)}
                    >
                      Last
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="mt-3">
              <button
                className="btn btn-danger"
                onClick={handleDeleteSelected}
                disabled={selectedRows.length === 0}
              >
                Delete Selected
              </button>
            </div>
          </>
        )}
        {/* Delete selected rows button */}
      </div>
    </>
  );
};

export default ParentComponent;
// https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json
