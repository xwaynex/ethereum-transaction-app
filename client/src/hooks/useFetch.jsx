import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_GIPHY_API;

const useFetch = ({keyword}) => {
  const [gifUrl, setGifUrl] = useState("");

  const fetchGifs = async () => {
    try {
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword.split(" ").join("")}&limit=1`;
      console.log("Fetching GIF from URL:", url);

      const response = await fetch(url);
      const data = await response.json();

       // Log the entire data to see its structure
       console.log("Received data:", data);

       // Check if the response contains the expected structure
      if (data.data && data.data.length > 0) {
        setGifUrl(data.data[0]?.images?.downsized_medium?.url);
      } else {
        console.warn("No GIF found for the provided keyword:", keyword);
        setGifUrl("https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284");
      }
    } catch (error) {
      setGifUrl("https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284");
      console.log(error); 
    }
  }

  useEffect(() => {
    if (keyword) fetchGifs();
  }, [keyword]);

  return gifUrl
}

export default useFetch;