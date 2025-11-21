import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to CareForAll</h1>
                <p className="text-gray-600">Your next-generation fundraising platform</p>
              </div>
            } />
            <Route path="/campaigns" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Campaigns</h1>
                <p className="text-gray-600">Browse our fundraising campaigns</p>
              </div>
            } />
            <Route path="/about" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
                <p className="text-gray-600">Learn more about CareForAll</p>
              </div>
            } />
            <Route path="/contact" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                <p className="text-gray-600">Get in touch with our team</p>
              </div>
            } />
            <Route path="/login" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Login</h1>
                <p className="text-gray-600">Login to your account</p>
              </div>
            } />
            <Route path="/register" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Sign Up</h1>
                <p className="text-gray-600">Create a new account</p>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App
