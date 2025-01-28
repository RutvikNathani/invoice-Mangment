import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    console.log("hello");
  }, []);

  // Fetch invoices
  const getData = async () => {
    const query1 = query(collection(db, "invoices"), where('uid', "==", localStorage.getItem('uid')));
    const newinv_to_invoice = await getDocs(query1);

    const data = newinv_to_invoice.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setInvoices(data);
  };

  // Delete an invoice
  const deleteInvoice = async (id) => {
    const isConfirm = window.confirm("Are you sure you want to delete this invoice?");

    if (isConfirm) {
      try {
        await deleteDoc(doc(db, 'invoices', id));
        getData();
      } catch (err) {
        window.alert("Something went wrong", err);
      }
    }
  };

  return (
    <div>
      <h2 className='heading-invoice'>All Invoices</h2>
<hr style={{marginTop:'10px', marginBottom:'10px'}}/>
      {/* Display "Create New Invoice" button if no invoices are available */}
      {invoices.length === 0 && (
        <div className='inv-create-new-btn' style={{
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          alignItems:'center'
        }}>
          <p>You have No Invoice till now</p>
          <button onClick={() => navigate('/dashboard/new-invoice')} className='add-btn'>
            Create New Invoice
          </button>
        </div>
      )}

      {/* Display invoices if available */}
      {invoices.map(data => (
        <div className='box' key={data.id}>
          <p>{data.to}</p>
          <p>{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
          <p>Rs. {data.total}</p>
          <button onClick={() => deleteInvoice(data.id)} className='delete-btn'>
            <i className="fa-solid fa-trash"></i> Delete
          </button>
          <button onClick={() => navigate('/dashboard/invoice-detail', { state: data })} className='view-btn'>
            <i className="fa-regular fa-eye"></i> View
          </button>
        </div>
      ))}
    </div>
  );
}

export default Invoices;
