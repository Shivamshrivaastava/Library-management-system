
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Library } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 shadow-sm bg-white">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-library-primary" />
            <h1 className="text-2xl font-semibold text-gray-800">LibraryConnect</h1>
          </div>
          <Button onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-library-accent/20">
        <div className="container max-w-5xl mx-auto text-center">
          <div className="animate-slide-down">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 tracking-tight">
              Welcome to <span className="text-library-primary">LibraryConnect</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              A modern, intuitive library management system designed for both librarians and students.
            </p>
          </div>
          
          <div className="mt-12 max-w-md mx-auto animate-slide-up">
            <Button 
              size="lg"
              className="w-full bg-library-primary hover:bg-library-primary/90 text-xl py-6"
              onClick={() => navigate('/login')}
            >
              Login to Your Account
            </Button>
            <div className="mt-4 text-gray-600">
              <p>Login credentials for demo:</p>
              <p><strong>Librarian:</strong> admin@library.com / admin</p>
              <p><strong>Student:</strong> student@library.com / student</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white p-6 border-t border-gray-200">
        <div className="container max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} LibraryConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
