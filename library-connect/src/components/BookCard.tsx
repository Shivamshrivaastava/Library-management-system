
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Book } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Users } from 'lucide-react';

interface BookCardProps {
  book: Book;
  view?: 'grid' | 'list';
  href: string;
  actionButton?: React.ReactNode;
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  view = 'grid', 
  href,
  actionButton
}) => {
  const isGrid = view === 'grid';
  
  return (
    <div 
      className={cn(
        "overflow-hidden rounded-xl book-card-hover",
        isGrid ? "flex flex-col h-full" : "flex flex-row h-48"
      )}
    >
      <Link 
        to={href}
        className={cn(
          "group relative overflow-hidden glass-card",
          isGrid ? "flex flex-col h-full" : "flex flex-row h-full"
        )}
      >
        <div 
          className={cn(
            "overflow-hidden relative",
            isGrid ? "h-48 w-full" : "h-full w-48 flex-shrink-0"
          )}
        >
          <img 
            src={book.coverImage} 
            alt={`${book.title} cover`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {book.available ? (
              <Badge variant="outline" className="bg-green-500 bg-opacity-90 text-white border-none">
                Available
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-500 bg-opacity-90 text-white border-none">
                Unavailable
              </Badge>
            )}
          </div>
        </div>
        
        <div className={cn(
          "flex flex-col p-4 flex-grow",
          isGrid ? "" : "w-2/3"
        )}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-library-primary transition-colors">
              {book.title}
            </h3>
            <div className="flex items-center text-gray-500 text-sm">
              <Bookmark className="w-4 h-4 mr-1" />
              <span>{book.category}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">{book.author}</p>
          
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {book.description}
          </p>
          
          <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              <span>{book.quantity} copies</span>
            </div>
            
            <span className="text-xs bg-library-accent px-2 py-1 rounded-full">
              {book.publicationYear}
            </span>
          </div>
        </div>
      </Link>
      
      {actionButton && (
        <div className="p-2 bg-white border-t">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default BookCard;
