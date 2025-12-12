import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
       <main className='flex-grow'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          {/* We'll add these routes later */}
          <Route path="/movies/popular" element={<Home type="popular" />} />
          <Route path="/movies/top-rated" element={<Home type="top-rated" />} />
          <Route path="/movies/upcoming" element={<Home type="upcoming" />} />
        </Routes>
       </main>
      </div>
    </Router>
  );
}

export default App;