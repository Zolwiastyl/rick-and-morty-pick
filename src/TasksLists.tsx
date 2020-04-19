import React, { ChangeEvent } from "react";
import { Task, TasksStateProps } from "./types";

import { sendNewTask, removeTask, moveToAnotherGroup, renderIcon } from "./api";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

import {
  Layers,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Trash2,
} from "react-feather";
import { useAuth0 } from "./react-auth0-spa";
import { findByAltText } from "@testing-library/react";

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
    { statusName: "done", StatusIcon: CheckCircle },
  ];
  const { client } = useAuth0();
  const callApiToSendTask = async (
    status: string,
    task: Task,
    state: TasksStateProps
  ) => {
    try {
      const token = await client?.getTokenSilently();
      const response = async () =>
        await moveToAnotherGroup(status, task, state, token);
      response();
    } catch (error) {
      console.error(error);
    }
  };
  const token = "dupa1";
  const DeleteButton = (task: Task) => {
    return (
      <button
        onClick={() => {
          setTasks(tasks.filter((t) => t.frontEndId != task.frontEndId));
          removeTask(task);
        }}
      >
        {renderIcon(Trash2)}
      </button>
    );
  };

  const Dependencies = (task: Task) => {
    task.dependencyId?.map((id) => (
      <div>dependencies: {tasks.filter((t) => t.frontEndId == id)[0].name}</div>
    ));
  };

  return (
    <div className="tasks-lists-item">
      {statuses.map((status) => (
        <TaskList
          // useDrop.ref
          status={status}
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDrop={(event) => {
            event.preventDefault(); /* 
            console.log(
              "has child nodes ",
              event.currentTarget.hasChildNodes()
            );
            if (event.currentTarget.hasChildNodes()) {
              return;
            }
            const taskId = event.dataTransfer.getData("text/plain");
            callApiToSendTask(
              status.statusName,
              tasks.filter((task) => task.frontEndId == taskId)[0],
              { tasks, setTasks }
            );
          */
          }}
          onDragEnter={(event) => event.preventDefault()}
        >
          {tasks
            .filter((task) => task.status == status.statusName)
            .sort((x, y) => x.ordinalNumber - y.ordinalNumber)
            .map((task) => (
              <article
                id={task.frontEndId}
                className="task-item"
                draggable="true"
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/plain", task.frontEndId);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  console.log(event.currentTarget.id);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const taskId = event.dataTransfer.getData("text/plain");
                  if (
                    event.pageY - event.currentTarget.offsetTop >
                    event.currentTarget.offsetHeight / 2
                  ) {
                    const taskAboveIndex = tasks
                      .sort((x, y) => x.ordinalNumber - y.ordinalNumber)
                      .findIndex((t) => t.frontEndId == event.currentTarget.id);
                    const taskAbove = tasks[taskAboveIndex];
                    console.log(
                      taskAboveIndex,
                      taskAbove,
                      tasks[taskAboveIndex + 1]
                    );
                    const taskBelow = tasks[taskAboveIndex + 1];
                    const taskToSave = {
                      ...tasks.filter((task) => task.frontEndId == taskId)[0],
                      ordinalNumber:
                        (taskAbove.ordinalNumber + taskBelow.ordinalNumber) / 2,
                    };
                    console.log(taskToSave.frontEndId);
                    console.log(
                      tasks
                        .filter((t) => t.frontEndId !== taskToSave.frontEndId)
                        .concat([taskToSave])
                    );
                    console.log(
                      tasks.map((t) =>
                        t.frontEndId == taskToSave.frontEndId ? t : taskToSave
                      )
                    );

                    callApiToSendTask(status.statusName, taskToSave, {
                      tasks,
                      setTasks,
                    });
                    console.log({
                      ...tasks.filter((task) => task.frontEndId == taskId)[0],
                      ordinalNumber:
                        tasks.filter(
                          (t) => t.frontEndId == event.currentTarget.id
                        )[0].ordinalNumber + 1,
                    });
                  } else {
                    console.log(
                      "it's in the top of " +
                        tasks.filter(
                          (t) => t.frontEndId == event.currentTarget.id
                        )[0].name
                    );
                  }
                  if (
                    tasks.filter((t) => t.frontEndId == taskId)[0].status !=
                    status.statusName
                  ) {
                    /*callApiToSendTask(
                      status.statusName,
                      tasks.filter((task) => task.frontEndId == taskId)[0],
                      { tasks, setTasks }
                    );*/
                  }
                  console.log("dragged");
                }}
              >
                <div className="upper-part-of-task-element">
                  <p className="task-name">
                    {task.name}
                    <br />
                    {task.ordinalNumber}
                    <br /> here display if its ready:
                    {task.isReady.toString()}
                  </p>
                  <ButtonsGroup>
                    {statuses
                      .filter(
                        (currentStatus) =>
                          currentStatus.statusName != task.status
                      )
                      .map((status) => (
                        <TaskButton
                          onClick={() =>
                            callApiToSendTask(status.statusName, task, {
                              tasks,
                              setTasks,
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
                  onChange={(event: ChangeEvent<{}>, value: Task | null) => {
                    const dependencyTask = tasks.filter(
                      (element) => element.name == value?.name
                    )[0];

                    dependencyTask.dependOnThisTask.push(task.frontEndId);
                    const newTask = task;
                    newTask.dependencyId.push(dependencyTask.frontEndId);
                    //newTask.dependencyId?.concat(newArray);
                    callApiToSendTask(newTask.status, newTask, {
                      setTasks,
                      tasks,
                    });
                    console.log(newTask);

                    //Adding depends on:
                    const newDependencyTask = dependencyTask;
                    //newDependencyTask.dependOnThisTask?.concat(newArray2);
                    console.log(newDependencyTask);
                    callApiToSendTask(
                      newDependencyTask.status,
                      newDependencyTask,
                      { setTasks, tasks }
                    );
                    setTasks(
                      tasks.filter(
                        (element) =>
                          element != task && element != dependencyTask
                      )
                    );
                    console.log(tasks);
                  }}
                  renderInput={(params) => (
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
