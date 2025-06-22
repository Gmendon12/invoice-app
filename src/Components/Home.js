import React from 'react'
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom'

function Home() {
  return (
    <div className='home-page'>
        <Link to='/invoice'>
             <h3>Create Your invoice in seconds</h3>
            <Button variant ='contained'>CREATE YOUR INVOICE NOW!</Button>        
        </Link>
    </div>
  )
}

export default Home