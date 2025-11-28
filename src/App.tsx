import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CreateEvent from './pages/CreateEvent';
import EventCreated from './pages/EventCreated';
import EventVoting from './pages/EventVoting';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CreateEvent />} />
          <Route path="created/:id" element={<EventCreated />} />
          {/* Placeholder for the actual event view for participants */}
          <Route path="event/:eventId" element={<EventVoting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
