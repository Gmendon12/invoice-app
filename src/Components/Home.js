import React from 'react'
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom'

function Home() {
  return (
    <div className='home-page'
    style={{
      display:'flex',
      flexDirection: 'column',
      gap:'40px',
      alignContent:'center',
      alignItems:'center',
      paddingTop:'80px'
    }}
    >
      <h3>Create Your invoice in seconds</h3>
        <Link to='/invoice'>
            <Button variant ='contained'>CREATE YOUR INVOICE NOW!</Button>        
        </Link>
    </div>
  )
}

export default Home