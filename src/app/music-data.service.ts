import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SpotifyTokenService } from './spotify-token.service';
import { environment } from './../environments/environment';

import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MusicDataService {

  constructor(private spotifyToken: SpotifyTokenService, private http: HttpClient) { }

  getNewReleases(): Observable<SpotifyApi.ListOfNewReleasesResponse> {
      return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
        return this.http.get<SpotifyApi.ListOfNewReleasesResponse>("https://api.spotify.com/v1/browse/new-releases", { headers: { "Authorization": `Bearer ${token}` } });
      }));
  }

  getArtistById(id): Observable<SpotifyApi.SingleArtistResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<SpotifyApi.SingleArtistResponse>(`https://api.spotify.com/v1/artists/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
    }));
  }

  // query parameters: include_groups=album,single and limit=50
  getAlbumsByArtistId(id): Observable<SpotifyApi.ArtistsAlbumsResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<SpotifyApi.ArtistsAlbumsResponse>(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`,
      { headers: { "Authorization": `Bearer ${token}` } });
    }));
  }

  getAlbumById(id): Observable<SpotifyApi.SingleAlbumResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<SpotifyApi.SingleAlbumResponse>(`https://api.spotify.com/v1/albums/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
    }));
  }


  // query parameters:
  // q=searchString
  // type=artist
  // limit=50
  searchArtists(searchString): Observable<SpotifyApi.ArtistSearchResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<SpotifyApi.ArtistSearchResponse>(`https://api.spotify.com/v1/search?q=${searchString}&type=artist&limit=50`, { headers: { "Authorization": `Bearer ${token}` } });
    }));
  }


  addToFavorites(id): Observable<[String]> {
    // TODO: make a PUT request to environment.userAPIBase/favorites/:id to add id to favorites
    return this.http.put<[String]>(`${environment.userAPIBase}/favorites/${id}`, id);
  }

  removeFromFavorites(id): Observable<SpotifyApi.MultipleTracksResponse> {
    return this.http.delete<[String]>(`${environment.userAPIBase}/favorites/${id}`).pipe(mergeMap(favoritesArray => {
      // TODO: Perform the same tasks as the original getFavorites() method, only using "favoritesArray" from above, instead of this.favoritesList
      // NOTE: for the empty array, you will need to use o=>o.next({tracks: []}) instead of o=>{o.next([])}
      favoritesArray.splice(favoritesArray.indexOf(id), 1); // remove the id from the favoriteList array
      return this.getFavorites();

    }));
  }

  getFavorites(): Observable<SpotifyApi.MultipleTracksResponse> {
    return this.http.get<[String]>(`${environment.userAPIBase}/favorites/`).pipe(mergeMap(favoritesArray => {
      // TODO: Perform the same tasks as the original getFavorites() method, only using "favoritesArray" from above, instead of this.favoritesList
      // NOTE: for the empty array, you will need to use o=>o.next({tracks: []}) instead of o=>{o.next([])}
      if (favoritesArray.length > 0) {
        return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
          return this.http.get<any>(`https://api.spotify.com/v1/tracks?ids=${favoritesArray.join()}`,
          { headers: { "Authorization": `Bearer ${token}` } });
        }));
      } else {
        return new Observable(o=>o.next({tracks: []}));
      }
    }));
  }


}
