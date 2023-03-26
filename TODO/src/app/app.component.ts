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
  currentID: string = '';
  title: string = '';

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

    this.title = form.value.title;

    // Save to firebase rtdb
    this.todoService.AddItem(form.value.title)
    .subscribe(response => {
      const newItem = {id: response.name, title: this.title, isCompleted: false};
      this.todoList.push(newItem);
    });;

    console.log("A: ", this.todoList);

    form.resetForm();
  }

  onFetchData() {

    // Fetch from firebase rtdb
    this.http.get<{ [key: string]: Todo }>('https://my-todos-20c34-default-rtdb.firebaseio.com/todos.json')
      .pipe(map((res) => {
        const todoArray = [];
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            todoArray.push({ ...res[key], id: key });
          }
        }
        console.log("Updated: ", todoArray);
        return todoArray;
      }))
      .subscribe(response => {
        this.todoList = response;
        console.log('GET: ' + this.todoList.length);
      });

    console.log("LIST: ", this.todoList.length);

  }

  onToggleDone(id: any): void {

    console.log("CUrrent ID: ", id);

    let todo = this.todoList.find((x) => { return x.id == id });
    todo.isCompleted = !todo.isCompleted;
    console.log("TODO: ", todo);

    // update the entry in firebase rtdb as todo.isCompleted
    // NOTE: Careful About the data types
    this.http.put('https://my-todos-20c34-default-rtdb.firebaseio.com/todos/' + id + '.json', { title: todo.title, isCompleted: todo.isCompleted })
      .subscribe(response => {
        console.log(response);
        this.onFetchData();
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
