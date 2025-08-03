import { User } from "lucide-react";
import { useState } from "react";
import "../styles/Sidebar.css";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { icon: "/assets/icons/ICON - Search.png", label: "Search", active: false },
    { icon: "/assets/icons/Group 46.png", label: "Home", active: true },
    { icon: "/assets/icons/Group 47.png", label: "TV Shows", active: false },
    { icon: "/assets/icons/Group 53.png", label: "Movies", active: false },
    { icon: "/assets/icons/Group 54.png", label: "Genres", active: false },
    { icon: "/assets/icons/Group 56.png", label: "Watch Later", active: false },
  ];

  const bottomItems = [
    { label: "LANGUAGE" },
    { label: "GET HELP" },
    { label: "EXIT" },
  ];

  return (
    <>
      {/* Gradient Overlay */}
      {isExpanded && (
        <div className="sidebar-gradient-overlay" />
      )}

      <div 
        className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className={`sidebar-user-profile ${isExpanded ? 'expanded' : 'collapsed'}`}>
          <div className={`sidebar-user-avatar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <User 
              size={24} 
              className={`sidebar-user-icon ${isExpanded ? 'expanded' : 'collapsed'}`}
            />
          </div>
          <span className={`sidebar-user-name ${isExpanded ? 'expanded' : 'collapsed'}`}>
            Daniel
          </span>
        </div>
        <div className={`sidebar-navigation ${isExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="sidebar-nav-items">
            {navItems.map((item, index) => {
              return (
                <button
                  key={index}
                  className={`sidebar-nav-item ${isExpanded ? 'expanded' : 'collapsed'} ${item.active ? 'active' : ''}`}
                >
                  <img 
                    src={item.icon}
                    alt={item.label}
                    className={`sidebar-nav-icon ${item.active ? 'active' : ''}`}
                    width={20}
                    height={20}
                  />
                  {isExpanded && (
                    <span className={`sidebar-nav-label ${item.active ? 'active' : ''} ${isExpanded ? 'expanded' : 'collapsed'}`}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacer to push bottom actions to bottom */}
        <div className="sidebar-spacer" />

        {/* Bottom Actions - using flex layout to stay at bottom */}
        <div className={`sidebar-bottom-actions ${isExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="sidebar-bottom-items">
            {bottomItems.map((item, index) => (
              <button
                key={index}
                className={`sidebar-bottom-item ${isExpanded ? 'expanded' : 'collapsed'} delay-${index + 1}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}