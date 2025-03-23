import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { Book, BorrowRecord, User, AuthUser, Notification } from '@/types';

// Sample book data
const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    isbn: '978-0465050659',
    category: 'Design',
    description: 'A powerful primer on how—and why—some products satisfy customers while others only frustrate them.',
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
    publicationYear: 2013,
    available: true,
    quantity: 3
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-1847941831',
    category: 'Self-Help',
    description: 'An easy and proven way to build good habits and break bad ones.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    publicationYear: 2018,
    available: true,
    quantity: 5
  },
  {
    id: '3',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    isbn: '978-0141033570',
    category: 'Psychology',
    description: 'Why we make the choices we do, and how we can make better ones.',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    publicationYear: 2011,
    available: true,
    quantity: 2
  },
  {
    id: '4',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '978-0099590088',
    category: 'History',
    description: 'How Homo sapiens became Earth\'s dominant species.',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
    publicationYear: 2014,
    available: true,
    quantity: 4
  },
  {
    id: '5',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    isbn: '978-0722532935',
    category: 'Fiction',
    description: 'A magical story about following your dreams.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    publicationYear: 1988,
    available: true,
    quantity: 8
  },
];

// Initial borrow records
const INITIAL_BORROWS: BorrowRecord[] = [];

// Initial users
const INITIAL_USERS: AuthUser[] = [
  {
    id: 'admin-001',
    name: 'Admin Librarian',
    email: 'admin@library.com',
    password: 'admin',
    role: 'librarian'
  },
  {
    id: 'student-001',
    name: 'John Student',
    email: 'student@library.com',
    password: 'student',
    role: 'student'
  }
];

// Initial notifications
const INITIAL_NOTIFICATIONS: Notification[] = [];

// Late fee per day in dollars
const LATE_FEE_PER_DAY = 0.5;

interface LibraryContextType {
  books: Book[];
  borrowRecords: BorrowRecord[];
  currentUser: User | null;
  notifications: Notification[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addBook: (book: Omit<Book, 'id' | 'available'>) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  borrowBook: (bookId: string, studentId: string) => void;
  returnBook: (bookId: string, studentId: string) => void;
  getBookById: (id: string) => Book | undefined;
  getBorrowedBooks: (studentId: string) => Book[];
  getAllBorrowedBooks: () => { book: Book; borrowRecord: BorrowRecord }[];
  calculateLateFee: (dueDate: Date) => number;
  getStudentCount: () => number;
  getActiveLoansCount: () => number;
  sendNotification: (userId: string, message: string, type: Notification['type']) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getUserNotifications: (userId: string) => Notification[];
  sendDueDateReminders: () => number;
  sendCustomDateReminders: (date: Date, message?: string) => number;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(() => {
    const savedBooks = localStorage.getItem('library_books');
    return savedBooks ? JSON.parse(savedBooks) : INITIAL_BOOKS;
  });
  
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(() => {
    const savedRecords = localStorage.getItem('library_borrows');
    return savedRecords ? JSON.parse(savedRecords) : INITIAL_BORROWS;
  });
  
  const [users, setUsers] = useState<AuthUser[]>(() => {
    const savedUsers = localStorage.getItem('library_users');
    return savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('library_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem('library_notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('library_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('library_borrows', JSON.stringify(borrowRecords));
  }, [borrowRecords]);
  
  useEffect(() => {
    localStorage.setItem('library_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('library_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('library_user');
    }
  }, [currentUser]);
  
  useEffect(() => {
    localStorage.setItem('library_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const updateLateFees = () => {
      const now = new Date();
      const updatedRecords = borrowRecords.map(record => {
        if (!record.returned && new Date(record.dueDate) < now) {
          const lateFee = calculateLateFee(new Date(record.dueDate));
          return { ...record, lateFee };
        }
        return record;
      });
      
      if (JSON.stringify(updatedRecords) !== JSON.stringify(borrowRecords)) {
        setBorrowRecords(updatedRecords);
      }
    };
    
    updateLateFees();
    
    const intervalId = setInterval(updateLateFees, 86400000);
    
    return () => clearInterval(intervalId);
  }, [borrowRecords]);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...safeUser } = user;
      setCurrentUser(safeUser);
      return true;
    }
    
    return false;
  };
  
  const logout = () => {
    setCurrentUser(null);
  };

  const calculateLateFee = (dueDate: Date): number => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (due > now) return 0;
    
    const diffTime = Math.abs(now.getTime() - due.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return parseFloat((diffDays * LATE_FEE_PER_DAY).toFixed(2));
  };

  const addBook = (bookData: Omit<Book, 'id' | 'available'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      available: true
    };
    
