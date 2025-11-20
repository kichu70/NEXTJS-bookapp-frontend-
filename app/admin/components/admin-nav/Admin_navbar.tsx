import React from 'react'
import  "./nav.css"
import axios from 'axios'
import GradientText from '@/src/components/ui/GradientText'
import Link from 'next/link'



const Admin_navbar = () => {
  return (
    <div className='nav1'>
      <div className="nav">
        <div className="nav-cnt1">
                  <Link href={"/"}><GradientText
                    colors={[
                      "#c619ccff",
                      "#2a62abff",
                      "#d9e97fff",
                      "#ad14adff",
                      "#1e57b2ff",
                    ]}
                    animationSpeed={3}
                    showBorder={false}
                    className="custom-class"
                  >   
                    Book App
                  </GradientText></Link>
                    <Link href={"/admin"}>  <button className='nav-btn'>user's</button></Link>
          <Link href={"/admin/all-books"}><button className='nav-btn'>book's</button></Link>
        </div>
      </div>
    </div>
  )
}

export default Admin_navbar
