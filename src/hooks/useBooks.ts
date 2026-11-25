import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";

interface Author {
    name: string;
}

export interface Book {
    id: number;
    title: string;
    authors: Author[];
    download_count: number;
    formats: Record<string, string>;
    subjects?: string[];
    languages?: string[];
}

export interface GutendexResponse {
    count: number;
    results: Book[];
}

// รับเลขหน้า (ค่าเริ่มต้น 1) แล้วส่งไปกับ URL Query Parameter ?page=
export const useBooks = (page: number = 1) => {
    return useQuery<GutendexResponse>({
        // ใส่ page ใน queryKey เพื่อให้ TanStack Query แยก Cache ของแต่ละหน้า
        queryKey: ["books", page],

        queryFn: async () => {
            // ต้องมี / หลัง books ก่อน ? เสมอ ไม่อย่างนั้น Server จะตอบ 301 Redirect
            const res = await fetch(`https://gutendex.com/books/?page=${page}`);
            if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลรายการหนังสือได้");
            return res.json();
        },
        staleTime: 1000 * 60 * 3, // กลับมาหน้าที่เคยโหลดภายใน 3 นาที จะใช้ Cache ไม่ยิง Request ซ้ำ
    });
};

// รวมหนังสือจาก Cache ของทุกหน้า (["books", 1], ["books", 2], ...)
export const getAllCachedBooks = (queryClient: QueryClient): Book[] => {
    const allPages = queryClient.getQueriesData<GutendexResponse>({ queryKey: ["books"] });
    return allPages.flatMap(([, data]) => data?.results ?? []);
};

const findBookInCache = (queryClient: QueryClient, id: string | undefined) =>
    getAllCachedBooks(queryClient).find((b) => String(b.id) === String(id));

export const useBookDetail = (id: string | undefined) => {
    const queryClient = useQueryClient();
    return useQuery<Book>({
        queryKey: ["book", id],
        queryFn: async () => {
            try {
                const res = await fetch(`https://gutendex.com/books/${id}/`);
                if (res.ok) return await res.json();
            } catch (err) {
                console.warn("API error, reading from cache...", err);
            }
            // queryKey เปลี่ยนเป็น ["books", page] แล้ว จึงต้องหาจาก Cache ของทุกหน้า
            const cached = findBookInCache(queryClient, id);
            if (cached) return cached;
            throw new Error("ไม่สามารถดึงข้อมูลเล่มนี้ได้");
        },
        initialData: () => findBookInCache(queryClient, id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10,
    });
};
