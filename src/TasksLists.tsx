import React, {
  SyntheticEvent,
  ChangeEvent,
  Props,
  ComponentType
} from "react";
import { StateProps } from "./interfaces";
import { Task, TasksStateProps } from "./types";
import styled, { createGlobalStyle, css } from "styled-components";
import { motion } from "framer-motion";
import { sendNewTask, removeTask, moveToAnotherGroup } from "./api";
import { Autocomplete } from "@material-ui/lab";
import { TextField, ClickAwayListener } from "@material-ui/core";

import {
  Layers,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Trash2
} from "react-feather";

function renderIcon(
  Icon: React.ComponentClass<{}, any> | React.FunctionComponent<{}> | undefined
) {
  if (Icon) {
    return <Icon />;
  }
}

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
  status: { statusName, StatusIcon },
  children,
  ...rest
}) => {
  return (
    <div className="tasks-group" {...rest}>
      <p className="group-heading">
        {renderIcon(StatusIcon)} // {statusName} //
      </p>
      {console.log(StatusIcon)}

      {children}
    </div>
  );
};

const ButtonsGroup: React.FC = ({ children }) => {
  return <div className="buttons-group">move to: {children}</div>;
};

type Status = {
  statusName: string;
  StatusIcon?: React.ComponentClass<{}, any> | React.FunctionComponent<{}>;
};

export function TasksLists({ tasks, setTasks }: TasksStateProps) {
  const statuses: Array<Status> = [
    // YAGNI
    { statusName: "todo", StatusIcon: Layers },
    { statusName: "working-on-it", StatusIcon: Activity },
    { statusName: "waiting", StatusIcon: Clock },
    { statusName: "stuck", StatusIcon: AlertTriangle },
    { statusName: "done", StatusIcon: CheckCircle }
  ];
  const DeleteButton = (task: Task) => {
    return (
      <button
        onClick={() => {
          setTasks(tasks.filter(t => t.frontEndId != task.frontEndId));
          removeTask(task);
        }}
      >
        {renderIcon(Trash2)}
      </button>
    );
  };

  return (
    <div className="tasks-lists-item">
      {/* TODO: ^ Kipeska nazwa klasy, to chyba jest tasks-lists */}
      {statuses.map(status => (
        <TaskList
          // useDrop.ref
          status={status}
          onDragOver={event => {
            event.preventDefault();
          }}
          onDrop={event => {
            event.preventDefault();
            console.log(
              "has child nodes ",
              event.currentTarget.hasChildNodes()
            );
            if (event.currentTarget.hasChildNodes()) {
              console.log("first con passed");
              event.preventDefault();
              const taskId = event.dataTransfer.getData("text/plain");
              if (
                tasks.filter(t => t.frontEndId == taskId)[0].status !=
                status.statusName
              ) {
                moveToAnotherGroup(
                  status.statusName,
                  tasks.filter(task => task.frontEndId == taskId)[0],
                  { tasks, setTasks }
                );
              }
              console.log("dragged");
            }
          }}
          onDragEnter={event => event.preventDefault()}
        >
          {tasks
            .filter(task => task.status == status.statusName)
            .sort((x, y) => x.ordinalNumber - y.ordinalNumber)
            .map(task => (
              <article
                id={task.frontEndId}
                className="task-item"
                draggable
                onDragStart={event => {
                  event.dataTransfer.setData("text/plain", task.frontEndId);
                  event.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={event => {
                  event.preventDefault();

                  const draggedTaskId = event.currentTarget.id;

                  event.currentTarget.parentNode?.insertBefore(
                    event.currentTarget,
                    event.currentTarget
                  );
                }}
                onDrop={event => {
                  event.preventDefault();
                  const taskId = event.dataTransfer.getData("text/plain");

                  const positionX = event.clientX;

                  const parent = event.currentTarget.parentNode;
                  if (
                    event.clientY - event.currentTarget.offsetTop >
                    event.currentTarget.offsetHeight / 2
                  ) {
                    moveToAnotherGroup(
                      status.statusName,
                      {
                        ...tasks.filter(task => task.frontEndId == taskId)[0],
                        ordinalNumber:
                          tasks.filter(
                            t => t.frontEndId == event.currentTarget.id
                          )[0].ordinalNumber! + 1
                      },
                      { tasks, setTasks }
                    );
                  } else {
                    console.log(
                      "it's in the top of " +
                        tasks.filter(
                          t => t.frontEndId == event.currentTarget.id
                        )[0].name
                    );
                  }
                  if (
                    tasks.filter(t => t.frontEndId == taskId)[0].status !=
                    status.statusName
                  ) {
                    moveToAnotherGroup(
                      status.statusName,
                      tasks.filter(task => task.frontEndId == taskId)[0],
                      { tasks, setTasks }
                    );
                  }
                  console.log("dragged");
                }}
              >
                <div className="upper-part-of-task-element">
                  <p className="task-name">{task.name}</p>
                  <ButtonsGroup>
                    {statuses
                      .filter(
                        currentStatus => currentStatus.statusName != task.status
                      )
                      .map(status => (
                        <TaskButton
                          onClick={() =>
                            moveToAnotherGroup(status.statusName, task, {
                              tasks,
                              setTasks
                            })
                          }
                        >
                          {renderIcon(status.StatusIcon)}
                        </TaskButton>
                      ))}
                    {DeleteButton(task)}
                  </ButtonsGroup>
                </div>
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
