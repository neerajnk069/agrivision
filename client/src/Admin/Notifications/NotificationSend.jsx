import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../Config";

const NotificationSend = () => {
  const [data, setData] = useState({
    title: "",
    message: "",
    selectedUsers: [],
  });
  const [users, setUsers] = useState([]);
  const [titleError, setTitleError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [usersError, setUsersError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await axiosInstance.get("/notificationlist");

      if (response.data.success) {
        let usersData = [];

        if (response.data.body && response.data.body.data) {
          usersData = response.data.body.data;
        } else if (response.data.data) {
          usersData = response.data.data;
        } else if (response.data.users) {
          usersData = response.data.users;
        }

        setUsers(usersData);
        setAvailableUsers(usersData);

        if (usersData.length === 0) {
          toast.warning("No users available for notification");
        }
      } else {
        toast.error("Failed to load users list");
      }
    } catch (error) {
      toast.error("Failed to load users list");
    } finally {
      setUsersLoading(false);
    }
  };

  const validateTitle = (title) => {
    const trimmedTitle = title.trim();
    const errors = [];

    if (!trimmedTitle) {
      errors.push("Notification title is required.");
    } else {
      if (trimmedTitle.length < 3 || trimmedTitle.length > 100)
        errors.push("Title must be between 3 and 100 characters.");
      if (!/^[A-Za-z0-9@#&!()_\-., ]+$/.test(trimmedTitle))
        errors.push(
          "Title contains invalid characters. Only letters, numbers, spaces, and @#&!()_-., are allowed."
        );
    }

    setTitleError(errors.join(" "));
    return errors.length === 0;
  };

  const validateMessage = (message) => {
    const trimmedMessage = message.trim();
    const errors = [];

    if (!trimmedMessage) {
      errors.push("Notification message is required.");
    } else if (trimmedMessage.length < 5 || trimmedMessage.length > 50000) {
      errors.push("Message must be between 5 and 50000 characters.");
    }

    setMessageError(errors.join(" "));
    return errors.length === 0;
  };

  const validateUsers = (selectedUsers) => {
    if (selectedUsers.length === 0) {
      setUsersError("Please select at least one user.");
      return false;
    }
    setUsersError("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setData((prev) => ({ ...prev, title: value }));
      validateTitle(value);
    } else if (name === "message") {
      setData((prev) => ({ ...prev, message: value }));
      validateMessage(value);
    }
  };

  const handleAddUser = (e) => {
    const userId = e.target.value;
    if (
      userId &&
      !data.selectedUsers.some((user) => user.id === parseInt(userId))
    ) {
      const userToAdd = availableUsers.find(
        (user) => user.id === parseInt(userId)
      );
      if (userToAdd) {
        setData((prev) => ({
          ...prev,
          selectedUsers: [...prev.selectedUsers, userToAdd],
        }));
        setAvailableUsers((prev) =>
          prev.filter((user) => user.id !== parseInt(userId))
        );
        validateUsers([...data.selectedUsers, userToAdd]);
      }
    }
    e.target.value = "";
  };

  const handleRemoveUser = (userId) => {
    const userToRemove = data.selectedUsers.find((user) => user.id === userId);
    if (userToRemove) {
      setData((prev) => ({
        ...prev,
        selectedUsers: prev.selectedUsers.filter((user) => user.id !== userId),
      }));
      setAvailableUsers((prev) => [...prev, userToRemove]);
      validateUsers(data.selectedUsers.filter((user) => user.id !== userId));
    }
  };

  const resetForm = () => {
    setData({
      title: "",
      message: "",
      selectedUsers: [],
    });
    setTitleError("");
    setMessageError("");
    setUsersError("");

    setAvailableUsers(users);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isTitleValid = validateTitle(data.title);
    const isMessageValid = validateMessage(data.message);
    const isUsersValid = validateUsers(data.selectedUsers);

    if (!isTitleValid || !isMessageValid || !isUsersValid) return;

    setLoading(true);

    try {
      const response = await axiosInstance.post("/notificationsend", {
        title: data.title.trim(),
        message: data.message.trim(),
        users: data.selectedUsers.map((user) => user.id),
      });

      if (response.data.success) {
        toast.success(`Notification sent successfully.`);

        resetForm();

        // Optional: You can also refetch users if needed
        // fetchUsers();
      } else {
        toast.error(response.data.message || "Failed to send notification.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Request failed: " + error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      data.title.trim() &&
      data.message.trim() &&
      data.selectedUsers.length > 0 &&
      !titleError &&
      !messageError
    );
  };

  return (
    <>
      <div>
        <main>
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="bgc-white p-20 bd">
                  <h4 className="c-grey-900">Send Notification</h4>
                  <div className="mt-3">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="users" className="form-label">
                          Select Users *
                        </label>
                        {usersLoading ? (
                          <div className="text-center py-3">
                            <div className="spinner-border spinner-border-sm me-2" />
                            Loading users...
                          </div>
                        ) : (
                          <>
                            <div className="row">
                              <div className="col-md-8">
                                <select
                                  className={`form-control ${
                                    usersError ? "is-invalid" : ""
                                  }`}
                                  id="users"
                                  name="users"
                                  onChange={handleAddUser}
                                  defaultValue=""
                                >
                                  <option value="">
                                    Select a user to add...
                                  </option>
                                  {availableUsers.length > 0 ? (
                                    availableUsers.map((user) => (
                                      <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                      </option>
                                    ))
                                  ) : (
                                    <option disabled>
                                      No more users available
                                    </option>
                                  )}
                                </select>
                                <div className="form-text">
                                  Select users from dropdown to add them
                                </div>
                                {usersError && (
                                  <div className="invalid-feedback d-block">
                                    {usersError}
                                  </div>
                                )}
                              </div>
                              <div className="col-md-4">
                                <div className="d-grid">
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                      setData((prev) => ({
                                        ...prev,
                                        selectedUsers: [
                                          ...prev.selectedUsers,
                                          ...availableUsers,
                                        ],
                                      }));
                                      setAvailableUsers([]);
                                      validateUsers([
                                        ...data.selectedUsers,
                                        ...availableUsers,
                                      ]);
                                    }}
                                    disabled={availableUsers.length === 0}
                                  >
                                    Add All Users
                                  </button>
                                </div>
                              </div>
                            </div>

                            {data.selectedUsers.length > 0 && (
                              <div className="mt-3">
                                <h6 className="mb-2">
                                  Selected Users ({data.selectedUsers.length})
                                </h6>
                                <div
                                  className="selected-users-container"
                                  style={{
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                  }}
                                >
                                  {data.selectedUsers.map((user) => (
                                    <div key={user.id} className="card mb-2">
                                      <div className="card-body py-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div>
                                            <strong>{user.name}</strong>
                                            <br />
                                            <small>{user.email}</small>
                                          </div>
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                              handleRemoveUser(user.id)
                                            }
                                            title="Remove user"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-warning"
                                    onClick={() => {
                                      setAvailableUsers([
                                        ...availableUsers,
                                        ...data.selectedUsers,
                                      ]);
                                      setData((prev) => ({
                                        ...prev,
                                        selectedUsers: [],
                                      }));
                                      validateUsers([]);
                                    }}
                                  >
                                    Clear All
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Notification Title *
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            titleError ? "is-invalid" : ""
                          }`}
                          id="title"
                          name="title"
                          placeholder="Enter notification title"
                          value={data.title}
                          onChange={handleChange}
                          maxLength={100}
                        />
                        {titleError && (
                          <div className="invalid-feedback d-block">
                            {titleError}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="message" className="form-label">
                          Notification Message *
                        </label>
                        <textarea
                          className={`form-control ${
                            messageError ? "is-invalid" : ""
                          }`}
                          id="message"
                          name="message"
                          placeholder="Enter notification message"
                          rows="4"
                          value={data.message}
                          onChange={handleChange}
                          maxLength={5000}
                        />

                        {messageError && (
                          <div className="invalid-feedback d-block">
                            {messageError}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn btn-primary btn-color "
                          disabled={!isFormValid() || loading || usersLoading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Sending...
                            </>
                          ) : (
                            "Send Notification"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default NotificationSend;
