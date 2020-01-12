import { Component, OnInit } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { PeriodicElement } from "./interfaces/interfaces";
import { ELEMENT_DATA, NAME_LIST, TIME_LIST } from "./csv/csv";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ],
  providers: [DatePipe]
})
export class AppComponent implements OnInit {
  dataSource: PeriodicElement[];
  columnsToDisplay = ["名字"];
  displayedColumns: string[] = ["Type", "Stars", "Parking", "Delivery"];
  expandedElement: PeriodicElement | null;
  options = NAME_LIST;
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  people = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  currentTime = Date.now();
  searchDate = new FormControl(new Date());
  timeRange = TIME_LIST;
  searchTime = this.datePipe.transform(new Date(), 'HH:00');

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.dataSource = this._timeFilter();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map(value => this._filter(value))
    );
  }

  timeChange(event) {
    this.dataSource = this._timeFilter();
  }

  dateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    this.searchDate.setValue(event.value);
    this.dataSource = this._timeFilter();
  }

  private _timeFilter() {
    const weekday = this.datePipe.transform(this.searchDate.value, 'EEEE');
    const selectedTime = parseInt(this.searchTime.split(':')[0]);
    const time = selectedTime === 0 ? 24 : selectedTime;
    return ELEMENT_DATA.filter(v => {
      if (v[weekday] !== 'Closed') {
        const openTime = v[weekday].split('-')[0].split(':')[0];
        const closeTime = v[weekday].split('-')[1].split(':')[0];
        return openTime > closeTime ? openTime <= time && time <= parseInt(closeTime)+24 : openTime <= time && time <= closeTime;
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
