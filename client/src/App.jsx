import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

axios.defaults.baseURL = "http://localhost:8080/";

export const App = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState("create");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (action === "create") {
      const data = await axios.post("/create", formData);
      if (data.data.sucess) {
        setIsOpen(false);
        setFormData({
          _id: "",
          name: "",
          price: 0,
          state: "",
          stock: 0,
        });
        alert(data.data.message);
        fetchData();
      }
    } else if (action === "update") {
      const data = await axios.put("/update", { ...formData });
      if (data.data.sucess) {
        setIsOpen(false);
        setFormData({
          _id: "",
          name: "",
          price: 0,
          state: "",
          stock: 0,
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

  const handleUpdate = async (product) => {
    setAction("update");
    setIsOpen(true);
    setFormData({
      _id: product._id,
      name: product.name,
      price: product.price,
      state: product.state,
      stock: product.stock,
    });
  };

  const handleCreate = () => {
    setAction("create");
    setIsOpen(true);
    setFormData({
      name: "",
      price: 0,
      state: "",
      stock: 0,
    });
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
      setProducts(res.data.data);
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
          onClick={handleCreate}
        >
          Create
        </button>
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Tên Sản Phẩm
              </th>
              <th scope="col" className="px-6 py-3">
                Giá Tiền
              </th>
              <th scope="col" className="px-6 py-3">
                Trạng Thái
              </th>
              <th scope="col" className="px-6 py-3">
                Số Lượng
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Sửa</span>
                <span className="sr-only">Xóa</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products[0] ? (
              products.map((product) => (
                <RowData
                  key={product._id}
                  product={product}
                  deleteProduct={() => handleDelete(product._id)}
                  editProduct={() => handleUpdate(product)}
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
          data={formData}
        />
      )}
    </>
  );
};

function RowData({ product, deleteProduct, editProduct }) {
  return (
    <>
      <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
        <th
          scope="row"
          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
        >
          {product.name}
        </th>
        <td className="px-6 py-4">{product.price}</td>
        <td className="px-6 py-4">{product.state}</td>
        <td className="px-6 py-4">{product.stock}</td>
        <td className="space-x-4 px-6 py-4 text-right">
          <button
            href="#"
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            onClick={() => editProduct(product._id)}
          >
            Edit
          </button>
          <button
            href="#"
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            onClick={() => deleteProduct()}
          >
            Delete
          </button>
        </td>
      </tr>
    </>
  );
}

RowData.propTypes = {
  product: PropTypes.object,
  deleteProduct: PropTypes.func,
  editProduct: PropTypes.func,
};

function Form({ close, submit, handleOnChange, data = {} }) {
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
            Tên sản phẩm
          </label>
          <input
            type="name"
            id="name"
            name="name"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Product Name"
            value={data.name}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="price"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Giá tiền
          </label>
          <input
            type="text"
            id="price"
            name="price"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 
            text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600
             dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={data.price}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="state"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Trạng Thái
          </label>
          <input
            type="text"
            id="state"
            name="state"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm
             text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700
              dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={data.state}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="stock"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Số Lượng
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm
             text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700
              dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={data.stock}
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
