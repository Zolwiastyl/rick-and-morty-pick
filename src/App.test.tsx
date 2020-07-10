import { Auth0Client } from "@auth0/auth0-spa-js";
import {
	fireEvent,
	getByTestId,
	getByText,
	render,
} from "@testing-library/react";
import React, { useState } from "react";

import { Task } from "./types";
import { TasksLists } from "./views/tasks-lists/TasksLists";

const tasksArray: Task[] = [
	{
		dependOnThisTask: [],
		dependencyId: [],
		frontEndId: "Task5Id",
		isReady: false,
		name: "Task 5",
		ordinalNumber: 0.065625,
		status: "todo",
		userId: "github|45352717",
	},
	{
		dependOnThisTask: [],
		dependencyId: [],
		frontEndId: "Task6Id",
		isReady: false,
		name: "Task 6",
		ordinalNumber: 0.0328125,
		status: "todo",
		userId: "github|45352717",
	},
];

const TestComponent = () => {
	const [tasks, setTasks] = useState(tasksArray);

	return <TasksLists tasks={tasks} setTasks={setTasks} />;
};

test("First task name on TaskLabel is correct", async () => {
	const { container } = render(<TestComponent />);
	const firstTaskName = getByTestId(container, "Task5Id");

	expect(firstTaskName.textContent).toBe("Task 5");
});

test("expect second task to be displayed", async () => {
	const { container } = render(<TestComponent />);
	const firstTaskName = getByText(container, "Task 6");

	expect(firstTaskName).toBeInTheDocument();
});
test("Task Card opens when chevron is clicked", () => {
	const { container } = render(<TestComponent />);
	const secondTaskButton = getByTestId(container, "Task6Id-toggle-task-card");
	fireEvent.click(secondTaskButton);
});
