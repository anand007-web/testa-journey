
import React from 'react';
import { TestProvider } from '@/context/TestContext';
import TestPage from '@/pages/TestPage';

const Index = () => {
  return (
    <TestProvider>
      <TestPage />
    </TestProvider>
  );
};

export default Index;
