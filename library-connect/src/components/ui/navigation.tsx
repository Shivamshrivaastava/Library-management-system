
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLibrary } from '@/context/LibraryContext';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, UserCircle, LogOut, BookPlus, Library, Users, BookCheck } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-library-primary hover:text-white group",
        isActive ? "bg-library-primary text-white" : "text-gray-700 hover:text-white"
      )}
      onClick={onClick}
    >
      <Icon className={cn(
        "w-5 h-5 transition-transform duration-300",
        isActive ? "text-white" : "text-library-primary group-hover:text-white",
        "group-hover:scale-110"
      )} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export const LibrarianNav: React.FC = () => {
  const { logout, currentUser } = useLibrary();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3 mb-6">
        <Library className="h-6 w-6 text-library-primary" />
        <div>
          <h2 className="text-xl font-semibold">Librarian Portal</h2>
          {currentUser && (
            <p className="text-sm text-gray-500">{currentUser.name}</p>
          )}
        </div>
      </div>
      
      <nav className="flex flex-col gap-2">
        <NavItem to="/librarian" icon={Home} label="Dashboard" />
        <NavItem to="/librarian/books" icon={BookPlus} label="Manage Books" />
        <NavItem to="/librarian/borrowed" icon={BookCheck} label="Borrowed Books" />
        <NavItem to="/librarian/students" icon={Users} label="Students" />
      </nav>
      
      <div className="mt-auto pt-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 text-gray-700 hover:text-library-primary"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  );
};

export const StudentNav: React.FC = () => {
  const { logout, currentUser } = useLibrary();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-6 w-6 text-library-primary" />
        <div>
          <h2 className="text-xl font-semibold">Student Portal</h2>
          {currentUser && (
            <p className="text-sm text-gray-500">{currentUser.name}</p>
          )}
        </div>
      </div>
      
      <nav className="flex flex-col gap-2">
        <NavItem to="/student" icon={Home} label="Dashboard" />
        <NavItem to="/student/books" icon={BookOpen} label="Browse Books" />
        <NavItem to="/student/borrowed" icon={UserCircle} label="My Books" />
      </nav>
      
      <div className="mt-auto pt-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 text-gray-700 hover:text-library-primary"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  );
};
