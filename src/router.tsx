import { createBrowserRouter } from 'react-router'
import RootLayout from './layouts/RootLayout.tsx'
import BookListPage from './pages/BookListPage.tsx'
import BookDetailPage from './pages/BookDetailPage.tsx'
import BookBookmarkPage from './pages/BookBookmarkPage.tsx'
import TestFetchAPI from './pages/TestFetchAPI.tsx'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{ index: true, element: <BookListPage /> },
			{ path: 'books/:id', element: <BookDetailPage /> },
			{ path: 'bookmarks', element: <BookBookmarkPage /> },
			{ path: 'TestFetchAPI', element: <TestFetchAPI /> },
		],
	},
])
