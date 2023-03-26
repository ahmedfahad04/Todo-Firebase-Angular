import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from 'src/models/todo.model';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private readonly STORAGE_KEY = 'todo_list';

  constructor(private http: HttpClient) { }

  AddItem(title: string): void {
    this.http.post('https://my-todos-20c34-default-rtdb.firebaseio.com/todos.json', {title: title, isCompleted: false})
    .subscribe(response => {
      console.log(response);
    });
  }

  FetchItem() {
    return this.http.get<{[key: string]: Todo}>('https://my-todos-20c34-default-rtdb.firebaseio.com/todos.json')
      .pipe(map((res) => {
        const todoArray = [];
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            todoArray.push({...res[key], id: key});
          }
        }
        
        return todoArray;
      }))
  }

  DeleteItem(id: string) {
    /*
    NOTE: 
    In the onRemoveItem method, you are sending a DELETE request to the Firebase Realtime Database API, 
    but you are not subscribing to the response. Therefore, the HTTP request is being sent, but you are 
    not waiting for the response. To fix this, you need to subscribe to the HTTP response and remove the 
    task from the todoList array if the HTTP request was successful.
    */
    return this.http.delete('https://my-todos-20c34-default-rtdb.firebaseio.com/todos/' + id + '.json')
    
  }

  CheckedItem(todo, id) {
    return this.http.put('https://my-todos-20c34-default-rtdb.firebaseio.com/todos/' + id + '.json', { title: todo.title, isCompleted: todo.isCompleted })
  }
}
