
import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { DashboardOverview } from '@/components/DashboardOverview';

const Dashboard = () => {
  return (
    <PageLayout title="Dashboard">
      <DashboardOverview />
    </PageLayout>
  );
};

export default Dashboard;
