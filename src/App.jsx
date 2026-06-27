import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Create from './pages/Create';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Post from './pages/Post';
import PostDetail from './pages/PostDetail';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#fafbfc]">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<Post />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/create" element={<Create />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/post" element={<Post />} /> {/* Fallback compatibility */}
            </Routes>
          </main>
          {/* Global Footer */}
          <footer className="bg-white border-t border-slate-100 py-8 mt-16 text-center text-sm text-slate-500 font-medium">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p>&copy; {new Date().getFullYear()} Inkognito. Express yourself freely and safely. Built for the modern web.</p>
            </div>
          </footer>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
