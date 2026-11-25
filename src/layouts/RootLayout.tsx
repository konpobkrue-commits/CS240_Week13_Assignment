import { Link, Outlet } from 'react-router'
import { useBookStore } from '../stores/useBookStore.ts'

function RootLayout() {
	const bookmarkCount = useBookStore((s) => s.bookmarks.length)

	return (
		<>
			<nav className="navbar bg-base-200 px-6 gap-4">
				<Link to="/" className="btn btn-ghost">Home</Link>
				<Link to="/bookmarks" className="btn btn-ghost">
					Bookmarks
					<span className="badge badge-sm badge-warning">{bookmarkCount}</span>
				</Link>
				<Link to="/TestFetchAPI" className="btn btn-ghost">TestFetchAPI</Link>
			</nav>
			<Outlet />
		</>
	)
}
export default RootLayout
