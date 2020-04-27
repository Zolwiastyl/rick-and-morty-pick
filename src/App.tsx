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
  putItAbove,
  takeOrdinalNumbers,
  generateOrdinalNumber,
} from "./api";
import { Plus, User } from "react-feather";
import { NavBar } from "./components/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import { Profile } from "./components/Profile";
import { Router, Route, Switch, Link } from "react-router-dom";
import history from "./utils/history";
import { PrivateRoute } from "./components/PrivateRoute";
import { TasksGraph } from "./TasksGraph";
import { BruteGraph } from "./BruteGraph";

const tasksArray: Array<Task> = [];

const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";

export function App() {
  const [showGraph, toggleGraph] = useState<boolean>(false);
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
  /*  const callApiToDeleteTask = async (task: Task) => {
    try {
      const token = await client?.getTokenSilently();

    }
  }
*/
  const onSubmit: (event: React.FormEvent<HTMLFormElement>) => void = (
    event
  ) => {
    event.preventDefault();
    const { name } = readFormValues(event.currentTarget);
    event.currentTarget.reset();
    const ArrayWithTasksToSave = tasks.slice();
    function generateOrdinalForNewTask(tasks: Task[]) {
      const tasksToDo = tasks.filter((t) => t.status == "todo");
      if (tasksToDo.length == 0) {
        return 2.1;
      } else {
        return tasksToDo.sort((x, y) => x.ordinalNumber - y.ordinalNumber)[0]
          .ordinalNumber;
      }
    }
    const newOrdinal = (0 + generateOrdinalForNewTask(tasks)) / 2;

    const newTask: Task = {
      name: name,
      status: "todo",
      frontEndId: generateIdForTask(),
      dependencyId: [],
      isReady: false,
      userId: user.sub,
      ordinalNumber: newOrdinal,
      dependOnThisTask: [],
    };
    ArrayWithTasksToSave.unshift(newTask);
    callApiToSendTask(newTask);
    setTasks(ArrayWithTasksToSave);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <button onClick={() => callApiToFetchData(setTasks)}>fetch data</button>
      <button
        onClick={() => {
          toggleGraph(!showGraph);
        }}
      >
        toggle graph
      </button>
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
        <div>
          {!showGraph && <TasksLists setTasks={setTasks} tasks={tasks} />}
          {showGraph && <BruteGraph setTasks={setTasks} tasks={tasks} />}
        </div>
        <RemoveAllData setTasks={setTasks} />
      </Router>
    </Fragment>
  );
}
/*{showGraph && <TasksGraph setTasks={setTasks} tasks={tasks} />} */
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
