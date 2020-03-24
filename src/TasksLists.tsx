import React from "react";
import { StateProps } from "./interfaces";
import { Task, TasksStateProps } from "./types";
import styled, { createGlobalStyle, css } from "styled-components";

const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";

const tasksRequest = new Request(HOST + "/tasks");
const newTaskPostURL = new Request(HOST + "/tasks");

export function TasksLists(props: TasksStateProps) {
  const listOfStatus: Array<Status> = [
    { statusName: "todo" },
    { statusName: "working-on-it" },
    { statusName: "waiting" },
    { statusName: "stuck" },
    { statusName: "done" }
  ];
  type Status = {
    statusName: string;
  };

  function TaskItem() {
    const TaskItem = listOfStatus.map(status => (
      <div className="tasks-group">
        <TaskList statusName={status.statusName} />
      </div>
    ));

    function TaskList(taskProps: Status) {
      console.log(taskProps.statusName.split("").join(""));
      console.log("TaskList ran");
      console.log(taskProps.statusName);
      //props.tasks.map(element =>console.log({ key: element.name, value: element.status }));
      return (
        <div>
          <p className="group-heading"> // {taskProps.statusName} //</p>
          {props.tasks
            .filter(task => task.status == taskProps.statusName)
            .map(task => (
              <GroupOfButtons name={task.name} status={task.status} />
            ))}
        </div>
      );
    }
    function GroupOfButtons(task: Task) {
      return (
        <div className="task-item">
          <p className="task-name">{task.name}</p>
          <div className="buttons-group">
            move to:
            {listOfStatus
              .filter(currentStatus => currentStatus.statusName != task.status)
              .map(status => (
                <ButtonElement name={task.name} status={status.statusName} />
              ))}
          </div>
        </div>
      );
    }
    function ButtonElement(props: Task) {
      return (
        <button
          id={props.name}
          className={`move-to-button`}
          onClick={event => moveTo(props.status, event.currentTarget.id)}
        >
          {props.status}
        </button>
      );
    }
    return <div className="tasks-list-item">{TaskItem}</div>;
  }
  function moveTo(status: string, buttonId: string) {
    const tasksArrayToSave = props.tasks.slice();
    const task = buttonId;

    const found = tasksArrayToSave.find(
      (element: Task) => element.name == task
    );

    tasksArrayToSave.splice(tasksArrayToSave.indexOf(found as Task), 1);
    sendNewTask({ name: task, status: status });
    tasksArrayToSave.unshift({ name: task, status: status });
    props.setTasks(tasksArrayToSave);
  }
  function sendNewTask(task: Task) {
    fetch(newTaskPostURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: task.name,
        status: task.status
      })
    });
  }
  return <TaskItem />;
}

function makeStatusNameValidCSSClassName(statusName: string) {
  return statusName.split("").join("");
}

type TaskListProps = {
  status: string;
  taskState: TasksStateProps;
};
