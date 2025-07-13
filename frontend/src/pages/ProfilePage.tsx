import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-details">
        <p>Name: John Doe</p>
        <p>Email: johndoe@example.com</p>
        <p>Member Since: January 2021</p>
      </div>
    </div>
  );
};

export default ProfilePage;
