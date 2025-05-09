import React, { useContext, useEffect, useRef, useState } from 'react'
import { CartContext} from './context/Cart';
import Layout from './common/Layout'
import { apiUrl, userToken } from './common/http';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Confirmation = () => {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const params = useParams();
  const { clearCart } = useContext(CartContext);
  const paymentData = new URLSearchParams(window.location.search).get("data");
  const isEsewaSuccess = paymentData && JSON.parse(atob(paymentData)).status === "COMPLETE";
  const pdfRef = useRef();

  const fetchOrder = async () => {
    fetch(`${apiUrl}/get-order-details/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${userToken()}`
      }
    })
    .then((res) => res.json())
    .then(result => {
      setLoading(false);
      if(result.status === 200) {
        setOrder(result.data);
        setItems(result.data.items)
      } else {
        setOrder(null);
      }
    });
  }

useEffect(() => {
  fetchOrder();

  if (isEsewaSuccess) {
    clearCart();
  }
}, []);

const downloadPDF = () => {
  const input = pdfRef.current;
  const noPrintElements = document.querySelectorAll('.no-print');

  // Hide elements with class "no-print"
  noPrintElements.forEach(el => el.style.display = 'none');

  window.scrollTo(0, 0);

  setTimeout(() => {
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`order_${order.id}.pdf`);

      // Restore display after download
      noPrintElements.forEach(el => el.style.display = '');
    });
  }, 500);
};



  return (
       <Layout>
        <div className='container py-5' >
          {
            loading === true && 
            <div className='text-center py-5'>
                <div className='spinner-border' role="status">
                    <span className='visually-hidden'>Loading....</span>
                </div>
            </div>
          }

          {
            loading === false && order &&
          <div>
            <div ref={pdfRef} className="p-3 bg-white">
              <div className='row'>
                  <h1 className='text-center fw-bold text-success'>Thanks You!</h1>
                  <p className='text-muted text-center'>Your order has been successfully placed.</p>
              </div>

              <div className='card shadow'>
                  <div className='card-body'>
                      <h3 className='fw-bold'>Order Summary</h3>
                      <hr />
                      <div className='row'>
                          <div className='col-6'>
                              <p><strong>Order ID:</strong> #{order.id}</p>
                              <p><strong>Date:</strong> {order.created_at}</p>
                              <p><strong>Status:</strong>
                                    {
                                      order.status == 'pending' && <span className='badge bg-warning'>Pending</span> 
                                    }

                                    {
                                      order.status == 'Shipped' && <span className='badge bg-warning'>Shipped</span> 
                                    }

                                    {
                                      order.status == 'delivered' && <span className='badge bg-success'>Delivered</span> 
                                    }

                                    {
                                      order.status == 'cancelled' && <span className='badge bg-danger'>Cancelled</span> 
                                    }
                                    {/* <span className='badge bg-success'>  Pending</span>  */}
                              </p>
                                <p><strong>Payment Method:</strong> 
{order.payment_status === 'paid' ? ' Esewa' : ' Cash on Delivery'}

</p>

                          </div>
                          <div className='col-6'>
                              <p><strong>Customer:</strong> {order.name}</p>
                              <p><strong>Address:</strong> {order.address}, {order.city} {order.state} {order.zip}</p>
                              <p><strong>Contact:</strong> {order.mobile}</p>                       
                          </div>
                      </div>

                      <div className='row'>
                          <div className='col-12'>
                              <table className='table-striped table-bordered table'>
                                    <thead className='table-light'>
                                        <tr >
                                            <th>Item</th>
                                            <th>Quantity</th>
                                            <th width="150">Price</th>
                                            <th width="150">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                         {
                                            items.map((item) => (
                                              <tr key={item.id}>
                                                  <td>{item.name}</td>
                                                  <td>{item.qty}</td>
                                                  <td>Rs.{item.unit_price}</td>
                                                  <td>Rs.{item.price}</td>
                                              </tr>
                                            ))
                                         }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td className='text-end fw-bold' colSpan={3}>Subtotal</td>
                                            <td>Rs.{order.subtotal}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-end fw-bold' colSpan={3}>Shipping</td>
                                            <td>Rs.{order.shipping}</td>
                                        </tr>
                                        <tr>
                                            <td className='text-end fw-bold' colSpan={3}>Grandtotal</td>
                                            <td>Rs.{order.grand_total}</td>
                                        </tr>
                                    </tfoot>
                              </table>
                          </div>
                                         
                          <div className='no-print text-center mt-4'>
                                <button className='btn btn-primary'  onClick={downloadPDF}>Download Receipt</button>
                                <Link to={'/'} className='btn btn-outline-secondary ms-2'>Continue Shopping</Link>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          </div>
          }

          {
            loading == false && !order &&
              <div className='row'>
                  <h1 className='text-center fw-bold text-muted'>Order Not Found!</h1>
              </div>
          }
       </div>
    </Layout>
  )
}

export default Confirmation