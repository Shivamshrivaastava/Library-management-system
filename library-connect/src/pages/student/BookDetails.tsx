
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '@/context/LibraryContext';
import { Button } from '@/components/ui/button';
import { StudentNav } from '@/components/ui/navigation';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, ChevronLeft, Calendar, User, Hash, 
  Bookmark, Check, Clock, AlertTriangle 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookById, borrowBook, returnBook, currentUser, borrowRecords } = useLibrary();
  
  const book = id ? getBookById(id) : undefined;
  
  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Book Not Found</h1>
          <p className="text-gray-600 mb-4">The book you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/student')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  // Check if the current user has borrowed this book
  const hasBorrowed = currentUser && book.borrowedBy?.includes(currentUser.id);
  
  // Get borrow record if exists
  const borrowRecord = currentUser 
    ? borrowRecords.find(record => 
        record.bookId === book.id && 
        record.studentId === currentUser.id && 
        !record.returned
      )
    : undefined;
  
  const handleBorrow = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to borrow books.",
        variant: "destructive"
      });
      return;
    }
    
    borrowBook(book.id, currentUser.id);
  };
  
  const handleReturn = () => {
    if (!currentUser) return;
    returnBook(book.id, currentUser.id);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 hidden md:block">
        <StudentNav />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6 gap-1 text-gray-500 hover:text-gray-800"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <div className="bg-white shadow-sm rounded-xl overflow-hidden animate-slide-up">
            <div className="md:flex">
              {/* Book Cover */}
              <div className="md:w-1/3 bg-gray-100 flex justify-center items-center p-6">
                <div className="aspect-[2/3] w-full max-w-[250px] overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src={book.coverImage} 
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Book Details */}
              <div className="md:w-2/3 p-6 md:p-8 flex flex-col">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge className="bg-library-primary">{book.category}</Badge>
                  {book.available ? (
                    <Badge variant="outline" className="bg-green-500 text-white border-none">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-500 text-white border-none">
                      Unavailable
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-6">by {book.author}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Published: {book.publicationYear}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">ISBN: {book.isbn}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Category: {book.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Available Copies: {book.quantity}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
                  <p className="text-gray-600">{book.description}</p>
                </div>
                
                {borrowRecord && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Due Date: {new Date(borrowRecord.dueDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-blue-600">
                        Borrowed on: {new Date(borrowRecord.borrowDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="mt-auto">
                  {hasBorrowed ? (
                    <Button 
                      onClick={handleReturn}
                      className="bg-green-600 hover:bg-green-700 gap-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>Return Book</span>
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleBorrow}
                      disabled={!book.available || book.quantity <= 0}
                      className={`gap-2 ${!book.available || book.quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Borrow Book</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetails;
