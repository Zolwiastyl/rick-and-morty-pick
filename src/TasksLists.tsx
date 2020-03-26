import React from "react";
import { StateProps } from "./interfaces";
import { Task, TasksStateProps } from "./types";
import styled, { createGlobalStyle, css } from "styled-components";
import { motion } from "framer-motion";

// api

const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";

const tasksRequest = new Request(HOST + "/tasks");
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
      status: task.status
    })
  });
}

// end api

interface TaskButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}
function TaskButton({ children, onClick }: TaskButtonProps) {
  return (
    <button className={`move-to-button`} onClick={onClick}>
      {children}
    </button>
  );
}

interface TaskListProps extends React.ComponentProps<"div"> {
  status: Status;
}
const TaskList: React.FC<TaskListProps> = ({
  status: { statusName },
  children,
  ...rest
}) => {
  return (
    <div className="tasks-group" {...rest}>
      <p className="group-heading"> // {statusName} //</p>
      {children}
    </div>
  );
};

const ButtonsGroup: React.FC = ({ children }) => {
  return <div className="buttons-group">move to: {children}</div>;
};

type Status = {
  statusName: string;
};

export function TasksLists({ tasks, setTasks }: TasksStateProps) {
  const statuses: Array<Status> = [
    // YAGNI
    { statusName: "todo" },
    { statusName: "working-on-it" },
    { statusName: "waiting" },
    { statusName: "stuck" },
    { statusName: "done" }
  ];

  function moveToAnotherGroup(status: string, task: Pick<Task, "name">) {
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
    sendNewTask({ name: task.name, status: status }); // TODO: To się może nie powieść.

    // UPDATE LOCAL COPY
    setTasks(
      tasks.map(t =>
        t.name !== task.name ? t : { name: task.name, status: status }
      )
    );
  }

  return (
    <div className="tasks-list-item">
      {/* TODO: ^ Kipeska nazwa klasy, to chyba jest tasks-lists */}
      {statuses.map(status => (
        <TaskList
          // useDrop.ref
          status={status}
          onDragOver={event => event.preventDefault()}
          onDragEnter={event => event.preventDefault()}
          onDrop={event => {
            event.preventDefault(); // TUTAJ
            const name = event.dataTransfer.getData("text/plain");
            console.log("dragged");
            // JESTEŚMY TU
            moveToAnotherGroup(status.statusName, { name });
          }}
        >
          {tasks
            .filter(task => task.status == status.statusName)
            .map(task => (
              <article
                className="task-item"
                draggable
                onDragStart={event => {
                  event.dataTransfer.setData("text/plain", task.name);
                }}
              >
                <p className="task-name">{task.name}</p>
                <ButtonsGroup>
                  {statuses
                    .filter(
                      currentStatus => currentStatus.statusName != task.status
                    )
                    .map(status => (
                      <TaskButton
                        onClick={() =>
                          moveToAnotherGroup(status.statusName, task)
                        }
                      >
                        {status.statusName}
                      </TaskButton>
                    ))}
                </ButtonsGroup>
              </article>
            ))}
        </TaskList>
      ))}
    </div>
  );
}
