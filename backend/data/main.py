import os
import requests, json
from movie_list import marvel_movies
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()


API_KEY = os.getenv("OMDB_API_KEY")
BASE_URL = "http://www.omdbapi.com/"


def get_movie_details(title: str, plot_type: str = "full") -> dict:
  if not API_KEY:
    raise ValueError("OMDB_API_KEY is not set in environment variables.")

  params = {
    "apikey": API_KEY,
    "t": title,       
    "plot": plot_type,  
    "r": "json",      
  }

  response = requests.get(BASE_URL, params=params, timeout=10)
  response.raise_for_status()  

  data = response.json()

  if data.get("Response") == "False":
    raise RuntimeError(f"OMDb API error: {data.get('Error')}")

  return data


def save_movies_to_json(data: dict, filepath: str = "movie_data.json") -> Path:
    output_path = Path(filepath)

    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)

    return output_path
  

if __name__ == "__main__":
  collected_movies: list[dict] = []

  for movie in marvel_movies:
    try:
      movie_data = get_movie_details(movie, plot_type="full")
      collected_movies.append(movie_data)
      print(f"Fetched data for '{movie}'")
    except Exception as e:
      print(f"Error fetching data for '{movie}': {e}")

  if collected_movies:
    saved_file = save_movies_to_json(collected_movies, "marvel_movies.json")
    print(f"Saved {len(collected_movies)} movies to: {saved_file}")
  else:
    print("No movie data was fetched; file was not written.")