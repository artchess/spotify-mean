import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global'
import { Album } from '../models/album';

@Injectable()
export class AlbumService {
  public url: string; // la url de la api rest
  public identity;
  public token;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  getAlbum(token, id: string) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    let options = new RequestOptions({ headers: headers });
    return this._http.get(this.url + 'album/' + id, options)
      .map(res => res.json());
  }

  addAlbum(token, album: Album) {
    let params = JSON.stringify(album);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.post(this.url + 'album', params, { headers: headers })
      .map(res => res.json());
  }

  editAlbum(token, id: string, album: Album) {
    let params = JSON.stringify(album);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.put(this.url + 'album/' + id, params, { headers: headers })
      .map(res => res.json());
  }
}
