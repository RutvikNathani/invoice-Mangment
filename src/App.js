
import Login from "../src/Components/Login/Login.js"
import Register from "../src/Components/Register/Register.js"
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from "./Components/dashboard/Dashboard.js";
import Invoices from "./Components/dashboard/Invoices.js";
import NewInvoice from "./Components/dashboard/NewInvoice.js";
import Setting from "./Components/dashboard/Setting.js";
import Home from "./Components/dashboard/Home.js";
import invoiceDetail from "./Components/dashboard/invoiceDetail.js";

function App() {

  const myRouter = createBrowserRouter([
    {path:"/" , Component:Login},
    {path:"/login" , Component:Login},
    {path:"/register" , Component:Register},
    {path:"/dashboard" , Component:Dashboard,
      children:[
        {path:"",Component:Home},
        {path:"home",Component:Home},
        {path:"invoice",Component:Invoices},
        {path:"new-invoice",Component:NewInvoice},
        {path:"setting",Component:Setting},
        {path:"invoice-detail",Component:invoiceDetail},


      ]
    }
    


  ])

  
  return (
  <div>
   <RouterProvider router={myRouter}>

   </RouterProvider>
  </div>
  );
}

export default App;
