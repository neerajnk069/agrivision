import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "@fancyapps/fancybox/dist/jquery.fancybox.css";
import "@fancyapps/fancybox";
import { axiosInstance } from "../../Config";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const limit = 10;

  const dateFilters = [
    { value: "all", label: "All Data" },
    { value: "7", label: "Last 7 Days" },
    { value: "30", label: "This Month" },
    { value: "180", label: "Last 6 Months" },
    { value: "365", label: "Last Year" },
  ];

  useEffect(() => {
    fetchData(currentPage, searchTerm, dateFilter);
  }, [currentPage, searchTerm, dateFilter]);

  const fetchData = async (page, search = "", filter = "all") => {
    try {
      const response = await axiosInstance.get(
        `/contactList?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search,
        )}&dateFilter=${filter}`,
      );
      if (response.data.success) {
        setContacts(response.data.body.data);
        setTotalPages(response.data.body.totalPages);
      } else {
      }
    } catch (error) {}
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDateFilter = (filterValue) => {
    setDateFilter(filterValue);
    setCurrentPage(1);
  };

  const getCurrentFilterLabel = () => {
    const filter = dateFilters.find((f) => f.value === dateFilter);
    return filter ? filter.label : "All Data";
  };

  const deleteContact = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.post(`/contact/${id}`);

        const response = await axiosInstance.get(
          `/contactList?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(
            searchTerm,
          )}&dateFilter=${dateFilter}`,
        );

        if (response.data.success) {
          const newTotalPages = response.data.body.totalPages;
          const newData = response.data.body.data;
          if (newData.length === 0 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
          } else {
            setContacts(newData);
            setTotalPages(newTotalPages);
          }
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Error deleting contact",
          "error",
        );
      }
    }
  };

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
  };

  const prepareDataForExport = () => {
    return contacts.map((contact) => ({
      "Contact Name": contact.name || "",
      "Contact Email": contact.email || "",
      "Mobile Number": `${contact.countryCode || ""} ${contact.phoneNumber || ""}`,
      Message: contact.message || "No message available",
    }));
  };

  const handleExcelExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(prepareDataForExport());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

    XLSX.writeFile(workbook, "contacts.xlsx");
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="title-box mb-3 pb-1">
                <h4 className="mb-0 page-title">Inquiry List</h4>
                <nav aria-label="breadcrumb" className="mt-1">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard" className="new">
                        <i className="ri-home-4-fill me-1" /> Home
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/contactlist" className="new">
                        <i className="ri-group-2-line me-1" /> Inquirys
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Inquiry Listings
                    </li>
                  </ol>
                </nav>
              </div>

              <div className="card">
                <div className="card-body cusbar">
                  <div className="card-head mb-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                      <div className="tbl-search position-relative ">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                        <i className="ri-search-line" />
                      </div>

                      <div className="dropdown tbl-drop">
                        <button
                          className="btn btn-light dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {getCurrentFilterLabel()}
                        </button>
                        <ul className="dropdown-menu">
                          {dateFilters.map((filter) => (
                            <li key={filter.value}>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => handleDateFilter(filter.value)}
                              >
                                {filter.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="d-flex">
                      <CSVLink
                        data={prepareDataForExport()}
                        filename={"contacts.csv"}
                        className="btn btn-success me-2"
                      >
                        Export to CSV
                      </CSVLink>
                      <button
                        className="btn btn-danger"
                        onClick={handleExcelExport}
                      >
                        Export to Excel
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive table-card border-top">
                    <div data-simplebar="" className="cus-scroll scmob">
                      <table className="table table-centered cus-nowrap align-middle hltr mb-0">
                        <thead>
                          <tr>
                            <th>Sr no.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile Number</th>

                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.length > 0 ? (
                            contacts.map((contact, index) => (
                              <tr key={contact.id}>
                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                <td>{contact.name || ""}</td>
                                <td>{contact.email || ""}</td>
                                <td>
                                  {contact.countryCode || ""}{" "}
                                  {contact.phoneNumber || ""}
                                </td>

                                <td>
                                  <div className="d-flex justify-content-end">
                                    <button
                                      type="button"
                                      className="btn btn-soft-primary px-2 btn-sm me-1"
                                      data-bs-toggle="offcanvas"
                                      data-bs-target="#view-details"
                                      aria-controls="offcanvasRight"
                                      onClick={() => handleViewDetails(contact)}
                                    >
                                      <i className="ri-eye-fill font-size-16"></i>
                                    </button>

                                    <button
                                      onClick={() => deleteContact(contact.id)}
                                      className="btn btn-soft-danger px-2 btn-sm"
                                      style={{
                                        backgroundColor: "#ea5455",
                                        borderColor: "#ea5455",
                                        color: "#fff",
                                      }}
                                      title="Delete Contact"
                                    >
                                      <i className="ri-delete-bin-line font-size-16"></i>{" "}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="6"
                                style={{ textAlign: "center", padding: "20px" }}
                              >
                                No Inquirys found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <div className="d-flex justify-content-center align-items-center mt-3 ">
                        <Stack
                          spacing={2}
                          className="d-flex justify-content-center mt-3"
                        >
                          <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="error"
                          />
                        </Stack>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details Offcanvas */}
      <div
        className="offcanvas offcanvas-end rdetails"
        tabIndex="-1"
        id="view-details"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header d-block">
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center">
              <h5
                className="offcanvas-title mb-0 me-3 fw-semibold"
                id="offcanvasRightLabel"
              >
                Inquiry Details
              </h5>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div className="offcanvas-body">
          {selectedContact ? (
            <>
              <table
                className="table table-borderless"
                style={{ marginLeft: "-8px" }}
              >
                <tbody>
                  <tr>
                    <td>Inquiry Name :</td>
                    <td className="text-end text-black fw-medium">
                      {selectedContact.name || ""}
                    </td>
                  </tr>
                  <tr>
                    <td>Inquiry Email :</td>
                    <td className="text-end text-black fw-medium">
                      {selectedContact.email || ""}
                    </td>
                  </tr>
                  <tr>
                    <td>Inquiry Mobile Number :</td>
                    <td className="text-end text-black fw-medium">
                      {selectedContact.countryCode || ""}{" "}
                      {selectedContact.phoneNumber || ""}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-3">
                <div className="font-size-16 fw-medium mb-2">Message:</div>
                <div className="bg-light">
                  {selectedContact.message ? (
                    <textarea
                      readOnly
                      className="form-control"
                      rows="10"
                      value={selectedContact.message}
                      style={{
                        resize: "none",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid black",
                      }}
                    />
                  ) : (
                    "No message available"
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="ri-user-line font-size-48 text-muted"></i>
              <p className="mt-3 text-muted">No Inquiry selected</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactList;
