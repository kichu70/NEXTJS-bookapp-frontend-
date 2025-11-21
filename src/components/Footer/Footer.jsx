import React from 'react'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import "./Footer.css"
import FacebookIcon from '@mui/icons-material/Facebook';
import Button from '@mui/material/Button';
import InstagramIcon from '@mui/icons-material/Instagram';
const Footer = () => {
  return (
    <div className="footer" id='footer'>
      <div className='footer2'>
        <div className='footer-div2'>
          <h1>About</h1>
        </div>
        <div className='media-btns'>
          <Button className='media-btn'><LinkedInIcon/></Button>
          <Button className='media-btn'><FacebookIcon/></Button>
          <Button className='media-btn'><InstagramIcon/></Button>
        </div>
        <hr />
        <div className='media-cnt'>
                <p>BookApp — A platform to buy, sell, and explore books of all genres.</p>
          <p>© {new Date().getFullYear()} BookApp. All rights reserved.</p>
          <p>Designed & Developed by Ansif </p>
        </div>
      </div>
    </div>
  )
}

export default Footer