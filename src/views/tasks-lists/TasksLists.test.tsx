import { Auth0Client } from "@auth0/auth0-spa-js";
import {
	fireEvent,
	getByTestId,
	getByText,
	render,
} from "@testing-library/react";
import React, { useState } from "react";

import { Task } from "../../types";
import { TasksLists } from "./TasksLists";

const tasksArray: Task[] = [
	{
		dependOnThisTask: [],
		dependencyId: [],
		frontEndId: "Task5Id",
		isReady: false,
		name: "Defeat Thanos",
		ordinalNumber: 0.065625,
		status: "todo",
		userId: "github|45352717",
	},
	{
		dependOnThisTask: [],
		dependencyId: [],
		frontEndId: "Task6Id",
		isReady: false,
		name: "Nie pokonuj Thanosa",
		ordinalNumber: 0.0328125,
		status: "todo",
		userId: "github|45352717",
	},
];

const TestComponent = () => {
	const [tasks, setTasks] = useState(tasksArray);
	const clientMock: Auth0Client | undefined = undefined;
	return (
		<TasksLists
			tasks={tasks}
			setTasks={setTasks}
			updateDescription={() => {}}
			updateName={() => {}}
			client={clientMock}
		/>
	);
};

test("expect second task to be displayed", async () => {
	const { container } = render(<TestComponent />);
	getByText(container, "Defeat Thanos");
});
test("Task Card opens when chevron is clicked", () => {
	const { container } = render(<TestComponent />);
	const secondTaskButton = getByTestId(container, "Task6Id-toggle-task-card");
	fireEvent.click(secondTaskButton);
});

//samodzielny test - implementacja ma pokazywać asserta
// 3*A A coś tam Act Assert
