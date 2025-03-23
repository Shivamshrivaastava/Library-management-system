
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  coverImage: string;
  publicationYear: number;
  available: boolean;
  quantity: number;
  borrowedBy?: string[];
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  studentId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  returned: boolean;
  lateFee?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'librarian' | 'student';
}

export interface AuthUser extends User {
  password: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'due_date' | 'general' | 'overdue' | 'custom_reminder';
}
