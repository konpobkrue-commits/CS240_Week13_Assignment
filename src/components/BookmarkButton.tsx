import { useBookStore } from "../stores/useBookStore.ts";

interface Props {
  bookId: number;
}

function BookmarkButton({ bookId }: Props) {
  // เลือกเฉพาะส่วนที่ใช้ เพื่อให้ re-render เฉพาะเมื่อค่านี้เปลี่ยน
  const isBookmarked = useBookStore((s) => s.bookmarks.includes(bookId));
  const toggleBookmark = useBookStore((s) => s.toggleBookmark);

  return (
    <button
      className={`btn btn-sm ${isBookmarked ? "btn-warning" : "btn-outline"}`}
      onClick={() => toggleBookmark(bookId)}
    >
      {isBookmarked ? "★ บุ๊กมาร์กแล้ว" : "☆ บุ๊กมาร์ก"}
    </button>
  );
}

export default BookmarkButton;
