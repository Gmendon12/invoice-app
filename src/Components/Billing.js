import React, {useState, useMemo} from 'react'
import Select from 'react-select'
import Input from './Input'
import '../Styles/GlobalStyles.css'
import CountryList from 'react-select-country-list'
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import useLocalStorage from './useLocalStorage'

function Billing({
    billing, to
}) {

const [billingData, setBillingData] = useLocalStorage(billing === 'Billing From' ? 'billingFrom' : 'billingTo',{
 companyName: "",
 address: "",
 city: '',
 state : '',
 email: '',
 pan: ''
} )    

 const [value, setValue] = useState('')
 const options = useMemo(() => CountryList().getData(), [])
 const[phone, setPhone] = useState('')
 const[email,setEmail] = useState('')
 const[showEmailInput, setShowEmailInput] = useState(false)
 const[pan, setPan] = useState('')
 const[showPanInput, setShowPanInput] = useState(false)

 const changeHandler = value =>{
    setValue(value)
 }

 const addEmail = () =>{
    setEmail((prev) => [
        ...prev,
        {
            id: Date.now(),
            type:'email',
            value: ''
        }
    ])
 }

 const handleDeleteEmail = () =>{
    setEmail('')
    setShowEmailInput(false)
 }

 const handleDeletePan = () =>{
    setPan('')
    setShowPanInput(false)
 }

  return (
    <div className='billing-box'>
      <div className='billing-box-head'> <h3 className='billing-text'>{billing}</h3> <span className='to-from'>{to}</span></div>  

      <div className='billing-main'>
       <Input 
       placeholder="Company Name"
       type="text"
       value={billingData.companyName}
       onChange={e=>setBillingData({...billingData, companyName: e.target.value})}
       width="100%" />

       <Input 
       placeholder="Address" 
       type="text"
       value={billingData.address}
       onChange={e=>setBillingData({...billingData, address:e.target.value})}
       width="100%" />

       <Input 
       placeholder="City" 
       type='text'
       value={billingData.city}
       onChange={e=>setBillingData({...billingData, city:e.target.value})}
       width="100%"
       />
        <div className='billing-city-postcode'>
            <Input placeholder="State" type='text' width='100%' />
            <Input placeholder="Post Code/Zip Code" width='100%' />
        </div>
        <div className='billing-city-postcode'>
        <Select
        options={options}
        value={value}
        onChange={changeHandler}
        placeholder="Select Country"
        className='country-select'
        />
        <PhoneInput
        country={"in"}
        value={phone}
        onChange={setPhone}
        className='phone-num'
        />
        </div>
        
        {showEmailInput ? (
            <div style={{position:'relative'}}>
                <Input
                type='email'
                placeholder="Email"
                value={billingData.email}
                onChange ={(e)=>setBillingData({...billingData, email:e.target.value})}
                />
                <img
                src="/bin.png"
                onClick={handleDeleteEmail}
                className='bin-img'
                />
            </div>
        ) : (
            <div onClick={()=> setShowEmailInput(true)} className='add-btn-items'>
            <img src="/add-btn.png" alt="" />
             <div className='add-text'>Add Email</div>
            </div>
             
        )
        }
        { showPanInput ? (
            <div style={{position:'relative'}}>
            <Input
            type='text'
            placeholder="Pan Number"
            value={billingData.pan}
            onChange ={(e)=>setBillingData({...billingData, pan:e.target.value})}
            />
             <img
                src="/bin.png"
                onClick={handleDeletePan}
                className='bin-img'
                />
            </div>
        ) : (
            <div onClick={()=>setShowPanInput(true)} className='add-btn-items'>
                <img src="/add-btn.png" alt="" />
                <div className='add-text'>Add PAN Number</div>
            </div>

        )

        }
      </div>
     
    </div>
  )
}

export default Billing