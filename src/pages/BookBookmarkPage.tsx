import { useQueryClient } from "@tanstack/react-query";
import { getAllCachedBooks, useBooks } from "../hooks/useBooks.ts";
import { useBookStore } from "../stores/useBookStore.ts";
import BookCard from "../components/BookCard.tsx";
 
function BookBookmarkPage() {
  const bookmarks = useBookStore((s) => s.bookmarks);
  const queryClient = useQueryClient();
  const { data, isPending, isError, error, refetch, isFetching } = useBooks();
 
  if (isPending)
    return (
      <div className="p-6">
        <div className="skeleton mx-auto mb-6 h-10 w-72"></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-96 w-full"></div>
          ))}
        </div>
      </div>
    );
 
  if (isError)
    return (
      <div role="alert" className="alert alert-error m-6">
        <span>{error.message}</span>
        <button
          className="btn btn-sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          Retry
        </button>
      </div>
    );
 
  // รวมหนังสือจาก Cache ของทุกหน้าที่เคยโหลด (ไม่ใช่แค่หน้า 1) แล้วตัดเล่มซ้ำออก
  const allBooks = [...data.results, ...getAllCachedBooks(queryClient)];
  const uniqueBooks = Array.from(new Map(allBooks.map((b) => [b.id, b])).values());

  // เลือกเฉพาะหนังสือที่ id อยู่ใน bookmarks
  const bookmarked = uniqueBooks.filter((book) => bookmarks.includes(book.id));
 
  return (
    <div className="p-6">
      <h1 className="mb-6 text-center text-4xl font-bold">
        Bookmarks ({bookmarked.length})
      </h1>
 
      {bookmarked.length === 0 ? (
        <p className="text-center opacity-60">ยังไม่มีหนังสือที่บุ๊กมาร์กไว้</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bookmarked.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
 
export default BookBookmarkPage;