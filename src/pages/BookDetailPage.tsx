import { Link, useParams } from "react-router";
import BookmarkButton from "../components/BookmarkButton.tsx";
import { useBookDetail } from "../hooks/useBooks.ts";

function BookDetailPage() {
  const { id = "" } = useParams(); // route books/:id มี id เสมอ ใส่ค่าเริ่มต้นไว้ให้ type เป็น string
  const { data: book, isPending, isError, error, refetch, isFetching } = useBookDetail(id);

  //TODO: Get Book Detail from useBookDetail by book id
  if (isPending)
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="skeleton mb-6 h-8 w-32"></div>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="skeleton h-96 w-full md:w-72"></div>
          <div className="flex flex-1 flex-col gap-4">
            <div className="skeleton h-10 w-3/4"></div>
            <div className="skeleton h-5 w-1/2"></div>
            <div className="skeleton h-5 w-1/3"></div>
            <div className="skeleton h-32 w-full"></div>
          </div>
        </div>
      </div>
    );

  // TODO: Error UI
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

  // TODO: Get bool cover and read url from the book data
  const cover = book.formats["image/jpeg"];
  const readUrl = book.formats["text/html"];

  // TODO: Show book detail result
  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link to="/" className="btn btn-ghost btn-sm mb-4">
        ← กลับ
      </Link>

      <div className="card bg-base-100 shadow-md md:card-side">
        <figure className="p-4 md:w-72 md:shrink-0">
          {cover ? (
            <img
              src={cover}
              alt={book.title}
              className="w-full rounded-xl object-cover"
            />
          ) : (
            <div className="skeleton flex h-72 w-full items-center justify-center rounded-xl text-sm opacity-60">
              ไม่มีรูปปก
            </div>
          )}
        </figure>

        <div className="card-body">
          <h1 className="card-title text-2xl">{book.title}</h1>
          <p className="opacity-70">
            ผู้แต่ง: {book.authors.map((a) => a.name).join(", ") || "ไม่ทราบ"}
          </p>
          <p className="text-sm opacity-60">
            ดาวน์โหลด {book.download_count.toLocaleString()} ครั้ง
          </p>

          {book.languages && book.languages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {book.languages.map((lang) => (
                <span key={lang} className="badge badge-neutral">
                  {lang}
                </span>
              ))}
            </div>
          )}

          {book.subjects && book.subjects.length > 0 && (
            <div className="mt-2">
              <h2 className="mb-2 font-semibold">หัวข้อ</h2>
              <div className="flex flex-wrap gap-2">
                {book.subjects.slice(0, 8).map((s) => (
                  <span key={s} className="badge badge-outline">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="card-actions mt-4 items-center">
            <BookmarkButton bookId={book.id} />
            {readUrl && (
              <a
                href={readUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
              >
                อ่านหนังสือ
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;
