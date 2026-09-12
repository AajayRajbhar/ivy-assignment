import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';

// You will create these view components in Step 6
import Login from './pages/Login';
import Browse from './pages/Browse';
import Detail from './pages/Detail';
import Saved from './pages/Saved';
import Insights from './pages/Insights';

function App() {
  const token = useSelector((state) => state.auth.accessToken);

  return (
    <BrowserRouter>
      <Routes>
        {!token ? (
          <Route path="*" element={<Login />} />
        ) : (
          <Route element={<Layout />}>
            <Route path="/" element={<Browse />} />
            <Route path="/listings/:id" element={<Detail />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;