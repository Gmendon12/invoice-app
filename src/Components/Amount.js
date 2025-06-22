import React, {useEffect, useState} from 'react'
import Input from './Input'
import '../Styles/GlobalStyles.css'
import Button from '@mui/material/Button';
import useLocalStorage from './useLocalStorage';

const currencySymbols = {
    INR : "₹",
    USD : "$",
    EUR : "€"
}

function Amount() {

  const [rows, setRows] = useLocalStorage('invoiceRows', [
    {
      id: Date.now(),
      productName: '',
      quantity: 1,
      rate: '',
      gstRate: 18,
      description: '',
      discount: '',
      showDescription: false
    }
  ])
  
  const[currency, setCurrency] = useState("INR")  
  // const [rows, setRows] = useState([
  //   {
  //       id: Date.now(),
  //       productName: '',
  //       quantity: 1,
  //       rate: '',
  //       gstRate : 18,
  //       description: '',
  //       discount: 0,
  //       showDescription: false
  //   }
  // ])

  const [exchangeRates, setExchangeRates] = useState({
    INR: 1,
    USD : 0.012,
    EUR: 0.011
  })

  const[signature, setSignature] = useState(null)

  useEffect(() =>{
    const API_KEY = "9fc321c4e598246297167744a83ac213"
    const url = `https://api.exchangerate.host/live?access_key=${API_KEY}&format=1`

    fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if(data.success) {
        const quotes = data.quotes;
        setExchangeRates({
          INR : 1,
          USD: 1 / quotes["USDINR"],
          EUR: quotes["USDEUR"] / quotes ["USDINR"]
        })
      } else {
        console.error("Failed to load exchange rates", data)
      }
    })
    .catch(error => {
      console.lerror("API error", error)
    })
  },[])

  const handleChange = (id,field,value) =>{

    setRows(prev =>
        prev.map(row =>
            row.id === id ? {...row, [field]: value} : row
        )
    )
  }

  const addRow = () =>{
    setRows(prev => [
        ...(Array.isArray(prev) ? prev : []),
        {
            id: Date.now(),
            productName: '',
            quantity: 1,
            rate: 0,
            gstRate: 18,
            description: '',
            discount: '',
            showDescription: false
        }
    ])
  }

  const removeRow = (id) =>{
    setRows(prev => prev.filter(row => row.id !== id))
  }

  const toggleDescription = id =>{
    setRows( prev =>
        prev.map(row => 
            row.id === id ? {...row, showDescription: !row.showDescription} : row
        )
    )
  }

  const calculateCGST = (gstRate) => (gstRate/2).toFixed(2)
  const calculateSGST = (gstRate) => (gstRate/2).toFixed(2)
  const calculateTotal = (qty, rate, gstRate, discount = 0) => {
    const base = qty * rate;
    const discountedBase = base * (1 - discount / 100)
    const tax = (base * gstRate)/100;
    return discountedBase + tax
  }
 
  const totalBaseAmount = (rows || []).reduce((acc, row) => {
  const qty = Number(row.quantity) || 0;
  const rate = Number(row.rate) || 0;
  return acc + qty * rate;
  }, 0);
  
 const totalCGST = (rows || []).reduce((acc, row) => {
  const qty = Number(row.quantity) || 0;
  const rate = Number(row.rate) || 0;
  const gstRate = Number(row.gstRate) || 0;
  const discount = Number(row.discount) || 0;
  const discountedBase = qty * rate * (1 - discount / 100);
  const tax = (discountedBase * gstRate) / 100;
  return acc + tax / 2;
}, 0);

  const totalSGST = totalCGST
  
 const overallTotal = (rows || []).reduce((acc, row) => {
  const qty = Number(row.quantity) || 0;
  const rate = Number(row.rate) || 0;
  const gstRate = Number(row.gstRate) || 0;
  const discount = Number(row.discount) || 0;
  return acc + calculateTotal(qty, rate, gstRate, discount);
}, 0);

