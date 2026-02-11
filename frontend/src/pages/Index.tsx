import React, { useState } from 'react';
import Header from '@/components/Header';
import OKRContainer from '@/components/OKRContainer';
import SmartGoalResults from '@/components/SmartGoalResults';
import Login from '@/components/Login';
import toast, { Toaster } from 'react-hot-toast';
import {OKRData} from '@/types/index'; // Assuming you have a types file for OKRData
import { UserProp } from '@/types/user';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submittedOKR, setSubmittedOKR] = useState<OKRData | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [isFallbackData, setIsFallbackData] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProp | null>(null);
  const handleLogin = (user: UserProp) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    toast.success(`Welcome, ${user.name || 'User'}!`, {
      icon: '👋',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
      duration: 3000,
    });
  };
  const handleOKRSubmit = (data: OKRData, result?: any, isFallback?: boolean) => {
    // console.log('OKR submitted:', data);
    setSubmittedOKR(data);
    if (result) {
      console.log('AI result received:', result);
      setAiResult(result);
      setIsFallbackData(!!isFallback);
    }
  };  const handleNewOKR = () => {
    setSubmittedOKR(null);
    setAiResult(null);
    setIsFallbackData(false);
  };  const handleLogout = () => {
    setIsLoggedIn(false);
    setSubmittedOKR(null);
    setAiResult(null);
    setIsFallbackData(false);
    setCurrentUser(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Toaster position="top-center" reverseOrder={false}/>
      <Header />
      
      <main className="py-8 px-4">
        {!submittedOKR ? (
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Define Your Objectives & Key Results
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">                Create measurable goals aligned with business objectives. Our system will generate
                SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) and KPIs to help you achieve success.
              </p>            </div>
            <OKRContainer onSubmit={handleOKRSubmit} user={currentUser} />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Your SMART Goals Action Plan
              </h2>
              <p className="text-slate-600 mb-4">
                Below are your generated SMART goals and key performance indicators.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleNewOKR}
                  className="text-blue-600 hover:text-blue-800 font-semibold underline transition-colors"
                >
                  Create New OKR
                </button>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 font-semibold underline transition-colors"
                >
                  Logout
                </button>              </div>
            </div>
            <SmartGoalResults okrData={submittedOKR} aiResult={aiResult} isFallback={isFallbackData} />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-300">
            © {new Date().getFullYear()} OKR Management Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
