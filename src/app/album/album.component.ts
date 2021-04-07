import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';


@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  // properties
  album: any;
  albumSub: any;
  routeSub: any;
  addFavSub: any;

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private mService: MusicDataService) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params=>{
      this.albumSub = this.mService.getAlbumById(params.id).subscribe(data => this.album = data)
    });
  }

  addToFavorites(trackID): void {
    this.addFavSub = this.mService.addToFavorites(trackID).subscribe(
      success => this.snackBar.open("Adding to Favorites...", "Done", { duration: 1500 }),
      err => {
        this.snackBar.open("Unable to add song to Favorites", "Error", { duration: 1500 });
        console.log(err);
      }
    );
  }

  ngOnDestroy(): void {
    this.albumSub && this.albumSub.unsubscribe();
    this.routeSub && this.routeSub.unsubscribe();
    this.addFavSub && this.addFavSub.unsubscribe();
  }

}
