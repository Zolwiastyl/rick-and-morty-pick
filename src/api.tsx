import react from "react";
import { Task, TasksStateProps } from "./types";
import React from "react";
import { useAuth0 } from "./react-auth0-spa";
import { any, string } from "prop-types";

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
    // UPDATE LOCAL COPY
    console.log("submitted");
    console.log(state.tasks);
    console.log(
      state.tasks.map((t) => {
        if (t == task) {
          return {
            ...task,
            status: status,
          };
        } else {
          return t;
        }
      })
    );
    console.log(task);
    console.log(task.frontEndId);
    state.setTasks(
      state.tasks.filter((t) => t.frontEndId !== task.frontEndId).concat([task])
    );
  } else {
    return console.error("couldn't sent the task to server");
  }

  state.setTasks(
    state.tasks.map((t) =>
      t.frontEndId == task.frontEndId ? t : { ...task, status: status }
    )
  );
  state.setTasks(
    state.tasks.filter((t) => t.frontEndId !== task.frontEndId).concat([task])
  );
}

export function generateOrdinalNumber(ordinals: number[]) {
  if (!numbersAreValid(ordinals)) {
    return console.error("number not valid");
  }
  try {
    numbersAreValid(ordinals);
  } catch (error) {
    return "numbers are not valid";
  }
  const ordinalsAsDigits = ordinals
    .sort((x, y) => x - y)
    .map((t) => t.toString().split(""));
  const [firstOrdinal, secondOrdinal] = makeArraysEqual(
    ordinalsAsDigits[0],
    ordinalsAsDigits[1]
  );

  const indexOfLastDigitOfNewOrdinal = findIndexOfLastDigitOfNewOrdinal(
    firstOrdinal,
    secondOrdinal
  );

  const lastNumberX = +firstOrdinal[indexOfLastDigitOfNewOrdinal];
  const lastNumberY = +secondOrdinal[indexOfLastDigitOfNewOrdinal];

  const ordinalBase = makeNewOrdinalBase(
    firstOrdinal,
    indexOfLastDigitOfNewOrdinal
  );
  return generateMiddleValue(lastNumberX, lastNumberY, ordinalBase);
}

export function makeArraysEqual(
  array3: Array<string>,
  array4: Array<string>
): Array<Array<string>> {
  const array1 = array3.slice();
  const array2 = array4.slice();
  if (!array1.some((digit) => digit == ".")) {
    array1.push(".");
    return makeArraysEqual(array1, array2);
  }
  if (!array2.some((digit) => digit == ".")) {
    array2.push(".");
    return makeArraysEqual(array1, array2);
  }
  if (array1.length < array2.length) {
    array1.push("0");
    return makeArraysEqual(array1, array2);
  } else if (array1.length > array2.length) {
    array2.push("0");
    return makeArraysEqual(array1, array2);
  } else return [array1, array2];
}
export function generateMiddleValue(
  lastNumberX: number,
  lastNumberY: number,
  newOrdinal: string[]
) {
  if (lastNumberY - lastNumberX <= 1) {
    newOrdinal.push("5");
    return +newOrdinal.join("");
  }
  if (lastNumberY - lastNumberX > 1) {
    newOrdinal.pop();
    const halfOfDiffrence = (lastNumberY - lastNumberX) / 2;
    if (halfOfDiffrence % 2 == 0) {
      newOrdinal.push((halfOfDiffrence + +lastNumberX).toString());
      return +newOrdinal.join("");
    } else {
      newOrdinal.push((halfOfDiffrence + +lastNumberX - 0.5).toString());
      return +newOrdinal.join("");
    }
  }

  if (lastNumberY === 0) {
    newOrdinal.pop();
    const valueToPush = ((10 - lastNumberX) / 2 + +lastNumberX).toString();
    newOrdinal.push(valueToPush);
    return +newOrdinal.join("");
  }
}
export function findIndexOfLastDigitOfNewOrdinal(
  firstOrdinal: Array<string>,
  secondOrdinal: Array<string>
) {
  const indexOfLastDigit = firstOrdinal.findIndex(
    (digit) =>
      digit !== secondOrdinal[firstOrdinal.indexOf(digit)] &&
      firstOrdinal[firstOrdinal.indexOf(digit) + 1] != "9"
  );
  if (
    firstOrdinal[indexOfLastDigit] == "0" &&
    firstOrdinal[indexOfLastDigit - 1] == "."
  ) {
    return indexOfLastDigit;
  } else {
    return indexOfLastDigit;
  }
}

export function makeNewOrdinalBase(
  firstOrdinal: string[],
  indexOfLastDigitOfNewOrdinal: number
): string[] {
  {
    if (
      firstOrdinal
        .slice(0, indexOfLastDigitOfNewOrdinal + 1)
        .some((digit) => digit == ".")
    ) {
      return firstOrdinal.slice(0, indexOfLastDigitOfNewOrdinal + 1);
    } else {
      const newOrdinal = firstOrdinal.slice(
        0,
        indexOfLastDigitOfNewOrdinal + 1
      );
      newOrdinal.push(".");

      return newOrdinal;
    }
  }
}

export function numbersAreValid(arrayOfNumbers: Array<number>): boolean {
  if (arrayOfNumbers.some((number) => number == undefined && number == null)) {
    return false;
  } else return true;
}

export enum TaskPlacement {
  Above,
  Below,
}

export function takeOrdinalNumbers(
  idOfDraggedTask: string,
  idOfEventTarget: string,
  tasks: Task[],
  wherPlaceTask: TaskPlacement
): Array<number> {
  tasks.findIndex((t) => t.frontEndId == idOfDraggedTask);
  const theArray: Array<number> = [];
  return theArray;
}
