import { useEffect, useState } from "react";
import "./BookCard.css";

function BookCard({ title, authors, imageBlob }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!imageBlob) return;

    const objectUrl = URL.createObjectURL(imageBlob);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageBlob]);

  return (
    <div className="book-card">
      {url ? (
        <img src={url} alt={title} className="book-card__image" />
      ) : (
        <div className="book-card__placeholder">Нет обложки</div>
      )}

      <h2 className="book-card__title">{title}</h2>
      <p className="book-card__authors">{authors.join(", ")}</p>
    </div>
  );
}

export default BookCard;