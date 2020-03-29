import React, {
  useState,
  Dispatch,
  SetStateAction,
  FormEvent,
  ButtonHTMLAttributes,
  useEffect
} from "react";
import { Fragment, useContext } from "react";
import { ThemeProvider, jsx } from "theme-ui";
import "./App.scss";
import { StateProps } from "./interfaces";
import { Task, TasksStateProps } from "./types";
import { TasksLists } from "./TasksLists";
import theme from "./theme";
import { number } from "prop-types";
import {
  sendNewTask,
  generateIdForTask,
  fetchDataFromServer,
  RemoveAllData
} from "./api";
import { Router, Route, Switch, Link } from "react-router-dom";
import { Plus } from "react-feather";

const tasksArray: Array<Task> = [];

const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";

export function App() {
  const [tasks, setTasks] = useState<Task[]>(tasksArray);

  useEffect(() => {
    fetchDataFromServer(setTasks);
  }, []);

  const onSubmit: (event: React.FormEvent<HTMLFormElement>) => void = event => {
    event.preventDefault();
    const { name } = readFormValues(event.currentTarget);
    event.currentTarget.reset();
    const ArrayWithTasksToSave = tasks.slice();
    const newTask: Task = {
      name: name,
      status: "todo",
      frontEndId: generateIdForTask(),
      dependencyId: [],
      isReady: true
    };
    ArrayWithTasksToSave.unshift(newTask);
    sendNewTask(newTask);
    setTasks(ArrayWithTasksToSave);
  };
  return (
    <Fragment>
      <button onClick={() => fetchDataFromServer}>fetch data</button>

      <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
      <ThemeProvider theme={theme}></ThemeProvider>
      <TaskForm onSubmit={onSubmit} />

      <TasksLists setTasks={setTasks} tasks={tasks} />
      <RemoveAllData setTasks={setTasks} />
    </Fragment>
  );
}
/*
const Task: React.FC<TaskProps> = ({ amazingProp, ...rest }) => {
  return <button {...rest}>{amazingProp + 10}</button>
  }*/

function readFormValues(form: HTMLFormElement) {
  const { taskName } = (form.elements as any) as Record<
    string,
    HTMLInputElement | undefined
  >;
  if (!taskName) {
    throw new Error("something is missing");
  }
  return { name: taskName.value };
}

function TaskForm({
  onSubmit
}: {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  generateIdForTask();
  return (
    <div
      className="add-task-form-item"
      sx={{
        fontWeight: "bold",
        fontSize: 4, // picks up value from `theme.fontSizes[4]`
        color: "primary" // picks up value from `theme.colors.primary`
      }}
    >
      <form className="add-task-form" onSubmit={onSubmit}>
        <label className="add-task-label">
          <input
            name="taskName"
            className="add-task-input-field"
            type="text"
            placeholder="task name"
            minLength={1}
          />
          <i data-feather="align-center"></i>
          <button type="submit" className="submit-button" value="add task">
            <Plus />
          </button>
        </label>
      </form>
    </div>
  );
}
