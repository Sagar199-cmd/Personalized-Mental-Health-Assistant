import React from 'react';

const NotificationsPage: React.FC = () => {
  return (
    <div className="notifications-page">
      <h1>Notifications</h1>
      <div className="notification-list">
        <p>You have no new notifications at the moment.</p>
        {/* Replace with dynamic notifications list as needed */}
      </div>
    </div>
  );
};

export default NotificationsPage;
