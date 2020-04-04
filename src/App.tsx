import React, { useState, useEffect } from "react";
import { Fragment } from "react";

import "./App.scss";

import { Task } from "./types";
import { TasksLists } from "./TasksLists";

import {
  sendNewTask,
  generateIdForTask,
  fetchDataFromServer,
  RemoveAllData
} from "./api";
import { Plus } from "react-feather";
import { NavBar } from "./components/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import { Profile } from "./components/Profile";
import { Router, Route, Switch, Link } from "react-router-dom";
import history from "./utils/history";
import { PrivateRoute } from "./components/PrivateRoute";
import ExternalApi from "./views/ExternalApi";
import { userInfo } from "os";

const tasksArray: Array<Task> = [];

const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";

export function App() {
  const { loading } = useAuth0();
  const [tasks, setTasks] = useState<Task[]>(tasksArray);

  useEffect(() => {
    fetchDataFromServer(setTasks);
  }, []);
  const { user } = useAuth0();

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
      isReady: true,
      userId: user.toString()
    };
    ArrayWithTasksToSave.unshift(newTask);
    sendNewTask(newTask);
    setTasks(ArrayWithTasksToSave);
  };
  console.log();
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Fragment>
      <button onClick={() => fetchDataFromServer}>fetch data</button>
      <Router history={history}>
        <PrivateRoute path="/profile" component={Profile} />
        <header>
          <NavBar />
        </header>

        <Switch>
          <Route path="/" exact />
          <PrivateRoute path="/external-api" component={ExternalApi} />
        </Switch>
        <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
        <TaskForm onSubmit={onSubmit} />
        <TasksLists setTasks={setTasks} tasks={tasks} />
        <RemoveAllData setTasks={setTasks} />
      </Router>
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
