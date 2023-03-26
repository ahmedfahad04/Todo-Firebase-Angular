import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs';
import { Todo } from 'src/models/todo.model';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  todoList: Todo[] = [];

  constructor(private todoService: TodoService, private http: HttpClient) {
  }

  ngOnInit() {
    this.onFetchData();
  }

  // -------------------- Save the list to localStorage

  onAddItem(form: NgForm): void {

    if (form.value.title == '') {
      alert("Please Enter a valid title");
      return;
    }

    this.todoList.push({ title: form.value.title, isCompleted: false });

    // Save to firebase rtdb
    this.todoService.AddItem(form.value.title);

    form.resetForm();
  }

  onFetchData() {

    console.log("LIST: ", this.todoList);

    // Fetch from firebase rtdb
    this.todoService.FetchItem()
      .subscribe(response => {
        this.todoList = response;
        console.log('GET: ' + this.todoList);
      });

  }

  onToggleDone(id: any): void {

    let todo = this.todoList.filter(x => x.id == id)[0];
    todo.isCompleted = !todo.isCompleted;

    // update the entry in firebase rtdb as todo.isCompleted
    // NOTE: Careful About the data types
    this.todoService.CheckedItem(todo, id)
    .subscribe(response => {
      console.log(response);
    });
  }

  onRemoveItem(id: any): void {
    this.todoService.DeleteItem(id)
      .subscribe(() => {

        // Remove the task from the todoList array
        const index = this.todoList.findIndex(todo => todo.id === id);
        if (index !== -1) {
          this.todoList.splice(index, 1);
        }
      });
  }
}
