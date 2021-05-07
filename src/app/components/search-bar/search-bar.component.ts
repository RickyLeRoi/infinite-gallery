import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatOptionModule } from '@angular/material/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ImageService } from 'src/app/services/image.service';

/**
 * @title Highlight the first autocomplete option
 */
@Component({
  selector: 'app-search-bar',
  templateUrl: 'search-bar.component.html',
  styleUrls: ['search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    // Get the input box
    let input: HTMLElement = document.getElementById('search-bar') as HTMLElement;
    // Init a timeout variable to be used below
    let timeout: any = null;
    // Listen for keystroke events
    const self = this;
    input.addEventListener('keyup', function (e) {
        // Clear the timeout if it has already been set.
        // This will prevent the previous task from executing
        // if it has been less than <MILLISECONDS>
        clearTimeout(timeout);

        // Make a new timeout set to go off in 1000ms (1 second)
        timeout = setTimeout(function () {
          self._filter((e.target as any).value);
        }, 1000);
    });
  }
  constructor(private imageService: ImageService) {
  }

  private _filter(value: string): void {
    this.imageService.changeKeyWord(value);
  }
}