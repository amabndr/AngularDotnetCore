import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Department } from 'src/app/models/Department';
import { SharedapiService } from 'src/app/services/sharedapi.service';

@Component({
  selector: 'app-show-dep',
  templateUrl: './show-dep.component.html',
  styleUrls: ['./show-dep.component.css']
})
export class ShowDepComponent implements OnInit,AfterViewInit {

  displayedColumns:string[]=['DepartmentId',	'DepartmentName','Options'];
  dataSource = new MatTableDataSource<Department>();

   
  @ViewChild(MatPaginator) paginator:MatPaginator;
  @ViewChild(MatSort) sort:MatSort;


  
  DepartmentList:Department[]=[];
  
  ModalTitle:string;
  ActivateAddEditDepComp:boolean=false;
  dep:Department;
  
  DepartmentIdFilter:string="";
  DepartmentNameFilter:string="";
  DepartmentListWithoutFilter:Department[]=[];
  
  ngOnInit(): void {
    this.refreshDepList();
  }

  constructor(private service:SharedapiService) { }
  
  ngAfterViewInit(): void {
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
  }
  
  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value;
    this.dataSource.filter=filterValue.trim().toLowerCase();

    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

  addClick(){
    this.dep={
      DepartmentId:0,
      DepartmentName:""
    }
    this.ModalTitle="Add Department";
    this.ActivateAddEditDepComp=true;
  } 

  editClick(item:Department){
    this.dep=item;
    this.ModalTitle="Edit Department";
    this.ActivateAddEditDepComp=true;
  }

  deleteClick(item:Department){
    if(confirm("Are You Sure??")){
      this.service.deleteDepartment(item.DepartmentId).subscribe(data=>{
        alert(data.toString());
        this.refreshDepList();
      })
    }
  }

  closeClick(){
    this.ActivateAddEditDepComp=false;
    this.refreshDepList();
  }

  refreshDepList(){
    this.service.getDepList().subscribe((data:Department[])=>{
      this.DepartmentList=data;
      this.DepartmentListWithoutFilter=data;
      this.dataSource.data=data;
    })
  }

}
