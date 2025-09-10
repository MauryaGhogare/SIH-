import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faSeedling,
  faShieldAlt,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

const RoleSwitcher = ({ currentRole, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      id: 'guest',
      name: 'Guest',
      icon: faUser,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      description: 'Browse and read posts'
    },
    {
      id: 'farmer',
      name: 'Farmer',
      icon: faSeedling,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Post questions and share experiences'
    },
    {
      id: 'expert',
      name: 'Expert',
      icon: faShieldAlt,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Provide expert advice and moderation'
    },
    {
      id: 'moderator',
      name: 'Moderator',
      icon: faShieldAlt,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Moderate content and manage community'
    }
  ];

  const currentRoleData = roles.find(role => role.id === currentRole) || roles[0];

  const handleRoleSelect = (roleId) => {
    onRoleChange(roleId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
          currentRoleData.bgColor
        } ${currentRoleData.color} border-gray-300 hover:bg-opacity-80`}
      >
        <FontAwesomeIcon icon={currentRoleData.icon} />
        <span className="font-medium">{currentRoleData.name}</span>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Switch Role (Dev Only)
              </div>
              
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`w-full flex items-start space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    role.id === currentRole 
                      ? `${role.bgColor} ${role.color}` 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={role.icon} 
                    className={`mt-0.5 ${role.id === currentRole ? role.color : 'text-gray-400'}`}
                  />
                  <div className="text-left">
                    <div className="font-medium">{role.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {role.description}
                    </div>
                  </div>
                </button>
              ))}
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="px-3 py-2 text-xs text-gray-500">
                  This is a development feature for testing different user roles and permissions.
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoleSwitcher;
