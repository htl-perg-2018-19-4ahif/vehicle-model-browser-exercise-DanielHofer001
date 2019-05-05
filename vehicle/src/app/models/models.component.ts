import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
interface IModel {
  id: number;
  year: number;
  make: string;
  model: string;
  hasDetails: number;
}
@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.css']
})
export class ModelsComponent implements OnInit {
  host = 'https://vehicle-data.azurewebsites.net/api';
  constructor(private httpClient: HttpClient) { }
  years = [];
  makes = [];
  results = [];
  query = '';
  page = 0;
  displayedColoms = ['id', 'year', 'make', 'model', 'hasDetails'];
  makeselected;
  yearselected;
  readonly offest = 10;
  async ngOnInit() {
    this.years = await this.httpClient
      .get<number[]>(this.host + '/years')
      .toPromise();
    this.makes = await this.httpClient
      .get<string[]>(this.host + '/makes')
      .toPromise();
  }
  async send() {
    this.query = '';
    if (this.makeselected || this.yearselected) {
      this.query += '?';
      if (this.makeselected) {
        this.query += 'make=' + this.makeselected + '&';
      }
      if (this.yearselected) {
        this.query += 'year=' + this.yearselected;
        if (this.query.indexOf('make') === -1) {
          this.query += 'year=' + this.yearselected + '&';
        }
      }
    }

    this.results = await this.httpClient
      .get<IModel[]>(this.host + '/models' + this.query)
      .toPromise();
    console.log(this.host + '/models' + this.query);
    console.log(this.results);
  }
  async next() {
    this.page += this.offest;
    this.results = await this.httpClient
      .get<IModel[]>(this.host + '/models' + (this.query || '?') + 'offset=' + this.page)
      .toPromise();
    console.log('NEXT', this.host + '/models' + (this.query || '?') + 'offset=' + this.page);
  }
  async prev() {
    if (this.page > 0) {
      this.page -= this.offest;
      this.results = await this.httpClient
        .get<IModel[]>(this.host + '/models' + (this.query || '?') + 'offset=' + this.page)
        .toPromise();
      console.log('PREV', this.host + '/models' + (this.query || '?') + 'offset=' + this.page);
    }
  }
}
