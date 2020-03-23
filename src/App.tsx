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
import { Task, TaskProps } from "./types";
import { TasksLists } from "./TasksLists";
import theme from "./theme";

const tasksArray: Array<Task> = [];

const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";

const tasksRequest = new Request(HOST + "/tasks");
const newTaskPostURL = new Request(HOST + "/tasks");
const updateTaskPostURL = new Request(HOST + "/update-tasks");

export function App() {
  const [tasks, setTasks] = useState<Task[]>(tasksArray);
  let newTaskToAdd: Task;

  useEffect(() => {
    fetch(tasksRequest)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const newArray = { data };

        const newData = newArray.data;

        setTasks(newData);
      })
      .catch(error => console.log("We had en error" + error));
  }, []);

  const onSubmit: (event: React.FormEvent<HTMLFormElement>) => void = event => {
    event.preventDefault();
    const { name } = readFormValues(event.currentTarget);
    const ArrayWithTasksToSave = tasks.slice();
    const newTask = { name: name, status: "todo" };
    ArrayWithTasksToSave.unshift(newTask);
    sendNewTask(newTask);
    setTasks(ArrayWithTasksToSave);
  };

  interface TasksListsProps {
    state: Array<Task>;
    setState: React.Dispatch<React.SetStateAction<Task[]>>;
  }

  const wraperForTasksList: TaskProps = {
    tasks: tasks,
    setTasks: setTasks
  };

  return (
    <Fragment>
      <ThemeProvider theme={theme}></ThemeProvider>
      <TaskForm onSubmit={onSubmit} />

      <TasksLists
        setTasks={wraperForTasksList.setTasks}
        tasks={wraperForTasksList.tasks}
      />
      <RemoveAllData />
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
          add task: <br />
          <input
            name="taskName"
            className="add-task-input-field"
            type="text"
            placeholder="task name"
            minLength={1}
          />
          <button type="submit" className="submit-button">
            add task
          </button>
        </label>
      </form>
    </div>
  );
}

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

function RemoveAllData() {
  return (
    <button
      className="remove-data-button"
      onClick={() => {
        fetch(HOST + "/remove-data", {
          method: "POST"
        });
      }}
    >
      // REMOVE ALL DATA //
    </button>
  );
}
