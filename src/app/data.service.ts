import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public url = 'http://cgi.uru.ac.th:3000';

  constructor(
    public http: HttpClient
  ) { }

  getAirquality() {
    const json = 'https://cors.io/?http://air4thai.pcd.go.th/services/getNewAQI_JSON.php?stationID=69t';
    return new Promise((resolve: any, reject: any) => {
      this.http.get(json).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getViirs() {
    return new Promise((resolve: any, reject: any) => {
      this.http.get(this.url + '/hp/hp_viirs').subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  getModis() {
    return new Promise((resolve: any, reject: any) => {
      this.http.get(this.url + '/hp/hp_modis').subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error);
      });
    });
  }

}
