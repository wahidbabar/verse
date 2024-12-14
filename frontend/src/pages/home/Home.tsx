import { useEffect, useState } from "react";
import Banner from "./Banner";
import News from "./News";
import Recommend from "./Recommend";
import TopSellers from "./TopSellers";
import { IBook } from "@/api/types";
import { mockBooks } from "@/utils/mockData";
import { useFetchBooks } from "@/api/books";
import Loading from "@/components/Loading";
import { BookOpen } from "lucide-react";

const Home = () => {
  const [books, setBooks] = useState<IBook[] | undefined>(mockBooks);
  const { data, isLoading } = useFetchBooks();

  useEffect(() => {
    if (data) {
      setBooks(data);
    }
  }, [data]);

  if (isLoading) return <Loading />;

  if (!books) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/10 rounded-lg">
        <div className="text-center space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No books available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Banner />
      <TopSellers books={books} />
      <Recommend books={books} />
      <News />
    </>
  );
};

export default Home;
