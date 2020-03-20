import React, {
  useState,
  Dispatch,
  SetStateAction,
  FormEvent,
  ButtonHTMLAttributes,
  useEffect
} from "react";
import { Fragment, useContext } from "react";
import "./App.css";
import { StateProps } from "./interfaces";
import { Task, TaskProps } from "./types";
import { TasksLists } from "./TasksLists";

const tasksArray: Array<Task> = [{ name: "that's the app", status: "todo" }];

const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";

const tasksRequest = new Request(HOST + "/tasks");
const newTaskPostURL = new Request(HOST + "/tasks");
const updateTaskPostURL = new Request(HOST + "/update-tasks");

export function App() {
  const [tasksToDo, setTasksToDo] = useState<Task[]>(tasksArray);
  const [tasksDone, setTasksDone] = useState<Task[]>([
    { name: "this task is done", status: "done" }
  ]);

  let newTaskToAdd: Task;

  useEffect(() => {
    fetch(tasksRequest)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const newArray = { data };

        const newData = newArray.data;

        const newArrayOfTasks: Array<Task> = tasksToDo.slice();
        newArrayOfTasks.concat(newData);
        //.map(element => console.log({ key: element.name, value: element.status }));
        const newArrayOfTasksDone: Array<Task> = tasksDone.slice();
        const anyArray = newArrayOfTasks
          .concat(newData)
          .concat(newArrayOfTasksDone);
        arraysOfTasksHandler(anyArray);
      })
      .catch(error => console.log("We had en error" + error));
  }, []);
  function arraysOfTasksHandler(arrayOfTask: Array<Task>) {
    const arrayToDo = arrayOfTask.filter(task => task.status == "todo");
    const arrayDone = arrayOfTask.filter(task => task.status == "done");

    setTasksToDo(arrayToDo);
    setTasksDone(arrayDone);
  }

  const moveToDone: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void = event => {
    event.preventDefault();
    const doneTasksArrayToSave = tasksDone.slice();

    const toDoTasksArrayToSave = tasksToDo.slice();
    const task = event.currentTarget.id;

    const found = toDoTasksArrayToSave.find(
      (element: Task) => element.name == task
    );

    toDoTasksArrayToSave.splice(toDoTasksArrayToSave.indexOf(found as Task), 1);
    console.log({ toDoTasksArrayToSave });
    sendNewTask({ name: task, status: "done" });
    doneTasksArrayToSave.unshift({ name: task, status: "done" });
    setTasksDone(doneTasksArrayToSave);
    setTasksToDo(toDoTasksArrayToSave);
  };

  const onSubmit: (event: React.FormEvent<HTMLFormElement>) => void = event => {
    event.preventDefault();
    const { name } = readFormValues(event.currentTarget);
    const ArrayWithTasksToSave = tasksToDo.slice();
    const newTask = { name: name, status: "todo" };
    ArrayWithTasksToSave.unshift(newTask);
    sendNewTask(newTask);
    setTasksToDo(ArrayWithTasksToSave);
  };

  interface TasksListsProps {
    state: Array<Task>;
    setState: React.Dispatch<React.SetStateAction<Task[]>>;
  }

  function DoneList(props: StateProps) {
    return (
      <div>
        <DoneListHeading />
        <div className="tasks-element">{TasksElement(props, () => {})}</div>
      </div>
    );
  }
  function ToDoList(props: StateProps) {
    return (
      <div className="list">
        <ToDoListHeading />
        <TaskForm onSubmit={onSubmit} />
        <div className="tasks-element">{TasksElement(props, moveToDone)}</div>
      </div>
    );
  }

  const wraperForTasksList: TaskProps = {
    tasks: tasksToDo,
    setTasks: setTasksToDo
  };

  return (
    <Fragment>
      <ToDoList tasks={tasksToDo} />
      <DoneList tasks={tasksDone} />
      <RemoveAllData />
      <TasksLists
        setTasks={wraperForTasksList.setTasks}
        tasks={wraperForTasksList.tasks}
      />
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
    <div className="add-task-form">
      <form onSubmit={onSubmit}>
        <label>
          add task: <br />
          <input
            name="taskName"
            type="text"
            placeholder="task name"
            minLength={1}
          />
          <button type="submit" className="submit-button">
            Add task
          </button>
        </label>
      </form>
    </div>
  );
}

function ToDoListHeading() {
  return <h2>// tasks to do: //</h2>;
}

function TasksElement(
  { tasks }: StateProps,
  clickHandler: (event: React.MouseEvent<HTMLButtonElement>) => void
) {
  return tasks.map(task => {
    return (
      <div className="task-element">
        {task.name}
        <button
          className="move-to-done-button"
          onClick={clickHandler}
          id={task.name}
        >
          move to Done
        </button>
      </div>
    );
  });
}

function DoneListHeading() {
  return <h2>// tasks done: //</h2>;
}

function MoveToDone(task: Task, state: TaskProps) {
  const arrayToSave = state.tasks.slice();
  arrayToSave.unshift(task);
  state.setTasks(arrayToSave);
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
