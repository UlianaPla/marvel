class MarvelService {
  _apiBase = "https://gateway.marvel.com:443/v1/public/";
  _apiKey = "apikey=5fd009d812a03ca9a0c6188446af8ee6";
  _baseOffset = 210;

  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status ${res.status}`);
    }

    return await res.json();
  };

  getAllCharacters = async (offset = this._baseOffset) => {
    const res = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`
    );
    return res.data.results.map(this._transformCharacter);
  };

  getCharacter = async (id) => {
    const res = await this.getResource(
      `${this._apiBase}characters/${id}?${this._apiKey}`
    );
    return this._transformCharacter(res.data.results[0]);
  };
ß
  _transformCharacter = (char) => {
    let formattedDescription = char.description && char.description.length > 210 
    ? `${char.description.slice(0, 210)}...` 
    : char.description;
    
    return {
      id: char.id,
      name: char.name,
      description: char.description ? formattedDescription : 'There is no description fot this character',
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };
}

export default MarvelService;
