import { Component, OnInit,Pipe } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Data } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ServiceDataService } from 'src/app/service-data.service';



interface User {
  name: string;
}

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css'],
  providers: [Pipe]
})
export class ApplyLeaveComponent implements OnInit  {
// calender
  selected: Date | null = null;




  durationDateName: string = '';


  selectedFrom:Date |null= null;
  selectedTo:Date |null= null;
  
  
  onStartDateChange(event: any) {
    this.selectedFrom = event.value;
    console.log('Selected start date:', this.selectedFrom);

  }
  
  onEndDateChange(event: any) {
    this.selectedTo = event.value;
    console.log('Selected end date:', this.selectedTo);
  }
  select_from_date:any=''
  select_to_date:any=''
  timeDiff:any=0;
  total_number_of_leaves:number=0;
  getFormattedDate(): string {
    this.select_from_date=this.selected;
    this.select_to_date=this.selected
    
    return this.selected ? this.selected.toDateString() : new Date().toDateString();
   
  }

  dateRadioSelections: { [key: string]: string } = {}
  selectedOptions: User[] = [];

  myControl = new FormControl<string | User>('', [Validators.required]);
  options: any[] = [{ name: 'Loss of pay' }];
  filteredOptions: Observable<User[]> | undefined;

  myDurationControl = new FormControl<string | User>('');
  durationOptions: User[] = [{ name: 'Oneday' },{name:"more than oneday"}];
  durationFilteredOptions: Observable<User[]> | undefined;

  
  emailForm!: FormGroup;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  resData: any = '';
  nameArray:any=[]
  giri:string=""
  krish:string=''
  ccArray: string[] = []; 
  toArray:string[]=[]
  
  constructor(private fb: FormBuilder, private searchUser:ServiceDataService) {}


  delete(removeVal: any) {
    const toppings1Control = this.emailForm.get('toppings1');
    if (toppings1Control) {
      const currentValue = toppings1Control.value;
      console.log("current",currentValue);
      
      const index = currentValue.indexOf(removeVal);
      console.log("removeVal",index);
      
      if (index !== -1) {
        currentValue.splice(index, 1); 
        toppings1Control.setValue(currentValue); 
      }
    }
    
    
  }

  del(remove:any){
    const toppings2Control = this.emailForm.get('toppings2');
    if (toppings2Control) {
      const currentValue = toppings2Control.value;
      const index = currentValue.indexOf(remove);
      if (index !== -1) {
        currentValue.splice(index, 1);
        toppings2Control.setValue(currentValue); 
      }
    }
  }
  

  ngOnInit(): void {

  
    this.searchUser.search().subscribe({
      next: (res: any) => {
        this.resData = res.data;
        for (let i: any = 0; i < this.resData.length; i++) {
          this.nameArray.push(this.resData[i].name);
          this.toppingList.push(this.resData[i].name)
        }
        if (this.nameArray.includes('Giridharan V', 'V Krishna Kumar')) {
          this.giri = 'Giridharan V';
          this.krish='V Krishna Kumar'
        }
      },
      error(err: any) {
        console.log("error", err);
      }
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );

    this.durationFilteredOptions = this.myDurationControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const durationName = typeof value === 'string' || value === undefined ? value : value?.name;
    this.durationDateName = durationName ?? ''; // Assign a default value if durationName is undefined 
    return durationName ? this._durationFilter(durationName as string) : this.durationOptions.slice();

      })
    );
    
      
   
    this.emailForm = this.fb.group({
      toppings1: new FormControl(null, [Validators.required]),
      toppings2: new FormControl(null, [Validators.required]),
     
      reason: new FormControl(null, [Validators.required]),
      myControl: new FormControl('', [Validators.required]),
      mySearch:new FormControl()
    });
    
  }
  // toppings1 = new FormControl(); 
  // toppings2 = new FormControl();
  // searchControl = new FormControl();
  toppingList: string[] = [];
  // reason=new FormControl();

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  durationDisplayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _durationFilter(name: string): User[] {
    const durationFilterValue = name.toLowerCase();
    return this.durationOptions.filter(option => option.name.toLowerCase().includes(durationFilterValue));
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
  }
  onRadioSelectionChange(date: Date, value: string) {
    const dateKey = date.toISOString(); 
    this.dateRadioSelections[dateKey] = value; 
  
   
    console.log(`${value} selected for date: ${date}`);
  }
  
  
  
  getDateRangeArray(startDate: Date, endDate: Date): Date[] {
    const dateArray: Date[] = [];
    let currentDate = new Date(startDate);
    
    this.select_from_date = startDate;
    this.select_to_date = endDate;
  
    // Calculate the time difference in milliseconds
    this.timeDiff = endDate.getTime() - startDate.getTime();
   
    this.total_number_of_leaves = Math.ceil(this.timeDiff / (1000 * 60 * 60 * 24)) + 1;
  
    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dateArray;
  }
  

  submitForm(): void {
   
     
      if (!this.selectedFrom || !this.selectedTo) {
       
        this.selectedFrom = new Date(); 
        console.log(this.select_from_date);
        
      }
      
    

    if (this.total_number_of_leaves == 0) {
      this.total_number_of_leaves = 1;
    }
    const to: any[] = this.emailForm.get('toppings1')?.value;
    const cc: any[] = this.emailForm.get('toppings2')?.value;
    const type_of_leave: any[] = this.options[0];
    const total_number_of_leaves = this.total_number_of_leaves;
    const reason = this.emailForm.get('reason')?.value; 
    console.log(type_of_leave);
  
    const total_data: any = {
      to: to,
      cc: cc,
      type_of_leave: type_of_leave,
      no_of_days: total_number_of_leaves,
      reason: reason,
      from_date: this.select_from_date,
      to_date: this.select_to_date
    };
  
    this.searchUser.applyLeave(total_data).subscribe({
      next: (res: any) => {
        console.log("data sent", res);
      },
      error: (err: any) => {
        console.log("error occur", err);
      }
    });
    console.log("form value",this.emailForm.value);
    
    console.log(total_data);

    console.log("logggg",this.emailForm.value);
    console.log("llll",this.emailForm.value);
    
    
  }
  

  
  
}
