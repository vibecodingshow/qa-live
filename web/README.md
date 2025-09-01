# Q&A Platform

A modern, responsive web application for managing questions and answers during presentations or events. Built with React, TypeScript, and Tailwind CSS.

## Overview

This application provides a streamlined platform where audience members can submit questions anonymously, and speakers can log in to answer them. The interface features real-time statistics, search functionality, and an intuitive design optimized for both mobile and desktop use.

## Features

### For Audience (Anonymous Users)
- View all submitted questions and their answers
- Submit new questions via floating action button
- Search and filter through questions
- Responsive design for mobile and desktop

### For Speakers (Authenticated Users)
- Secure login system with username/password
- Answer questions with text responses or mark as "answered live on stage"
- View question statistics (total, answered, unanswered)
- Prioritized question list showing unanswered questions first

### Technical Features
- Clean, modern UI with red, dark-blue, white, and black color scheme
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Component-based architecture with React hooks
- Modal-based interactions for forms and authentication

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnswerModal.tsx
│   ├── FloatingSubmitButton.tsx
│   ├── Header.tsx
│   ├── LoginModal.tsx
│   ├── QuestionCard.tsx
│   ├── QuestionModal.tsx
│   └── StatisticsCards.tsx
├── data/               # Sample data files
│   ├── Questions.ts
│   └── SpeakerUsers.ts
├── hooks/              # Custom React hooks
│   └── useAuth.ts
├── pages/              # Page components
│   └── Home.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── dateUtils.ts
└── App.tsx             # Main application component
```

## Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

## Usage Guide

### For Audience Members
1. **View Questions:** Browse through all submitted questions on the home page
2. **Search:** Use the search bar in the header to find specific questions
3. **Submit Questions:** Click the floating "+" button in the bottom-right corner
4. **Fill the Form:** Enter your name, question title, and detailed description
5. **Submit:** Click "Submit Question" to add your question to the list

### For Speakers
1. **Login:** Click "Speaker Login" in the top-right corner
2. **Credentials:** Use the sample speaker accounts (credentials are stored in `src/data/SpeakerUsers.ts`)
3. **Answer Questions:** Click "Select to Answer" on any unanswered question
4. **Choose Answer Type:** 
   - Provide a written answer directly in the app
   - Mark as "answered live on stage" for questions you'll address during your presentation
5. **Submit:** Your answer will be immediately visible to all users

### Sample Speaker Accounts
The application includes sample speaker accounts for testing. The credentials are stored in the `src/data/SpeakerUsers.ts` file. In a production environment, these would be managed through a secure backend system.

## Color Scheme

The application uses a professional color palette:
- **Primary Red:** `#DC2626` (red-600)
- **Dark Blue:** `#1E3A8A` (blue-900)
- **White:** `#FFFFFF`
- **Black:** `#000000`
- **Supporting colors:** Various grays for text and backgrounds

## Development Notes

- **No Backend Required:** This is a frontend-only application using sample data
- **Responsive Design:** Optimized for mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Modern React Patterns:** Uses functional components, hooks, and TypeScript throughout
- **Accessibility:** Includes proper ARIA labels, keyboard navigation, and semantic HTML
- **Performance:** Implements React.memo and proper state management for optimal performance

## Future Enhancements

This current implementation focuses on the UI and user experience. Future versions could include:
- Backend API integration with a database
- Real-time updates using WebSockets
- User registration and profile management
- Question categories and tagging
- Analytics and reporting features
- Export functionality for Q&A sessions

## Browser Support

Modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is available for educational and demonstration purposes.