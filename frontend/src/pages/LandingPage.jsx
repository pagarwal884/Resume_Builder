import React, { useContext, useState } from 'react'
import { landingPageStyles } from '../assets/dummypage'
import { LayoutTemplate, X, Menu, User } from 'lucide-react';
import { UserContext } from '../context/Usercontext';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
const {user} = useContext(UserContext)
const navigate = useNavigate()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className={landingPageStyles.container}>
      <header className={landingPageStyles.header}>
        <div className={landingPageStyles.headerContainer}>
          <div className={landingPageStyles.logoContainer}>
            <div className={landingPageStyles.logoIcon}>
              <LayoutTemplate className={landingPageStyles.logoIconInner} />
            </div>
            <span className={landingPageStyles.logoText}>ResumeXpert</span>
          </div>

          {/* Mobile menu button */}
          <button
            className={landingPageStyles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} className={landingPageStyles.mobileMenuIcon} />
            ) : <Menu size={24} className={landingPageStyles.mobileMenuIcon}/> 
            }
          </button>

          {/* Dekstop Navigation */}
          <div className='hidden md:flex items-center'>
            {User}
          </div>
        </div>
      </header>
    </div>
  )
}

export default LandingPage
