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

interface GroupOfButtonsProps {
  task: Task;
  statuses: Status[];
  moveToAnotherGroup: (status: string, task: Task) => void;
}
function GroupOfButtons({ task, statuses }: GroupOfButtonsProps) {
  return (
    <motion.div
      className="task-item"
      drag={true}
      onDragEnd={(event, info) => {}}
    >
      <p className="task-name">{task.name}</p>
      <div className="buttons-group">
        move to:
        {statuses
          .filter(currentStatus => currentStatus.statusName != task.status)
          .map(status => (
            <TaskButton onClick={() => moveToAnotherGroup(status, task)}>
              {status.statusName}
            </TaskButton>
          ))}
      </div>
    </motion.div>
  );
}

interface TaskListProps {
  statusName: string;
  tasks: Task[];
  statuses: Status[];
  moveToAnotherGroup: (status: string, task: Task) => void;
}
function TaskList({ statusName, tasks, statuses }: TaskListProps) {
  console.log(statusName.split("").join(""));
  console.log("TaskList ran");
  console.log(statusName);
  //props.tasks.map(element =>console.log({ key: element.name, value: element.status }));
  return (
    <div className={statusName}>
      <p className="group-heading"> // {statusName} //</p>
      {tasks
        .filter(task => task.status == statusName)
        .map(task => (
          <GroupOfButtons
            task={task}
            statuses={statuses}
            moveToAnotherGroup={moveToAnotherGroup}
          />
        ))}
    </div>  }
  }
  }
  }

  return <TaskItem />;
  return <TaskItem />;
}

  );
}

function TaskItem() {
  // list of status może być tutaj podawany w propie
  const TaskItem = listOfStatus.map(status => (
    <div className="tasks-group">
      <TaskList statusName={status.statusName} tasks={tasks} />
    </div>
  ));

  return <div className="TaskButtontasks-list-item">{TaskItem}</div>;
}

type Status = {
  statusName: string;
};

export function TasksLists({ tasks, setTasks }: TasksStateProps) {
  const listOfStatus: Array<Status> = [
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

    // UPDATE ON SERVER
    sendNewTask({ name: task.name, status: status }); // TODO: To się może nie powieść.

    // UPDATE LOCAL COPY
    setTasks(
      tasks.map(t =>
        t.name !== task.name ? t : { name: task.name, status: status }
      )
    );
  }

  return null;
}