    setBooks(prevBooks => [...prevBooks, newBook]);
    toast({
      title: "Book Added",
      description: `${newBook.title} has been added to the library.`,
    });
  };

  const updateBook = (updatedBook: Book) => {
    setBooks(prevBooks => 
      prevBooks.map(book => book.id === updatedBook.id ? updatedBook : book)
    );
    toast({
      title: "Book Updated",
      description: `${updatedBook.title} has been updated.`,
    });
  };

  const deleteBook = (id: string) => {
    const bookToDelete = books.find(book => book.id === id);
    if (!bookToDelete) return;
    
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    toast({
      title: "Book Deleted",
      description: `${bookToDelete.title} has been removed from the library.`,
    });
  };

  const borrowBook = (bookId: string, studentId: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    if (book.quantity <= 0) {
      toast({
        title: "Cannot Borrow Book",
        description: "This book is not available for borrowing.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedBook = {
      ...book,
      quantity: book.quantity - 1,
      available: book.quantity > 1,
      borrowedBy: [...(book.borrowedBy || []), studentId]
    };
    
    setBooks(prevBooks => 
      prevBooks.map(b => b.id === bookId ? updatedBook : b)
    );
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    
    const newBorrow: BorrowRecord = {
      id: Date.now().toString(),
      bookId,
      studentId,
      borrowDate: new Date(),
      dueDate,
      returned: false,
      lateFee: 0
    };
    
    setBorrowRecords(prev => [...prev, newBorrow]);
    
    toast({
      title: "Book Borrowed",
      description: `You have borrowed "${book.title}". Due date: ${dueDate.toLocaleDateString()}`
    });
  };

  const returnBook = (bookId: string, studentId: string) => {
    const borrowRecord = borrowRecords.find(
      record => record.bookId === bookId && record.studentId === studentId && !record.returned
    );
    
    if (!borrowRecord) return;
    
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const updatedBook = {
      ...book,
      quantity: book.quantity + 1,
      available: true,
      borrowedBy: (book.borrowedBy || []).filter(id => id !== studentId)
    };
    
    setBooks(prevBooks => 
      prevBooks.map(b => b.id === bookId ? updatedBook : b)
    );
    
    const lateFee = calculateLateFee(new Date(borrowRecord.dueDate));
    
    const updatedRecords = borrowRecords.map(record => {
      if (record.id === borrowRecord.id) {
        return {
          ...record,
          returnDate: new Date(),
          returned: true,
          lateFee
        };
      }
      return record;
    });
    
    setBorrowRecords(updatedRecords);
    
    let toastMessage = `Thank you for returning "${book.title}".`;
    if (lateFee > 0) {
      toastMessage += ` Late fee: $${lateFee}`;
    }
    
    toast({
      title: "Book Returned",
      description: toastMessage
    });
  };

  const getBookById = (id: string) => {
    return books.find(book => book.id === id);
  };

  const getBorrowedBooks = (studentId: string) => {
    const borrowedBookIds = borrowRecords
      .filter(record => record.studentId === studentId && !record.returned)
      .map(record => record.bookId);
    
    return books.filter(book => borrowedBookIds.includes(book.id));
  };
  
  const getAllBorrowedBooks = () => {
    return borrowRecords
      .filter(record => !record.returned)
      .map(record => {
        const book = books.find(b => b.id === record.bookId);
        return {
          book: book!,
          borrowRecord: {
            ...record,
            lateFee: calculateLateFee(new Date(record.dueDate))
          }
        };
      })
      .filter(item => item.book !== undefined);
  };

  const getStudentCount = () => {
    return users.filter(user => user.role === 'student').length;
  };

  const getActiveLoansCount = () => {
    return borrowRecords.filter(record => !record.returned).length;
  };

  const sendNotification = (userId: string, message: string, type: Notification['type'] = 'general') => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      userId,
      message,
      timestamp: new Date(),
      read: false,
      type
    };
    
    setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    
    return newNotification;
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const getUserNotifications = (userId: string) => {
    return notifications
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const sendDueDateReminders = () => {
    const now = new Date();
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(now.getDate() + 3);
    
    const upcomingDueRecords = borrowRecords.filter(record => {
      const dueDate = new Date(record.dueDate);
      return (
        !record.returned && 
        dueDate > now && 
        dueDate <= threeDaysFromNow
      );
    });
    
    upcomingDueRecords.forEach(record => {
      const book = books.find(b => b.id === record.bookId);
      if (book) {
        const dueDate = new Date(record.dueDate);
        const message = `Reminder: "${book.title}" is due on ${dueDate.toLocaleDateString()}.`;
        sendNotification(record.studentId, message, 'due_date');
      }
    });
    
    return upcomingDueRecords.length;
  };

  const sendCustomDateReminders = (selectedDate: Date, customMessage?: string) => {
    const upcomingDueRecords = borrowRecords.filter(record => {
      if (record.returned) return false;
      
      // Find records where the due date is on or before the selected date
      const dueDate = new Date(record.dueDate);
      const targetDate = new Date(selectedDate);
      
      // Reset time part for comparison (compare only the date)
      dueDate.setHours(0, 0, 0, 0);
      targetDate.setHours(0, 0, 0, 0);
      
      return dueDate <= targetDate;
    });
    
    upcomingDueRecords.forEach(record => {
      const book = books.find(b => b.id === record.bookId);
      if (book) {
        const dueDate = new Date(record.dueDate);
        const message = customMessage || 
          `Reminder: "${book.title}" is due on ${dueDate.toLocaleDateString()}. Please return it soon to avoid late fees.`;
        
        // Send as a custom reminder type
        sendNotification(record.studentId, message, 'custom_reminder');
      }
    });
    
    return upcomingDueRecords.length;
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        borrowRecords,
        currentUser,
        notifications,
        login,
        logout,
        addBook,
        updateBook,
        deleteBook,
        borrowBook,
        returnBook,
        getBookById,
        getBorrowedBooks,
        getAllBorrowedBooks,
        calculateLateFee,
        getStudentCount,
        getActiveLoansCount,
        sendNotification,
        markNotificationAsRead,
        getUserNotifications,
        sendDueDateReminders,
        sendCustomDateReminders
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
