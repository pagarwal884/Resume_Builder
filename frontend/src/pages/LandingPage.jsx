import React, { useContext, useState } from 'react'
import { landingPageStyles } from '../assets/dummypage'
import { LayoutTemplate, X, Menu } from 'lucide-react';
import { UserContext } from '../context/Usercontext';
import { useNavigate } from 'react-router-dom';
import { ProfileInfoCard } from './cards';

const LandingPage = () => {
  const { user } = useContext(UserContext); // ✅ lowercase 'user'
  const navigate = useNavigate();
  const [openAuthmodel , setopenAuthmodel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={landingPageStyles.container}>
      <header className={landingPageStyles.header}>
        <div className={landingPageStyles.headerContainer}>
          
          {/* Logo Section */}
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
            ) : (
              <Menu size={24} className={landingPageStyles.mobileMenuIcon}/>
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {user ? ( 
              <ProfileInfoCard />
            ) : (
              <button 
                className={landingPageStyles.desktopAuthButton} 
                onClick={() => setopenAuthmodel(true)}
              >
                <div className={landingPageStyles.desktopAuthButtonOverlay}></div>
                <span className={landingPageStyles.desktopAuthButtonText}>Get Started</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default LandingPage;
