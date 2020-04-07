import React, { useState, useEffect } from "react";
import { Fragment } from "react";

import "./App.scss";

import { Task } from "./types";
import { TasksLists } from "./TasksLists";

import {
  sendNewTask,
  generateIdForTask,
  fetchDataFromServer,
  RemoveAllData,
} from "./api";
import { Plus, User } from "react-feather";
import { NavBar } from "./components/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import { Profile } from "./components/Profile";
import { Router, Route, Switch, Link } from "react-router-dom";
import history from "./utils/history";
import { PrivateRoute } from "./components/PrivateRoute";

const tasksArray: Array<Task> = [];

const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";

export function App() {
  const { loading, client, user } = useAuth0();
  const [tasks, setTasks] = useState<Task[]>(tasksArray);
  useEffect(() => {
    callApiToFetchData(setTasks);
  }, [loading, user, client]);

  const callApiToFetchData = async (
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  ) => {
    try {
      const token = await client?.getTokenSilently();
      const response = async () => await fetchDataFromServer(setTasks, token);
      response();
    } catch (error) {
      console.error(error);
    }
  };
  const callApiToSendTask = async (task: Task) => {
    try {
      const token = await client?.getTokenSilently();
      const response = async () => await sendNewTask(task, token);
      response();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit: (event: React.FormEvent<HTMLFormElement>) => void = (
    event
  ) => {
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
      userId: user.id,
      ordinalNumber: 1,
    };
    ArrayWithTasksToSave.unshift(newTask);
    callApiToSendTask(newTask);
    setTasks(ArrayWithTasksToSave);
  };
  console.log();
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Fragment>
      <button onClick={() => callApiToFetchData(setTasks)}>fetch data</button>
      <Router history={history}>
        <PrivateRoute path="/profile" component={Profile} />
        <header>
          <NavBar />
        </header>

        <Switch>
          <Route path="/" exact />
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
  onSubmit,
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
        color: "primary", // picks up value from `theme.colors.primary`
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
