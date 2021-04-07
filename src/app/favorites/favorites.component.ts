import { Component, OnInit } from '@angular/core';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  favorites: Array<any>;
  favSub: any;
  removeFavSub: any;

  constructor(private mService: MusicDataService) { }

  ngOnInit(): void {
    this.favSub = this.mService.getFavorites().subscribe(data=>{
      this.favorites = data.tracks;
    })
  }

  removeFromFavorites(id): void {
    this.removeFavSub = this.mService.removeFromFavorites(id).subscribe(data=>{
      this.favorites = data.tracks;
    })
  }

  ngOnDestroy(): void {
    this.favSub && this.favSub.unsubscribe();
    this.removeFavSub && this.removeFavSub.unsubscribe();
  }
}
