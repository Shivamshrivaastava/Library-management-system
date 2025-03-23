import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LibrarianNav } from '@/components/ui/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { BookOpen, Users, Clock, BookCheck, Bell, GraduationCap } from 'lucide-react';
import CustomReminderForm from '@/components/CustomReminderForm';

const Dashboard = () => {
  const { 
    books, 
    borrowRecords, 
    getStudentCount, 
    getActiveLoansCount,
    sendDueDateReminders 
  } = useLibrary();
  const [activeTab, setActiveTab] = useState('overview');
  
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.available).length;
  const activeLoans = getActiveLoansCount();
  const studentCount = getStudentCount();
  const lateReturns = borrowRecords.filter(record => {
    return !record.returned && new Date(record.dueDate) < new Date();
  }).length;
  
  const recentActivity = [...borrowRecords]
    .sort((a, b) => {
      const dateA = a.returnDate || a.borrowDate;
      const dateB = b.returnDate || b.borrowDate;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 5);
  
  const handleSendReminders = () => {
    const remindersSent = sendDueDateReminders();
    if (remindersSent > 0) {
      toast({
        title: "Reminders Sent",
        description: `${remindersSent} due date reminder${remindersSent > 1 ? 's' : ''} sent to students.`,
      });
    } else {
      toast({
        title: "No Reminders Sent",
        description: "There are no books due in the next 3 days.",
      });
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 hidden md:block">
        <LibrarianNav />
      </aside>
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Librarian Dashboard</h1>
              <p className="text-gray-600">Manage library resources and monitor activity</p>
            </div>
            <Button 
              className="gap-2"
              onClick={handleSendReminders}
            >
              <Bell className="h-4 w-4" />
              <span>Send Due Date Reminders</span>
            </Button>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="animate-slide-up [animation-delay:100ms]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-library-primary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-library-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Books</p>
                  <h3 className="text-2xl font-bold text-gray-800">{totalBooks}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-slide-up [animation-delay:200ms]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <BookCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Available Books</p>
                  <h3 className="text-2xl font-bold text-gray-800">{availableBooks}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-slide-up [animation-delay:300ms]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Loans</p>
                  <h3 className="text-2xl font-bold text-gray-800">{activeLoans}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-slide-up [animation-delay:350ms]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Students</p>
                  <h3 className="text-2xl font-bold text-gray-800">{studentCount}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card className="animate-slide-up [animation-delay:400ms]">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Late Returns</p>
                  <h3 className="text-2xl font-bold text-gray-800">{lateReturns}</h3>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
              <TabsTrigger value="reminders">Custom Reminders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Library Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Book Categories</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(books.reduce((acc, book) => {
                          acc[book.category] = (acc[book.category] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>))
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 6)
                          .map(([category, count]) => (
                            <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium">{category}</span>
                              <span className="bg-library-primary/10 text-library-primary text-sm py-1 px-2 rounded-full">
                                {count} books
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Popular Books</h3>
                      <div className="space-y-3">
                        {books
                          .sort((a, b) => {
                            const borrowedByA = a.borrowedBy?.length || 0;
                            const borrowedByB = b.borrowedBy?.length || 0;
                            return borrowedByB - borrowedByA;
                          })
                          .slice(0, 3)
                          .map(book => (
                            <div key={book.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                              <div className="h-12 w-12 bg-library-accent rounded-md overflow-hidden">
                                <img 
                                  src={book.coverImage} 
                                  alt={book.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{book.title}</h4>
                                <p className="text-xs text-gray-500">{book.author}</p>
                              </div>
                              <div className="text-xs bg-library-primary/10 text-library-primary py-1 px-2 rounded-full">
                                {book.borrowedBy?.length || 0} borrows
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recent" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.length === 0 ? (
                      <p className="text-gray-500 py-4 text-center">No recent activity.</p>
                    ) : (
                      recentActivity.map(record => {
                        const book = books.find(b => b.id === record.bookId);
                        const isReturn = record.returned;
                        const date = isReturn 
                          ? new Date(record.returnDate!) 
                          : new Date(record.borrowDate);
                        
                        return (
                          <div key={record.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className={`p-2 rounded-full ${isReturn ? 'bg-green-100' : 'bg-blue-100'}`}>
                              {isReturn ? (
                                <BookCheck className="h-5 w-5 text-green-600" />
                              ) : (
                                <BookOpen className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">
                                {isReturn ? 'Book Returned' : 'Book Borrowed'}: {book?.title}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Student ID: {record.studentId}
                              </p>
                            </div>
                            <div className="text-xs text-gray-500">
                              {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reminders" className="animate-fade-in">
              <CustomReminderForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
