import react from "react";
import { Task, TasksStateProps } from "./types";
import React from "react";
import { useAuth0 } from "./react-auth0-spa";
import { any } from "prop-types";

export const HOST: string = "https://zolwiastyl-todoapp.builtwithdark.com";
const tasksRequest = new Request(HOST + "/tasks");
const newTaskPostURL = new Request(HOST + "/tasks");
const updateTaskPostURL = new Request(HOST + "/update-tasks");
const removeTaskUrl = new Request(HOST + "/remove-task");

export function generateIdForTask() {
  return Date()
    .split("")
    .filter((element) => /\d/.test(element))
    .join("");
}

export function sendNewTask(task: Partial<Task>, token: any) {
  const fetchAction = fetch(newTaskPostURL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: task.name,
      status: task.status,
      frontEndId: task.frontEndId,
      dependencyId: task.dependencyId,
      isReady: task.isReady,
      userId: task.userId,
      dependOnThisTask: task.dependOnThisTask,
      ordinalNumber: task.ordinalNumber,
    }),
  }).catch((error) => {
    console.log("problem with fetching data:", error);
    return false;
  });
  return fetchAction;
}

export function fetchDataFromServer(
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  token: any
) {
  fetch(tasksRequest, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const newArray = { data };
      const newData = newArray.data;
      setTasks(newData);
    })
    .catch((error) => console.log("We had en error" + error));
}

export function RemoveAllData(props: Partial<TasksStateProps>) {
  return (
    <button
      className="remove-data-button"
      onClick={() => {
        fetch(HOST + "/remove-data", {
          method: "POST",
        });
      }}
    >
      // REMOVE ALL DATA //
    </button>
  );
}

export function removeTask(task: Task) {
  fetch(removeTaskUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      frontEndId: task.frontEndId,
    }),
  });
}
export function renderIcon(
  Icon: React.ComponentClass<{}, any> | React.FunctionComponent<{}> | undefined
) {
  if (Icon) {
    return <Icon />;
  }
}
function checkIfTaskIsReady(task: Task, tasks: Task[], token: any) {
  console.log(
    task.dependencyId?.map((id) =>
      tasks.filter((task) => task.frontEndId == id)
    )
  );
}
export function moveToAnotherGroup(
  status: string,
  task: Task,
  state: TasksStateProps,
  token: any
) {
  if (
    sendNewTask(
      {
        ...task,

        status: status,
      },
      token
    )
  ) {
    if (status == "done") {
      console.log("done");
      console.log({ key: task.name, value: task.dependencyId });
      console.log({ key: task.name, value: task.dependOnThisTask });
      task.dependOnThisTask?.map((id) =>
        state.tasks
          .filter((task) => task.frontEndId == id)
          .map((task) => checkIfTaskIsReady(task, state.tasks, token))
      );
    }
    // UPDATE LOCAL COPY
    console.log("submitted");
    state.setTasks(
      state.tasks.map((t) =>
        t.frontEndId !== task.frontEndId
          ? t
          : {
              name: task.name,
              status: status,
              frontEndId: task.frontEndId,
              isReady: task.isReady,
              userId: task.userId,
              ordinalNumber: task.ordinalNumber,
              dependOnThisTask: task.dependOnThisTask,
              dependencyId: task.dependencyId,
            }
      )
    );
  } else {
    return console.log("couldn't sent the task to server");
  }
}

function generateOrdinalNumber(tasks: Task[]) {
  tasks.sort((x, y) => x.ordinalNumber - y.ordinalNumber);
  const ordinalsAsDigits = tasks.map((t) => t.ordinalNumber.toString().split);
  ordinalsAsDigits[(0, 0)];
}

/*import React from "react";
import "./styles.css";

type Task = {
  ordinalNumber: number;
};

export default function App() {
  function generateOrdinalNumber(tasks: Task[]) {
    tasks.sort((x, y) => x.ordinalNumber - y.ordinalNumber);
    const ordinalsAsDigits = tasks.map(t =>
      t.ordinalNumber.toString().split("")
    );
    const firstOrdinal = ordinalsAsDigits[0];
    console.log(firstOrdinal[firstOrdinal.length - 1]);
    return <div>{ordinalsAsDigits[0]}</div>;
  }
  const arrayOfTasks: Array<Task> = [
    { ordinalNumber: 2.34 },
    { ordinalNumber: 2.35 }
  ];
  generateOrdinalNumber(arrayOfTasks);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>

      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
 */
