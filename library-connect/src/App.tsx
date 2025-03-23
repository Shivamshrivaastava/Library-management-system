
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LibraryProvider } from "@/context/LibraryContext";
import { useLibrary } from "@/context/LibraryContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Librarian Routes
import LibrarianDashboard from "./pages/librarian/Dashboard";
import ManageBooks from "./pages/librarian/ManageBooks";
import BorrowedBooks from "./pages/librarian/BorrowedBooks";

// Student Routes
import StudentDashboard from "./pages/student/Dashboard";
import BookDetails from "./pages/student/BookDetails";

// Create a client
const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: JSX.Element, 
  requiredRole: 'librarian' | 'student' 
}) => {
  const { currentUser } = useLibrary();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== requiredRole) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }
  
  return children;
};

// App Routes Component
const AppRoutes = () => {
  const { currentUser } = useLibrary();
  
  return (
    <Routes>
      <Route path="/" element={currentUser ? <Navigate to={`/${currentUser.role}`} /> : <Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Librarian Routes */}
      <Route path="/librarian" element={
        <ProtectedRoute requiredRole="librarian">
          <LibrarianDashboard />
        </ProtectedRoute>
      } />
      <Route path="/librarian/books" element={
        <ProtectedRoute requiredRole="librarian">
          <ManageBooks />
        </ProtectedRoute>
      } />
      <Route path="/librarian/books/:id" element={
        <ProtectedRoute requiredRole="librarian">
          <ManageBooks />
        </ProtectedRoute>
      } />
      <Route path="/librarian/borrowed" element={
        <ProtectedRoute requiredRole="librarian">
          <BorrowedBooks />
        </ProtectedRoute>
      } />
      
      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute requiredRole="student">
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student/books" element={
        <ProtectedRoute requiredRole="student">
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student/books/:id" element={
        <ProtectedRoute requiredRole="student">
          <BookDetails />
        </ProtectedRoute>
      } />
      <Route path="/student/borrowed" element={
        <ProtectedRoute requiredRole="student">
          <StudentDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Root App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LibraryProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LibraryProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
