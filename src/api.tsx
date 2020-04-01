import react from "react";
import { Task, TasksStateProps } from "./types";
import React from "react";

export const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";
const tasksRequest = new Request(HOST + "/tasks");
const newTaskPostURL = new Request(HOST + "/tasks");
const updateTaskPostURL = new Request(HOST + "/update-tasks");

export function generateIdForTask() {
  return Date()
    .split("")
    .filter(element => /\d/.test(element))
    .join("");
}

export function sendNewTask(task: Partial<Task>) {
  fetch(newTaskPostURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: task.name,
      status: task.status,
      frontEndId: task.frontEndId,
      dependencyId: task.dependencyId,
      isReady: task.isReady,
      userId: "task.userId"
    })
  });
  console.log("task sent");
}

export function fetchDataFromServer(
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) {
  fetch(tasksRequest)
    .then(response => {
      return response.json();
    })
    .then(data => {
      const newArray = { data };

      const newData = newArray.data;

      setTasks(newData);
    })
    .catch(error => console.log("We had en error" + error));
}

export function RemoveAllData(props: Partial<TasksStateProps>) {
  return (
    <button
      className="remove-data-button"
      onClick={() => {
        fetch(HOST + "/remove-data", {
          method: "POST"
        });
        fetchDataFromServer(
          props.setTasks as React.Dispatch<React.SetStateAction<Task[]>>
        );
      }}
    >
      // REMOVE ALL DATA //
    </button>
  );
}

/*const tasksRequest = new Request(HOST + "/tasks");
const newTaskPostURL = new Request(HOST + "/tasks");

function sendNewTask(task: Task) {
  fetch(newTaskPostURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: task.name,
      status: task.status,
      frontEntId: task.frontEndId,
      dependencyId: task.dependencyId
    })
  });
} */
