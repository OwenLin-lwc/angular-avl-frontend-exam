import { Component, OnInit } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { PeriodicElement } from "./interfaces/interfaces";
import { ELEMENT_DATA, NAME_LIST } from "./csv/csv";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { DatePipe } from "@angular/common";

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

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.dataSource = this._timeFilter();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map(value => this._filter(value))
    );
  }

  private _timeFilter() {
    const weekday = this.datePipe.transform(new Date(), 'EEEE');
    const time = this.datePipe.transform(new Date(), 'hh:mm');
    return ELEMENT_DATA.filter(v => {
      console.log(v[weekday], time)
      if (v[weekday] !== 'Closed') {
        
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
