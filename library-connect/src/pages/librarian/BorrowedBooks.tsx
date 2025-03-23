
import React from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { LibrarianNav } from '@/components/ui/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from 'date-fns';

const BorrowedBooks = () => {
  const { getAllBorrowedBooks } = useLibrary();
  const borrowedBooks = getAllBorrowedBooks();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 hidden md:block">
        <LibrarianNav />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Borrowed Books</h1>
            <p className="text-gray-600">Track all currently borrowed books and monitor late returns</p>
          </header>
          
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Currently Borrowed Books</CardTitle>
            </CardHeader>
            <CardContent>
              {borrowedBooks.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No books are currently borrowed.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Borrow Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Late Fee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {borrowedBooks.map(({ book, borrowRecord }) => {
                      const dueDate = new Date(borrowRecord.dueDate);
                      const isOverdue = dueDate < new Date();
                      const borrowDate = new Date(borrowRecord.borrowDate);
                      
                      return (
                        <TableRow key={borrowRecord.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden">
                                <img 
                                  src={book.coverImage} 
                                  alt={book.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div>{book.title}</div>
                                <div className="text-xs text-gray-500">{book.author}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{borrowRecord.studentId}</TableCell>
                          <TableCell>{borrowDate.toLocaleDateString()}</TableCell>
                          <TableCell>{dueDate.toLocaleDateString()}</TableCell>
                          <TableCell>
                            {isOverdue ? (
                              <Badge variant="destructive">
                                Overdue by {formatDistance(dueDate, new Date())}
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                Due in {formatDistance(new Date(), dueDate)}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {borrowRecord.lateFee && borrowRecord.lateFee > 0 ? (
                              <span className="text-destructive font-semibold">
                                ${borrowRecord.lateFee.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BorrowedBooks;
