import React, { useEffect } from 'react';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import Home from './pages/Home';
import './i18n'; // Import i18n configuration

function App() {
  const authProvider = useAuthProvider();

  return (
    <AuthContext.Provider value={authProvider}>
      <div className="App">
        <Home />
      </div>
    </AuthContext.Provider>
  );
}

export default App;