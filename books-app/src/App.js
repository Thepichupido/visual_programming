import { useEffect, useState } from "react";
import "./App.css";
import BookCard from "./BookCard";

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function loadBooks() {
      const res = await fetch("https://fakeapi.extendsclass.com/books");
      const data = await res.json();

      // сначала без картинок
      const initialBooks = data.map((b) => ({
        id: b.id,
        title: b.title,
        authors: b.authors.filter(Boolean),
        isbn: b.isbn,
        imageBlob: null,
      }));

      setBooks(initialBooks);

      // 🔥 потом догружаем обложки по очереди
      for (let i = 0; i < initialBooks.length; i++) {
        const book = initialBooks[i];

        if (!book.isbn) continue;

        try {
          const googleRes = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`
          );

          const googleData = await googleRes.json();

          let thumbnail =
            googleData.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;

          if (thumbnail) {
            thumbnail = thumbnail.replace("http://", "https://");

            const imgRes = await fetch(thumbnail);
            const blob = await imgRes.blob();

            // 🔥 обновляем только одну книгу
            setBooks((prev) =>
              prev.map((b) =>
                b.id === book.id ? { ...b, imageBlob: blob } : b
              )
            );
          }
        } catch (e) {}

        // 🔥 задержка чтобы не словить бан
        await new Promise((r) => setTimeout(r, 150));
      }
    }

    loadBooks();
  }, []);

  return (
    <div className="app">
      <h1 className="app__title">Книги</h1>

      <div className="books-container">
        {books.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            authors={book.authors}
            imageBlob={book.imageBlob}
          />
        ))}
      </div>
    </div>
  );
}

export default App;