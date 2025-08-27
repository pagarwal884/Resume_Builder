import React, { useContext, useState } from 'react'
import { landingPageStyles } from '../assets/dummypage'
import { LayoutTemplate, X, Menu } from 'lucide-react';  // Icons from lucide-react
import { UserContext } from '../context/Usercontext';    // Import UserContext for global user state
import { useNavigate } from 'react-router-dom';          // Navigation hook
import { ProfileInfoCard } from './cards';               // Profile card component

const LandingPage = () => {
  // Access user data from context
  const { user } = useContext(UserContext); 
  const navigate = useNavigate(); // For programmatic navigation

  // State to control authentication modal visibility
  const [openAuthmodel , setopenAuthmodel] = useState(false);

  // State to control mobile navigation menu visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={landingPageStyles.container}>
      {/* ================= HEADER ================= */}
      <header className={landingPageStyles.header}>
        <div className={landingPageStyles.headerContainer}>
          
          {/* -------- Logo Section -------- */}
          <div className={landingPageStyles.logoContainer}>
            <div className={landingPageStyles.logoIcon}>
              <LayoutTemplate className={landingPageStyles.logoIconInner} />
            </div>
            <span className={landingPageStyles.logoText}>ResumeXpert</span>
          </div>

          {/* -------- Mobile Menu Button -------- */}
          <button
            className={landingPageStyles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} // Toggle mobile menu
          >
            {mobileMenuOpen ? (
              <X size={24} className={landingPageStyles.mobileMenuIcon} />  // Close icon
            ) : (
              <Menu size={24} className={landingPageStyles.mobileMenuIcon}/> // Hamburger menu icon
            )}
          </button>

          {/* -------- Desktop Navigation -------- */}
          <div className="hidden md:flex items-center">
            {user ? ( 
              // If user is logged in → show profile card
              <ProfileInfoCard />
            ) : (
              // If not logged in → show "Get Started" button
              <button 
                className={landingPageStyles.desktopAuthButton} 
                onClick={() => setopenAuthmodel(true)} // Open auth modal
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
