import { Component } from '@angular/core';

interface Task {
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})



export class TodoComponent {
  constructor() {
    this.loadTasksFromLocal();
  }
  tasks: Task[] = [];
  newTask: string = '';
  filterOption = 'all';

  loadTasksFromLocal() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
  }

  addTask() {
    if (this.newTask.trim()) {
      const task: Task = {
        text: this.newTask.trim(),
        completed: false,
      };
      this.tasks.unshift(task); 
      this.newTask = ''; // Limp
      this.saveTasksToLocal();
    }
  }

  removeTask(task: Task) {
    const index = this.tasks.indexOf(task);
    if (index > -1) {
      this.tasks.splice(index, 1);
      this.saveTasksToLocal();  // Actualiza las tareas en el localStorage
    }
  }
  
  sortTasks() {
    this.tasks.sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0; 
    });
  }
  
  toggleCompletion(task: Task) {
    task.completed = !task.completed;
    this.sortTasks();
    this.saveTasksToLocal();
    if (task.completed) {
      const index = this.tasks.indexOf(task);
      if (index > -1) {
        this.tasks.splice(index, 1);
        this.tasks = [...this.tasks, task];
      }else {
        this.tasks.splice(index, 0);
        this.tasks = [...this.tasks, task];
      }
    }
  }
  saveTasksToLocal() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
  get filteredTasks(): Task[] {
    switch (this.filterOption) {
      case 'all':
        return this.tasks;
      case 'pending':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }

  get totalTasksCount(): number {
    return this.tasks.length;
  }
  
  get pendingTasksCount(): number {
    return this.tasks.filter(task => !task.completed).length;
  }
}