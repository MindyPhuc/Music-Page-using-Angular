import { Component, OnInit } from '@angular/core';
import { MusicDataService } from '../music-data.service';


@Component({
  selector: 'app-new-releases',
  templateUrl: './new-releases.component.html',
  styleUrls: ['./new-releases.component.css']
})
export class NewReleasesComponent implements OnInit {

  // properties
  releases: any;
  releasesSub: any;

  constructor(private mService: MusicDataService) { }

  ngOnInit(): void {
    this.releasesSub = this.mService.getNewReleases().subscribe(data =>{
      this.releases = data.albums.items;
    });
  }

  ngOnDestroy(): void {
    this.releasesSub && this.releasesSub.unsubscribe();
  }

}
