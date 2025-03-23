
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLibrary } from '@/context/LibraryContext';
import { StudentNav } from '@/components/ui/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookCard from '@/components/BookCard';
import { Book, BookOpen, Search, History, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { books, borrowRecords, currentUser, getBorrowedBooks } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // User's borrowed books
  const borrowedBooks = currentUser ? getBorrowedBooks(currentUser.id) : [];
  
  // Recently returned books
  const recentlyReturnedRecords = borrowRecords
    .filter(record => record.studentId === currentUser?.id && record.returned)
    .sort((a, b) => new Date(b.returnDate!).getTime() - new Date(a.returnDate!).getTime())
    .slice(0, 3);
  
  const recentlyReturnedBooks = recentlyReturnedRecords.map(record => 
    books.find(book => book.id === record.bookId)
  ).filter(Boolean);
  
  // Popular books (most borrowed)
  const popularBooks = [...books]
    .sort((a, b) => {
      const borrowingsA = borrowRecords.filter(record => record.bookId === a.id).length;
      const borrowingsB = borrowRecords.filter(record => record.bookId === b.id).length;
      return borrowingsB - borrowingsA;
    })
    .slice(0, 3);
  
  // Filter books based on search term
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 hidden md:block">
        <StudentNav />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome{currentUser ? `, ${currentUser.name}` : ''}!</h1>
            <p className="text-gray-600">Explore books and manage your borrowings</p>
          </header>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="animate-slide-up [animation-delay:100ms]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-library-primary/10 p-3 rounded-full">
                  <Book className="h-6 w-6 text-library-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Available Books</p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {books.filter(book => book.available).length}
                  </h3>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-slide-up [animation-delay:200ms]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Currently Borrowed</p>
                  <h3 className="text-2xl font-bold text-gray-800">{borrowedBooks.length}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-slide-up [animation-delay:300ms]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <History className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Reading History</p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {borrowRecords.filter(record => record.studentId === currentUser?.id).length}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Currently Borrowed Books */}
          {borrowedBooks.length > 0 && (
            <section className="mb-12 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Currently Borrowed</h2>
                <Link to="/student/borrowed">
                  <Button variant="link" className="gap-1 text-library-primary">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {borrowedBooks.slice(0, 3).map(book => (
                  <BookCard
                    key={book.id}
                    book={book}
                    href={`/student/books/${book.id}`}
                  />
                ))}
              </div>
            </section>
          )}
          
          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Discover Books</TabsTrigger>
              <TabsTrigger value="history">Reading History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-fade-in">
              <div className="space-y-8">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search books by title, author, category..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Popular Books */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">Popular Books</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {popularBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        href={`/student/books/${book.id}`}
                      />
                    ))}
                  </div>
                </section>
                
                {/* All Books (filtered) */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    {searchTerm ? `Search Results (${filteredBooks.length})` : 'Browse Books'}
                  </h2>
                  
                  {filteredBooks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No books found</h3>
                      <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredBooks.slice(0, 6).map((book) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          href={`/student/books/${book.id}`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {filteredBooks.length > 6 && (
                    <div className="text-center mt-8">
                      <Link to="/student/books">
                        <Button variant="outline" className="gap-2">
                          <span>See All Books</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </section>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Reading History</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentlyReturnedRecords.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No reading history yet</h3>
                      <p className="text-gray-500">Books you borrow and return will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {recentlyReturnedRecords.map(record => {
                        const book = books.find(b => b.id === record.bookId);
                        if (!book) return null;
                        
                        return (
                          <div key={record.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded">
                              <img 
                                src={book.coverImage} 
                                alt={book.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{book.title}</h4>
                              <p className="text-sm text-gray-500">{book.author}</p>
                              <div className="flex gap-4 mt-2 text-xs">
                                <span className="text-gray-500">
                                  Borrowed: {new Date(record.borrowDate).toLocaleDateString()}
                                </span>
                                <span className="text-gray-500">
                                  Returned: {new Date(record.returnDate!).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Link to={`/student/books/${book.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
