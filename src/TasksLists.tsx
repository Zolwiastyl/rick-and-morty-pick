import React from "react";
import { StateProps } from "./interfaces";
import { Task, TaskProps } from "./types";

export function TasksLists(props: TaskProps) {
  const listOfStatus: Array<Status> = [
    { statusName: "to do" },
    { statusName: "working on it" },
    { statusName: "waiting" },
    { statusName: "stuck" },
    { statusName: "done" }
  ];
  type Status = {
    statusName: string;
  };
  console.log("TASKSLISTS");
  props.tasks.map(element =>
    console.log({ key: element.name, value: element.status })
  );

  function TaskElement() {
    console.log("TaskElement ran");
    const TaskElement = listOfStatus.map(status => (
      <TaskList statusName={status.statusName} />
    ));
    function TaskList(taskProps: Status) {
      console.log("TaskList ran");
      console.log(taskProps.statusName);
      props.tasks.map(element =>
        console.log({ key: element.name, value: element.status })
      );

      props.tasks.map(element =>
        console.log({ key: element.name, value: element.status })
      );
      return (
        <div>
          {props.tasks.map(task => (
            <GroupOfButtons name={task.name} status={task.status} />
          ))}
        </div>
      );
    }
    function GroupOfButtons(task: Task) {
      console.log("groupOfButtons ran");
      return (
        <div>
          {listOfStatus.map(status => (
            <ButtonElement name={task.name} status={task.status} />
          ))}
        </div>
      );
    }
    function ButtonElement(props: Task) {
      console.log("ButtonElement ran");
      return <button id={props.name}>{props.name}</button>;
    }
    return <div>{TaskElement}</div>;
  }
  return (
    <div>
      <TaskElement />
    </div>
  );
}

type TaskListProps = {
  status: string;
  taskState: TaskProps;
};