const convertedAmount = (totalBaseAmount * exchangeRates[currency]).toFixed(2)
const convertedCGST = (totalCGST *  exchangeRates[currency]).toFixed(2)
const convertedSGST = (totalSGST * exchangeRates[currency]).toFixed(2)
const convertedTotal = (overallTotal * exchangeRates[currency]).toFixed(2)

  const validate = (value, type= 'number') => {
    if(type === 'number') {
        return Math.max(0, Number(value))
    }
    return value
  }

  const handleSignatureUpload = (e) =>{
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onloadend = () =>{
          setSignature(reader.result)
      };
      reader.readAsDataURL(file)
    }
  }

  return (
  <div className='amount-container'>

       { 
    (rows || []).length > 0 && (
      <div className='amount-table-wrapper'>
      <table className='amount-table'>    
        <thead className='table-header'>
          <tr>
            <th>Sr.No</th>
            <th>Product Name</th>
            <th>Qty</th>
            <th>Unit Price(₹)</th>
            <th>GST %</th>
            <th>Total(₹)</th>
            <th>Action</th>
          </tr>
        </thead>
        { rows.map((row, index) => (
        <tbody className='table-body'>
              <tr key={row.id}>
                    <td>{index + 1}.</td>
                    <td>
                        <Input
                        type="text"
                        value={row.productName}
                        onChange={e=>handleChange(row.id, 'productName', e.target.value)}
                        width='100%'
                        />
                    </td>
                       <td>
  <Input
    type="number"
    value={row.quantity}
    onChange={(e) => {
      const value = Number(e.target.value);
      if (value < 0) {
        alert("Quantity cannot be negative")
        return;
      }
      handleChange(row.id, "quantity", value);
    }}
    width='100%'
  />
</td>
<td>
<Input
  type="text"
  value={row.rate}
  onChange={(e) => {
    const raw = e.target.value;
    const isValid = /^\d*\.?\d*$/.test(raw);

    if (isValid) {
      const cleaned = raw.replace(/^0+(?=\d)/, '');
      handleChange(row.id, 'rate', cleaned);
    }
  }}
  width='100%'
/>

                    </td>
                    <td>
                      <td>
  <Input
    type="number"
    value={row.gstRate}
    onChange={(e) => {
      const value = Number(e.target.value);
      if (value < 0) {
        alert("GST rate cannot be negative!");
        return;
      }
      handleChange(row.id, "gstRate", value);
    }}
    width='100%'
  />
</td>

    </td>
        <td>{calculateTotal(row.quantity, row.rate, row.gstRate, row.discount)}</td>
          <td style={{position:'relative'}}>
                         <img src='/bin.png' className='bin-img-2' onClick={()=> removeRow(row.id)} />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td colSpan='6'>
                      <Input
  type="text"
  placeholder="Enter discount (%)"
  value={row.discount}
  onChange={(e) => {
    const raw = e.target.value;

    const isValid = /^([1-9][0-9]?|100)?$/.test(raw);

    if (isValid) {
      handleChange(row.id, 'discount', raw);
    }
  }}
  width={'29%'}
/>

    </td>
        </tr>
        <tr style={{paddingBottom:'50px'}}>
                <td></td>
                    <td colSpan='6'>
                       {
                            row.showDescription ? (
                            <div className='description-input'>
                            <textarea style={{width: '90%',maxHeight: '120px',resize: 'vertical',overflowY: 'auto'}}></textarea>
                            <img className='bin-img' src='/bin.png' onClick={()=> toggleDescription(row.id)} />
                            </div>
                            ) : (
                              <div onClick={()=> toggleDescription(row.id)} className='add-btn-items'>
                                <img src="add-btn.png" alt="" />
                               <div className='add-text'>
                                    Add Description
                                </div>
                              </div>
                            )
                        }
                    </td>
                  </tr>
              </tbody>  
            ))}
        </table>
      </div>  
    )
   }
  <Button variant='contained' onClick={addRow}>Add Product/Service</Button>
    
    <div className='total-box'>
       <div className='select-currency'>
            <label htmlFor="">Select Currency</label>
            <select 
            value={currency}
            onChange={e=>setCurrency(e.target.value)}
            >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
            </select>
        </div>
        <div className='amount-total'>
          <span>Total Amount</span>
          {/* <span>{currencySymbols[currency]} {totalBaseAmount.toFixed(2)}</span> */}
          <span>{currencySymbols[currency]} {convertedAmount}</span>
        </div>
        <div className='cgst-total'>
          <span>CGST :</span>
          {/* <span>{currencySymbols[currency]} {totalCGST.toFixed(2)}</span> */}
          <span>{currencySymbols[currency]} {convertedCGST}</span>
         </div>
        <div className='sgst-total'>
          <span>SGST :</span>
          {/* <span>{currencySymbols[currency]} {totalSGST.toFixed(2)}</span> */}
          <span>{currencySymbols[currency]} {convertedSGST}</span>
        </div>
        <div className='grand-total'>
          <div className='grand-total-text'>Grand Total:</div>
          <div>
              {/* {currencySymbols[currency]} {overallTotal.toFixed(2)} */}
              {currencySymbols[currency]} {convertedTotal}
          </div>
         </div>
         <div>
            {signature ? (
              <div>
                <img src={signature} alt="" style={{width:'300px',height:'100px'}} />
                <div className='change-delete-logo-box' onClick={()=> setSignature(null)}>
                  <img src="/bin.png" alt="" className='change-delete-img'  />
                  <div className='delete-logo'>Delete</div>
                 </div>
              </div>
            ) : (
              <div>
               <label htmlFor="addSignature" className='add-btn-items'>
                <img src="/add-btn.png" style={{height:'16px'}}/>
                <div className='add-text'>Add Signature</div>  
              </label>
               <input 
               type="file" 
               accept='image/'
               id='addSignature'
               onChange={handleSignatureUpload}
               style={{display:'none'}}
                />
              </div>
            )}
          </div>
    </div>
    
    </div>
  )
}

export default Amount