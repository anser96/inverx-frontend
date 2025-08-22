import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { DashboardProvider } from '../context/DashboardContext';

const Dashboard = () => {
  return (
    <DashboardProvider>
      <DashboardLayout />
    </DashboardProvider>
  );
};

export default Dashboard;
