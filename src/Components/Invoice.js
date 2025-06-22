import React, {useState} from 'react'
import '../Styles/GlobalStyles.css'
import Input from './Input';
import Button from '@mui/material/Button';
import Billing from './Billing';
import Amount from './Amount';
import html2pdf from 'html2pdf.js'

function Invoice() {
const [ logo, setLogo] = useState(null)
const[invoiceNum, setInvoiceNum] = useState('')
const[conmpanyName, setCompanyName] = useState('')
const[invoiceDate, setInvoiceDate] = useState('')
const [extraInvoiceDetails, setExtraInvoiceDetails] = useState([])

const isFormValid = () =>{
    return (
    invoiceNum.trim() !== '' &&
    conmpanyName.trim() !== '' &&
    invoiceDate.trim() !== ""
    )
}

const downloadPDF = () =>{
    if(!isFormValid()){
        alert("Please Fill in invoice number, Company name and Invoice Date")
        return
    }
    const element = document.querySelector(".invoice-container");
    const opt = {
        margin: 0,
        filename: 'invoice.pdf',
        image: {type: "jpeg", quality: 0.98},
        htmlcanvas : { scale : 2},
        jsPDF : { unit: "in", format: 'a4', orientation: 'portrait'} 
    };
    html2pdf().set(opt).from(element).save()
}

const handleLogoUpload = (e) =>{
    const file = e.target.files[0];
    if(file && file.type.startsWith('image/')){
        setLogo(URL.createObjectURL(file))
    }
}

const handelAddInvoiceField = () =>{
    setExtraInvoiceDetails((prev) =>[
        ...prev,
        { id: Date.now(),
          label: '',
          type: 'text',
          value: ''  
        }
    ])
}

const handleAddDueDateField = () =>{
  const hasDueDate = extraInvoiceDetails.some(field => field.label.toLowerCase() === "due date")  
  if(!hasDueDate) {
      setExtraInvoiceDetails(prev =>[
        ...prev,
        {
            id:Date.now(),
            label: "Due Date",
            type: 'date',
            value: ''
        }
    ])
  }
}

const handleChange = (id, field, value) => {
    setExtraInvoiceDetails((prev)=>
    prev.map(item =>
        item.id === id ? {
            ...item, [field] : value 
        } : item
    )
    )
}

const handleDeleteInvoiceDetails = (id) =>{
    setExtraInvoiceDetails(prev => prev.filter(item => item.id !== id))
}

  return (
  <div>
      <div className='invoice-container'>
        <div>
         <div className='invoice-text'>Invoice</div>
        </div>
        <hr />

        <div className='invoice-company-details'>
            <div className='upload-logo-box'>
            <input
              type="file"
              accept="image/*"
              id="logoUpload"
              style={{ display: 'none' }}
              onChange={handleLogoUpload}
            />
            <label htmlFor='logoUpload' className="logo-upload-label">
                {logo ? (
                    <img src={logo} alt="Company Logo" className='company-logo' />
                ) : (
                    <div className='add-company-logo no-print'>
                        <img src="/image.png" className='upload-img' />
                        <div style={{fontWeight:'600'}}>Add Company Logo</div>
                        <div style={{fontSize:"12px", fontStyle:'italic'}}>PNG and JPG files only</div>
                    </div>
                )}
            </label>
            {logo && (
                <div className='change-delete-logo no-print'>
                 <label htmlFor='logoUpload' className='change-delete-logo-box'>
                    <img src="/edit.png" alt="" className='change-delete-img' />
                    <div className='change-logo'>Change</div>
                 </label>
                 <div className='change-delete-logo-box' onClick={()=> setLogo(null)}>
                    <img src="/bin.png" alt="" className='change-delete-img'  />
                    <div className='delete-logo'>Delete</div>
                 </div>
                </div>    
            )}
            </div>
           
            <div className='invoice-company-details-2'>
                <Input 
                name="invoiceNum" 
                label="Invoice Number" 
                type="text" 
                width='250px'
                value={invoiceNum}
                onChange={(e) => setInvoiceNum(e.target.value)}
                />
                <Input 
                name='companyName' 
                label='Company Name' 
                type='text' 
                width='250px'
                value={conmpanyName}
                onChange={(e)=>setCompanyName(e.target.value)}
                />
                <Input 
                name='invoiceDate' 
                label='Invoice Date' 
                type='date' 
                width='250px'
                value={invoiceDate}
                onChange={(e) => e.target.value}
                />
                {
                    extraInvoiceDetails.map((field) =>(
                    <div key={field.id}>
                     {
                        field.label.toLowerCase() === "due date" ? (
                        <div key={field.id} className='input-flex'>
                        <Input 
                        label='Due Date'
                        type='date'
                        value={field.value}
                        onChange={(e) => handleChange(field.id, "value", e.target.value)}
                        width='250px'
                        />
                        <img className='bin-img-1' src='/bin.png' onClick={()=> handleDeleteInvoiceDetails(field.id)} />
                        </div>
                        ) : (
                        <div key={field.id} className='input-flex'>
                          <input
                            className='add-input-label'
                            type='text'
                            placeholder='Field'
                            value={field.label}
                            onChange={e=> handleChange(field.id, 'label', e.target.value)}
                           />
                    <Input
                    type={field.type}
                    placeholder="value"
                    value={field.value}
                    onChange={e=>handleChange(field.id, "value", e.target.value)}
                    width='250px'
                    />
                    <img className='bin-img-1' src='/bin.png' onClick={()=> handleDeleteInvoiceDetails(field.id)} />
                        </div>
                        )
                     }   
                    </div>
                    ))
                }
              <div className='add-details-btn'>
            {
                !extraInvoiceDetails.some(field => field.label.toLowerCase() === 'due date') &&
                (
            <div onClick={handleAddDueDateField} className='add-btn-items'> 
            <img src="add-btn.png" alt="" />
            <div className='add-text'>Add Due Date</div>
            </div>
                )
            } 
              <div onClick={handelAddInvoiceField} className='add-btn-items'>
              <img src="add-btn.png" alt="" />  
              <div className='add-text'>Add More Details</div>
              </div>
              </div>
            </div>
        </div>

        <div className='billing-container'>
            <Billing billing='Billing From' to='(Your details)' />
            <Billing billing="Billing To" to='(Client details)' />
        </div>

        <Amount/>


    </div>
     <div className='print-download-btn'>
        <Button variant='contained' onClick={()=> window.print()}>Print</Button>
        <Button variant='contained' onClick={downloadPDF}>Download</Button>
    </div>
  </div>
  )
}

export default Invoice