import React, { SyntheticEvent, ChangeEvent } from "react";
import { StateProps } from "./interfaces";
import { Task, TasksStateProps } from "./types";
import styled, { createGlobalStyle, css } from "styled-components";
import { motion } from "framer-motion";
import { generateIdForTask, sendNewTask } from "./api";
import { Autocomplete } from "@material-ui/lab";
import { TextField, ClickAwayListener } from "@material-ui/core";
import { createEvent } from "@testing-library/react";

// api

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

  function moveToAnotherGroup(status: string, task: Task) {
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
    const idForNewTask = generateIdForTask();
    // UPDATE ON SERVER
    sendNewTask({
      name: task.name,
      status: status,
      frontEndId: task.frontEndId,
      dependencyId: task.dependencyId
    }); // TODO: To się może nie powieść.

    // UPDATE LOCAL COPY
    console.log("submitted");
    setTasks(
      tasks.map(t =>
        t.name !== task.name
          ? t
          : { name: task.name, status: status, frontEndId: idForNewTask }
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
            const taskId = event.dataTransfer.getData("text/plain");
            console.log("dragged");
            // JESTEŚMY TU
            moveToAnotherGroup(
              status.statusName,
              tasks.filter(element => element.frontEndId == taskId)[0]
            );
          }}
        >
          {tasks
            .filter(task => task.status == status.statusName)
            .map(task => (
              <article
                className="task-item"
                draggable
                onDragStart={event => {
                  event.dataTransfer.setData("text/plain", task.frontEndId);
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
                  <button
                    onClick={() => {
                      console.log(task);
                    }}
                  >
                    show data
                  </button>
                </ButtonsGroup>
                <Autocomplete
                  className="add-dependency-box"
                  id={task.frontEndId}
                  options={tasks}
                  getOptionLabel={(option: Task) => option.name}
                  style={{ width: 300 }}
                  onChange={(event: ChangeEvent<{}>, value: Task | null) => {
                    const dependencyTask = tasks.filter(
                      element => element.name == value?.name
                    )[0];
                    console.log(dependencyTask);
                    console.log(task.frontEndId, task.dependencyId);
                    const newTask = {
                      ...task
                    };
                    newTask?.dependencyId?.push(dependencyTask.frontEndId);
                    console.log(newTask);
                    sendNewTask(newTask);
                    tasks.push(newTask);
                    setTasks(tasks.filter(element => element != task));
                    console.log(task.dependencyId);
                    console.log(value?.frontEndId);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="add dependency"
                      variant="outlined"
                    />
                  )}
                />
              </article>
            ))}
        </TaskList>
      ))}
    </div>
  );
}
