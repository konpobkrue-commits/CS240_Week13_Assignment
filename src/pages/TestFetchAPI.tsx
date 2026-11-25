import { useEffect, useState } from "react";

interface Author {
  name: string;
}

interface Book {
  id: number;
  title: string;
  authors: Author[];
  download_count: number;
  formats: Record<string, string>;
  subjects?: string[];
  language?: string[];
}

interface GutendexResponse {
  count: number;
  results: Book[];
}


function TestFetchAPI() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<GutendexResponse>();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://gutendex.com/books/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json: GutendexResponse = await response.json();
        console.log(json);

        setData(json);
        setError("")
      } catch (err) {
        console.error("Fetch API error:" + err);
        setError("Cannot Fetch API");
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [])

  if (loading)
    return (
      <div className="flex justify-center m-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (error || !data)
    return (
      <div role="alert" className="alert alert-error m-6">
        <span>{error || "ไม่พบข้อมูล"}</span>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-center text-4xl font-bold mb-6">
        Gutendex Books ({data.count.toLocaleString()})
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ใช้ map วนสร้างการ์ดจากข้อมูลแต่ละเล่ม */}
        {data.results.map((book) => (
          <div key={book.id} className="card bg-base-100 shadow-md">
            <figure>
              <img
                src={book.formats["image/jpeg"]}
                alt={book.title}
                className="h-72 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-base">{book.title}</h2>
              <p>ผู้แต่ง: {book.authors[0]?.name ?? "ไม่ทราบ"}</p>
              <div className="card-actions justify-end">
                <div className="badge badge-outline">
                  ดาวน์โหลด: {book.download_count}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestFetchAPI;
