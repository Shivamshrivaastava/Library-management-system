
import React, { useState } from 'react';
import { useLibrary } from '@/context/LibraryContext';
import { LibrarianNav } from '@/components/ui/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookForm } from '@/components/BookForm';
import BookCard from '@/components/BookCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Book, Search, Plus, Edit, Trash2, List, Grid } from 'lucide-react';
import { Book as BookType } from '@/types';

const ManageBooks = () => {
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [bookToEdit, setBookToEdit] = useState<BookType | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );
  
  const handleAddBook = (data: Omit<BookType, 'id' | 'available'>) => {
    addBook(data);
    setIsAddDialogOpen(false);
  };
  
  const handleEditBook = (data: Omit<BookType, 'id' | 'available'>) => {
    if (bookToEdit) {
      updateBook({
        ...bookToEdit,
        ...data,
      });
    }
    setIsEditDialogOpen(false);
    setBookToEdit(null);
  };
  
  const handleDeleteConfirm = () => {
    if (bookToDelete) {
      deleteBook(bookToDelete);
      setBookToDelete(null);
    }
  };
  
  const openEditDialog = (book: BookType) => {
    setBookToEdit(book);
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 hidden md:block">
        <LibrarianNav />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Book className="h-8 w-8 text-library-primary" />
                Manage Books
              </h1>
              <p className="text-gray-600">Add, edit, and remove books from the library</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="shrink-0 gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Book</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add New Book</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new book to the library.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <BookForm onSubmit={handleAddBook} />
                </div>
              </DialogContent>
            </Dialog>
          </header>
          
          {/* Search and View Options */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search books by title, author, category..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={view === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setView('grid')}
                className="h-10 w-10"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setView('list')}
                className="h-10 w-10"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Books Grid/List */}
          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Book className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">No books found</h3>
              <p className="text-gray-500 mt-2">
                {searchTerm
                  ? `No books match your search criteria "${searchTerm}"`
                  : "Start by adding some books to your library"}
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredBooks.map((book) => (
                <div key={book.id} className="group animate-slide-up">
                  <BookCard
                    book={book}
                    view={view}
                    href={`/librarian/books/${book.id}`}
                    actionButton={
                      <div className="flex justify-end gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.preventDefault();
                            openEditDialog(book);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.preventDefault();
                                setBookToDelete(book.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove "{book.title}" from the library. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteConfirm}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update the book information.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {bookToEdit && (
              <BookForm 
                initialData={bookToEdit}
                onSubmit={handleEditBook}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBooks;
