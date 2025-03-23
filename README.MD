
# LibraryConnect - Modern Library Management System

## Project Overview

LibraryConnect is a comprehensive library management system designed to streamline the operations of educational libraries. It provides separate interfaces for librarians and students, making it easy to manage books, track borrowings, and facilitate communication between library staff and patrons.

### Key Features

#### For Librarians
- **Dashboard with Analytics**: View key metrics like active loans, student count, and book availability
- **Book Management**: Add, edit, and remove books from the library catalog
- **Borrowing Oversight**: Track all borrowed books, due dates, and late returns
- **Notification System**: Send reminders to students about upcoming due dates
- **Custom Reminders**: Schedule custom date reminders for specific books or general announcements

#### For Students
- **Book Discovery**: Browse and search through the available book catalog
- **Book Borrowing**: Easily borrow books with a simple checkout process
- **Reading History**: Track personal borrowing history
- **Notifications**: Receive alerts about due dates and important announcements
- **Book Details**: Access comprehensive information about each book

### Technical Details

This project is built with modern web technologies:

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API and TanStack Query
- **Routing**: React Router Dom

## Getting Started

### Demo Accounts

For demonstration purposes, you can use the following credentials:
- **Librarian**: admin@library.com / admin
- **Student**: student@library.com / student

### Local Development

```sh
# Install dependencies
npm i

# Start the development server
npm run dev
```

## Project Structure

- `/src/components`: Reusable UI components
- `/src/context`: Global application state
- `/src/pages`: Application views for different user roles
- `/src/types`: TypeScript type definitions

## Future Enhancements

- Book reservation system
- Fine payment processing
- Advanced book recommendation engine
- Digital book support
- Inter-library loan management

## License

[MIT](LICENSE)
