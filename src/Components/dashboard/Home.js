import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

function Home() {
  const [total, setTotal] = useState('0');
  const [totalMonthCollection, setTotalMonthCollection] = useState(0);
  const [invoices, setInvoices] = useState([]);
  
  // Track chart instance
  let chartInstance = null;

  useEffect(() => {
    // Register all necessary Chart.js components
    Chart.register(...registerables);
    getData();

    // Cleanup on component unmount
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  const getData = async () => {
    const query2 = query(
      collection(db, "invoices"),
      where('uid', "==", localStorage.getItem('uid'))
    );
    const newInvToInvoice = await getDocs(query2);

    const data = newInvToInvoice.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setInvoices(data);
    getOverallTotal(data);
    getMonthTotal(data);
    monthWiseCollection(data);
  };

  // Calculate overall total
  const getOverallTotal = (invoiceList) => {
    let t = 0;
    invoiceList.forEach(data => {
      t += data.total;
    });
    setTotal(t);
  };

  // Calculate total for the current month
  const getMonthTotal = (invoiceList) => {
    let monthTotal = 0;
    invoiceList.forEach(data => {
      if (new Date(data.date.seconds * 1000).getMonth() === new Date().getMonth()) {
        monthTotal += data.total;
      }
    });
    setTotalMonthCollection(monthTotal);
  };

  // Calculate month-wise collection
  const monthWiseCollection = (data) => {
    const chartData = {
      'January': 0,
      'February': 0,
      'March': 0,
      'April': 0,
      'May': 0,
      'June': 0,
      'July': 0,
      'August': 0,
      'September': 0,
      'October': 0,
      'November': 0,
      'December': 0,
    };

    data.forEach(d => {
      if (new Date(d.date.seconds * 1000).getFullYear() === new Date().getFullYear()) {
        const month = new Date(d.date.seconds * 1000).toLocaleDateString('default', { month: 'long' });
        chartData[month]++;
      }
    });

    createChart(chartData);
  };

  // Create the chart
  const createChart = (chartData) => {
    const ctx = document.getElementById('myChart').getContext('2d');

    // Destroy the existing chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Create a new chart instance
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(chartData),
        datasets: [{
          label: 'Month-wise Collection',
          data: Object.values(chartData),
          borderWidth: 1,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <div>
      <div className='home-first-row'>
        <div className='home-box box-1 '>
          <h1 className='box-header'>Rs. {total}</h1>
          <p className='box-title'>Overall</p>
        </div>
        <div className='home-box box-2'>
          <h1 className='box-header'>{invoices.length}</h1>
          <p className='box-title'>Invoices</p>
        </div>
        <div className='home-box box-3'>
          <h1 className='box-header'>{totalMonthCollection}</h1>
          <p className='box-title'>This Month</p>
        </div>
      </div>
      <div className='home-second-box'>
        <div className='chart-box'>
          <h1 className='chart-heading'>Collection Chart</h1>
          <canvas id="myChart"></canvas>
        </div>
        <div className='recent-invoice-list'>
          <h1>Recent Invoice List</h1>
          <div>
            <p>Name</p>
            <p>Date</p>
            <p>Total</p>
            
          </div>
          {invoices.slice(0, 6).map(invoice => (
            <div key={invoice.id}>
              <p>{invoice.to || 'Unknown Customer'}</p>
              <p>{new Date(invoice.date.seconds * 1000).toLocaleDateString()}</p>
              <p>{invoice.total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
