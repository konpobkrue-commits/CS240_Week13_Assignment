import { useSearchParams } from "react-router";
import BookCard from "../components/BookCard";
import { useBooks } from "../hooks/useBooks";

const TOTAL_PAGES = 10;

function BookListPage() {
  // เก็บเลขหน้าไว้ใน URL ของเว็บเรา (/?page=3) ด้วย useSearchParams
  // รีเฟรชหรือกดย้อนกลับแล้วยังอยู่หน้าเดิม
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const page =
    Number.isInteger(pageParam) && pageParam >= 1 && pageParam <= TOTAL_PAGES
      ? pageParam
      : 1;

  const setPage = (n: number) => {
    setSearchParams({ page: String(n) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ส่งเลขหน้าเข้า Custom Query Hook
  const { data, isPending, isError, error, refetch, isFetching } = useBooks(page);

  // ปุ่มเปลี่ยนหน้า: แสดงตลอดเวลา ไม่หายไประหว่างโหลด
  const pagination = (
    <div className="join flex justify-center flex-wrap mb-6">
      <button
        className="join-item btn btn-sm"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        aria-label="หน้าก่อนหน้า"
      >
        «
      </button>
      {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          className={`join-item btn btn-sm ${n === page ? "btn-primary" : ""}`}
          onClick={() => setPage(n)}
          aria-current={n === page ? "page" : undefined}
        >
          {n}
        </button>
      ))}
      <button
        className="join-item btn btn-sm"
        onClick={() => setPage(page + 1)}
        disabled={page === TOTAL_PAGES}
        aria-label="หน้าถัดไป"
      >
        »
      </button>
    </div>
  );

  // Loading UI
  if (isPending)
    return (
      <div className="p-6">
        <div className="skeleton h-10 w-72 mx-auto mb-6"></div>
        {pagination}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card bg-base-100 shadow-md">
              <div className="skeleton h-72 w-full rounded-b-none"></div>
              <div className="card-body">
                <div className="skeleton h-5 w-full"></div>
                <div className="skeleton h-4 w-2/3"></div>
                <div className="skeleton h-6 w-24 ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  // Error UI
  if (isError)
    return (
      <div className="p-6">
        <h1 className="text-center text-4xl font-bold mb-6">Gutendex Books</h1>
        {pagination}
        <div role="alert" className="alert alert-error">
          <span>
            หน้า {page}: {error.message}
          </span>
          <button
            className="btn btn-sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching && <span className="loading loading-spinner loading-xs"></span>}
            Retry
          </button>
        </div>
      </div>
    );

  // Show book list result
  return (
    <div className="p-6">
      <h1 className="text-center text-4xl font-bold mb-6">
        Gutendex Books ({data.count.toLocaleString()})
      </h1>
      {pagination}
      <p className="text-center text-sm opacity-60 mb-4">
        หน้า {page} จาก {TOTAL_PAGES}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.results.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      <div className="mt-8">{pagination}</div>
    </div>
  );
}

export default BookListPage;
