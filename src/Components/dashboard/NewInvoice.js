import React, { useState } from 'react';
import { db } from '../../firebase';
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

function NewInvoice() {
  const [to, setTO] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [total, setTotal] = useState(0);
  const [product, setProduct] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const addProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !qty) {
      setError("Please fill in all product fields.");
      return;
    }
    if (isNaN(price) || price <= 0) {
      setError("Price must be a positive number.");
      return;
    }
    if (qty <= 0 || isNaN(qty)) {
      setError("Quantity must be a positive number.");
      return;
    }

    setError("");
    setProduct([...product, { id: product.length + 1, name, price: parseFloat(price), qty: parseInt(qty) }]);
    setTotal(total + qty * price);
    setName("");
    setPrice("");
    setQty("");
  };

  // Validate mobile number: must be exactly 10 digits
  const validatePhone = (phone) => {
    return phone.length === 10 && /^[0-9]+$/.test(phone);
  };

  // Validate address: must contain at least 8 words
  const validateAddress = (address) => {
    const wordCount = address.trim().split(/\s+/).length;
    return wordCount >= 8;
  };

  const savedata = async () => {
    if (product.length === 0) {
      setError("Please add at least one product before saving.");
      return;
    }
    if (!validatePhone(phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    if (!validateAddress(address)) {
      setError("Address must contain at least 8 words.");
      return;
    }

    setError("");

    try {
      const data = await addDoc(collection(db, 'invoices'), {
        to,
        phone,
        address,
        product,
        total,
        uid: localStorage.getItem('uid'),
        date: Timestamp.fromDate(new Date()),
      });
      console.log(data);
      navigate('/dashboard/invoice');
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div>
      <div className="header-row">
        <p className="new-invoice-heading">New Invoice</p>
        <button onClick={savedata} className="add-btn" type="button">
          Save Data
        </button>
      </div>

      {error && <p style={{ color: "red", margin: "10px 0" }}>{error}</p>}

      <form className="new-invoice-form">
        <div className="first-row">
          <input
            onChange={(e) => setTO(e.target.value)}
            placeholder="To"
            value={to}
          />
          <input
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              setPhone(value);
            }}
            placeholder="Phone (10 digits)"
            value={phone}
          />
          <input
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address (at least 8 words)"
            value={address}
          />
        </div>

        <div className="first-row">
          <input
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            value={name}
          />
          <input
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, "");
              setPrice(value);
            }}
            placeholder="Price"
            value={price}
          />
          <input
            onChange={(e) => setQty(e.target.value)}
            type="number"
            placeholder="Quantity"
            value={qty}
          />
        </div>
        <button onClick={addProduct} className="add-btn" type="button">
          Add Product
        </button>
      </form>

      {product.length > 0 && (
        <div className="product-wrapper">
          <div className="product-list">
            <p>S.No</p>
            <p>Product Name</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total Price</p>
          </div>
          {product.map((data, index) => (
            <div className="product-list" key={index}>
              <p>{index + 1}</p>
              <p>{data.name}</p>
              <p>{data.price}</p>
              <p>{data.qty}</p>
              <p>{data.qty * data.price}</p>
            </div>
          ))}
          <div className="total-wrapper">
            <p>Total: {total}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewInvoice;
