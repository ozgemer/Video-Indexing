import Navbar from '../src/components/navbar/Navbar.jsx';
import './assets/global.css';
import Upload from './pages/upload/Upload.jsx';
import Signup from './pages/signup/Signup.jsx';
import Search from './pages/search/Search.jsx';
import { useState } from 'react';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import PlayVideo from './pages/playVideo/PlayVideo.jsx';
import Home from './pages/home/Home.jsx';
import styled from 'styled-components';
import Footer from './components/footer/Footer.jsx';

const Container = styled.div`
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

function App() {
  return (
    <Container>
      <BrowserRouter>
        <div>
          <Navbar />
          <Routes>
            <Route index element={<Home />} />
            <Route path='home' element={<Home />} />
            <Route path='upload' element={<Upload />} />
            <Route path='search' element={<Search />} />
            <Route path='playVideo/*' element={<PlayVideo />} />
            {/* <Route path="*" element={<NoPage />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
      <Footer />
    </Container>
  );
}

export default App;
