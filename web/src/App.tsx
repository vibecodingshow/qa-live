import React from 'react';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import Home from './pages/Home';

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