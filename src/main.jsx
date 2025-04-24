import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './Redux/store.js';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import LoadingAnimation from './components/LoadingAnimation.jsx';

function Root() {
  const [isLoading, setIsLoading] = useState(true);
  const fixedLoadTime = 1000; // Fixed 1.5 seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, fixedLoadTime);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingAnimation estimatedTime={fixedLoadTime} />;
  }

  return (
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <App />
          </Router>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />);