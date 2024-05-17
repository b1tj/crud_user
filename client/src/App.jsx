import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

axios.defaults.baseURL = "http://localhost:8080/";

export const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e, type = "create") => {
    e.preventDefault();
    if (type === "create") {
      const data = await axios.post("/create", formData);
      if (data.data.sucess) {
        setIsOpen(false);
        setFormData({
          name: "",
          email: "",
          mobile: "",
          address: "",
        });
        alert(data.data.message);
        fetchData();
      }
    } else if (type === "update") {
      const data = await axios.post("/update", formData);
      if (data.data.sucess) {
        setIsOpen(false);
        setFormData({
          name: "",
          email: "",
          mobile: "",
          address: "",
        });
        alert(data.data.message);
        fetchData();
      }
    }
  };

  const handleDelete = async (id) => {
    const data = await axios.delete("/delete/" + id);
    if (data.data.sucess) {
      fetchData();
      alert(data.data.message);
    }
  };

  const handleUpdate = async (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
    });
    setIsOpen(true);

    console.log(formData);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOnChange = (e) => {
    const { value, name } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("/");
      setUsers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="relative mx-40 mt-28 overflow-x-auto shadow-md sm:rounded-lg">
        <button
          type="button"
          className="mb-4 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800
         dark:bg-blue-600 dark:hover:bg-blue-700"
          onClick={handleOpen}
        >
          Create
        </button>
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                User Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Mobile
              </th>
              <th scope="col" className="px-6 py-3">
                Adress
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
                <span className="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users[0] ? (
              users.map((user) => (
                <RowData
                  key={user.id}
                  user={user}
                  deleteUser={() => handleDelete(user._id)}
                  editUser={() => handleUpdate(user)}
                />
              ))
            ) : (
              <p className="text-center">No Data</p>
            )}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <Form
          close={handleClose}
          submit={handleSubmit}
          handleOnChange={handleOnChange}
        />
      )}
    </>
  );
};

function RowData({ user, deleteUser, editUser }) {
  return (
    <>
      <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
        <th
          scope="row"
          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
        >
          {user.name}
        </th>
        <td className="px-6 py-4">{user.email}</td>
        <td className="px-6 py-4">{user.mobile}</td>
        <td className="px-6 py-4">{user.address}</td>
        <td className="space-x-4 px-6 py-4 text-right">
          <button
            href="#"
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            onClick={() => editUser(user._id)}
          >
            Edit
          </button>
          <button
            href="#"
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            onClick={() => deleteUser()}
          >
            Delete
          </button>
        </td>
      </tr>
    </>
  );
}

RowData.propTypes = {
  user: PropTypes.object,
  deleteUser: PropTypes.func,
  editUser: PropTypes.func,
};

function Form({ close, submit, handleOnChange, data }) {
  return (
    <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,.5)]">
      <form
        className="w-96 rounded-lg bg-white p-8"
        onSubmit={submit}
        onChange={handleOnChange}
      >
        <div className="mb-5">
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            UserName
          </label>
          <input
            type="name"
            id="name"
            name="name"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Your Name"
            value={data.name}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 
            text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600
             dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={data.email}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="repeat-password"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Mobile
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm
             text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700
              dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={data.mobile}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm
             text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700
              dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={data.address}
            required
          />
        </div>
        <div className="flex w-full justify-center gap-8">
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 
            focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 
            focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={close}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

Form.propTypes = {
  close: PropTypes.func,
  submit: PropTypes.func,
  handleOnChange: PropTypes.func,
  data: PropTypes.object,
};
