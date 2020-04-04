import react from "react";
import { Task, TasksStateProps } from "./types";
import React from "react";

export const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";
const tasksRequest = new Request(HOST + "/tasks");
const newTaskPostURL = new Request(HOST + "/tasks");
const updateTaskPostURL = new Request(HOST + "/update-tasks");
const removeTaskUrl = new Request(HOST + "/remove-task");

export function generateIdForTask() {
  return Date()
    .split("")
    .filter(element => /\d/.test(element))
    .join("");
}

export function sendNewTask(task: Partial<Task>) {
  const fetchAction = fetch(newTaskPostURL, {
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
  }).catch(error => {
    console.log("problem with fetching data:", error);
    return false;
  });
  return fetchAction;
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

export function removeTask(task: Task) {
  fetch(removeTaskUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      frontEndId: task.frontEndId
    })
  });
}
export function moveToAnotherGroup(
  status: string,
  task: Task,
  state: TasksStateProps
) {
  // WHAT IF SERVER UPDATE FAILS?

  // 1.
  // UPDATE ON SERVER
  // THEN IF IT SUCCEEDS UPDATE LOCAL COPY
  // OTHERWISE DISPLAY ERROR
  // 2. (OPTIMISTIC UPDATE)
  // UPDATE ON SERVER,
  // UPDATE LOCAL COPY WHILE YOU WAIT,
  // IF SERVER UPDATE FAILS,
  // ROLLBACK YOUR LOCAL UPDATE
  // AND DISPLAY ERROR

  // UPDATE ON SERVER
  if (
    sendNewTask({
      name: task.name,
      status: status,
      dependencyId: task.dependencyId,
      frontEndId: task.frontEndId,
      isReady: task.isReady,
      userId: task.userId
    })
  ) {
    // UPDATE LOCAL COPY
    console.log("submitted");
    state.setTasks(
      state.tasks.map(t =>
        t.frontEndId !== task.frontEndId
          ? t
          : {
              name: task.name,
              status: status,
              frontEndId: task.frontEndId,
              isReady: task.isReady,
              userId: task.userId
            }
      )
    );
  } else {
    return console.log("couldn't sent the task to server");
  }
}