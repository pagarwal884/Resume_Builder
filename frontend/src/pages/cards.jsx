import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/Usercontext"
import { cardStyles } from "../assets/dummypage"


// ===============================
// Profile Info Card Component
// ===============================
export const ProfileInfoCard = () => {
    const navigate = useNavigate()                        // For redirect after logout
    const { user, clearUser } = useContext(UserContext)   // Access user data + clearUser method from context

    // Handle user logout
    const handleLogout = () => {
        localStorage.clear(); // Clear all local storage (including token)
        clearUser();          // Reset user state in context
        navigate('/')         // Redirect to homepage
    }

    return (
        // Render card only if user exists (logged in)
        user && (
            <div className={cardStyles.profileCard}>
                
                {/* Profile Initials (first letter of user's name) */}
                <div className={cardStyles.profileInitialsContainer}>
                    <span className={cardStyles.profileInitialsText}>
                        {user.name ? user.name.charAt(0).toUpperCase() : ""}
                    </span>
                </div>

                {/* Full Name */}
                <div className={cardStyles.profileName}>
                    {user.name || ""}
                </div>

                {/* Logout Button */}
                <button 
                    className={cardStyles.logoutButton} 
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        )
    )
}
