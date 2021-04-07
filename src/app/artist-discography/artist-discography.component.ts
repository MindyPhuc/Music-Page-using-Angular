import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-artist-discography',
  templateUrl: './artist-discography.component.html',
  styleUrls: ['./artist-discography.component.css']
})
export class ArtistDiscographyComponent implements OnInit {

  //properties
  albums: any;
  artist: any;
  routeSub: any;
  albumSub: any;
  artistSub: any;

  constructor(private route: ActivatedRoute, private mService: MusicDataService) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params=>{

        this.artistSub = this.mService.getArtistById(params.id).subscribe(data=>this.artist = data);

        this.albumSub = this.mService.getAlbumsByArtistId(params.id).subscribe(data=>{

          // filter the duplicates (albums with the same name) before assigning to albums
          this.albums = data.items.filter((item, index, self)=>(
            index === self.findIndex(i=>(
              i.name === item.name
            ))
          ));
        });
    });

  }

  ngOnDestroy(): void {
    this.artistSub && this.artistSub.unsubscribe();
    this.routeSub && this.routeSub.unsubscribe();
    this.albumSub && this.albumSub.unsubscribe();
  }

}
