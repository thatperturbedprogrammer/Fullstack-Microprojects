import { useState } from "react";

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    setLoading(true);
    setError("");
    setShortUrl("");
    try {
      const response = await fetch("http://localhost:5000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longUrl: longUrl,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setShortUrl(data.shortUrl);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError(`Network error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">URL Shortener</h1>
      <div>
        <div className="space-y-4 p-4">
          <input
            placeholder="Enter long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />

          <button className="w-full" onClick={handleShorten} disabled={loading}>
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {shortUrl && (
            <div className="flex items-center space-x-2">
              <input value={shortUrl} readOnly className="flex-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
