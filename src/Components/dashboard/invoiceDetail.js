import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import html2canvas from 'html2canvas';

import { jsPDF } from "jspdf";

function InvoiceDetail() {
  const location = useLocation()
  // console.log(location)
  const [data, setData] = useState(location.state)

  const printInvoice = () => {

    // pdf************jspdf 
    const input = document.getElementById('invoice')
    html2canvas(input, { useCORS: true, allowTaint: true })
    .then((canvas) => {
      const imageData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [612, 792],
      });
  
      pdf.internal.scaleFactor = 1;
      const imageProps = pdf.getImageProperties(imageData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imageProps.height * pdfWidth) / imageProps.width;
  
      pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('invoice_' + new Date().toISOString() + '.pdf');
    })
    .catch((error) => {
      console.error('Error generating PDF:', error);
    });
  
    //////////////

  }
  return (
    <div>
      <div className='invoice-top-header'>
        <button onClick={printInvoice} className='print-btn'>Print</button>

      </div>
      <div id='invoice' className='invoice-wrapper'>
        <div className='invoice-header'>
          <div className='company-details'>
            <img className='company-logo' alt='logo' src={localStorage.getItem('photoURL')} />
            <p className='cName'>{localStorage.getItem('cName')}</p>
            <p>{localStorage.getItem('email')}</p>

          </div>
          <div className='customer-details'>
            <h1>Invoice</h1>
            <p>To:- {data.to}</p>
            <p>Phone:- {data.phone}</p>
            <p>Address:- {data.address}</p>
          </div>
        </div>
        <hr />
        <table className='product-table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product Name</th>
              {/* <th>HSN</th> */}
              <th>Price</th>
              <th>Quntity</th>
              {/* <th>GST</th> */}
              <th>Total</th>

            </tr>
          </thead>
          <tbody>
            { //**data print */
              data.product.map((product, index) => (
                <tr key={product.id}>
                  {/* console.log(product.id) */}
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>

                  <td>{product.qty}</td>

                  <td>{product.qty * product.price}</td>

                </tr>
              ))
            }
          </tbody>
          <tfoot>
            <tr >
              {/* total */}
              <td colSpan={4} style={{ textAlign: 'left' }}>Total</td>
              <td >{data.total}</td>
            </tr>
          </tfoot>

        </table>
      </div>
    </div>
  )
}

export default InvoiceDetail
