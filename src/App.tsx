import React, { useState, useEffect, useCallback } from "react";
import { Fragment } from "react";

import "./index.css";

import { Task, TaskId } from "./types";
import { TasksLists } from "./views/tasks-lists/TasksLists";

import {
	fetchDataFromServer,
	RemoveAllData,
	callApi,
	renderIcon,
} from "./api/api";
import { generateIdForTask } from "./api/generateIdForTask";
import { Plus, GitMerge, RefreshCcw, AlignJustify, Image } from "react-feather";
import { Auth0NavBar } from "./components/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import { Profile } from "./components/Profile";
import { Router, Route, Switch, Link } from "react-router-dom";
import history from "./utils/history";
import { PrivateRoute } from "./components/PrivateRoute";

import { TasksGraph } from "./views/tasks-graph/BruteGraph";
import { sendNewTask, curriedSendNewTask } from "./api/sendNewTask";
import {
	makeNewTasksWithDependencies,
	sendSourceAndTargetTasks,
	makeNewTasksRemovingDependencies,
} from "./api/addDependencies";
import { Button } from "./reusable-ui/Button";
import { NavigationBar } from "./reusable-ui/NavigationBar";

const tasksArray: Array<Task> = [];

export function App() {
	// secondary boring state
	const { loading, client, user } = useAuth0();

	// ui state -- this can be replaced with url match or sth like that / router
	const [showGraph, toggleGraph] = useState<boolean>(false);

	// core domain state
	const [tasks, setTasks] = useState<Task[]>(tasksArray);

	const addEdge = useCallback(
		(from: TaskId, to: TaskId) => {
			const [
				sourceTaskToSave,
				targetTaskToSave,
			] = makeNewTasksWithDependencies(tasks, [from, to]);

			const edgeAddedToDatabase = sendSourceAndTargetTasks(
				client,
				curriedSendNewTask,
				[sourceTaskToSave, targetTaskToSave]
			);

			if (edgeAddedToDatabase) {
				setTasks(
					tasks
						.filter((t) => t.frontEndId !== from && t.frontEndId !== to)
						.concat([sourceTaskToSave, targetTaskToSave])
				);
			} else {
				console.error("couldn't send tasks");
			}
		},
		[tasks, client, setTasks]
	);

	const removeEdge = useCallback(
		(from: TaskId, to: TaskId) => {
			const [
				sourceTaskToSave,
				targetTaskToSave,
			] = makeNewTasksRemovingDependencies(tasks, [from, to]);
			console.log(sourceTaskToSave, targetTaskToSave);

			const edgeRemovedFromDatabase = sendSourceAndTargetTasks(
				client,
				curriedSendNewTask,
				[sourceTaskToSave, targetTaskToSave]
			);

			if (edgeRemovedFromDatabase) {
				setTasks(
					tasks
						.filter(
							(t) =>
								t.frontEndId != sourceTaskToSave.frontEndId &&
								t.frontEndId != targetTaskToSave.frontEndId
						)
						.concat([sourceTaskToSave, targetTaskToSave])
				);
			}
		},
		[tasks, setTasks]
	);

	useEffect(() => {
		callApiToFetchData(setTasks);
	}, [loading, user, client]);

	const callApiToFetchData = async (
		setTasks: React.Dispatch<React.SetStateAction<Task[]>>
	) => {
		try {
			const token = await client?.getTokenSilently();
			const response = async () =>
				await fetchDataFromServer(setTasks, token);
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

	const onSubmit: (
		event: React.FormEvent<HTMLFormElement>
	) => Promise<void> = async (event) => {
		event.preventDefault();
		const { name } = readFormValues(event.currentTarget);
		event.currentTarget.reset();
		const ArrayWithTasksToSave = tasks.slice();
		function generateOrdinalForNewTask(tasks: Task[]) {
			const tasksToDo = tasks.filter((t) => t.status == "todo");
			if (tasksToDo.length == 0) {
				return 2.1;
			} else {
				return tasksToDo.sort(
					(x, y) => x.ordinalNumber - y.ordinalNumber
				)[0].ordinalNumber;
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
		setTasks(ArrayWithTasksToSave);
		if (!(await callApi(client, curriedSendNewTask(newTask)))) {
			setTasks(tasks.filter((t) => t.frontEndId !== newTask.frontEndId));
			console.log("couldn't send task");
		} else {
			console.log("sent task");
		}
	};
	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<Fragment>
			<div className="flex flex-row w-screen">
				<NavigationBar>
					<Button onClick={(evt) => evt} label={"click me"} />
					<Button
						onClick={(evt) => {
							callApiToFetchData(setTasks);
						}}
						icon={renderIcon(RefreshCcw)}
					/>
					<Button
						onClick={(evt) => {
							toggleGraph(true);
						}}
						icon={renderIcon(GitMerge)}
					/>
					<Button
						onClick={(evt) => {
							toggleGraph(false);
						}}
						icon={renderIcon(AlignJustify)}
					/>
					<script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
					<TaskForm onSubmit={onSubmit} />

					<RemoveAllData setTasks={setTasks} />
					<div>
						<Router history={history}>
							<PrivateRoute path="/profile" component={Profile} />
							<header>
								<Auth0NavBar />
							</header>
						</Router>
					</div>
					<Link
						className="bg-gray-400 text-lg w-16 text-blue-600 rounded-full p-2 hover:text-blue-400 stroke-2 stroke-current mt-2"
						to="./design"
					>
						<svg
							className="h-12 w-12 bg-gray-400 rounded-full p-2"
							viewBox="0 0 24 24"
						>
							{renderIcon(Image)}
						</svg>
					</Link>
				</NavigationBar>

				<Router history={history}>
					<div className="w-full">
						{!showGraph && (
							<TasksLists setTasks={setTasks} tasks={tasks} />
						)}
						{showGraph && (
							<Fragment>
								{/* <BruteGraph setTasks={setTasks} tasks={tasks} /> */}
								<TasksGraph
									addEdge={addEdge}
									removeEdge={removeEdge}
									tasks={tasks}
								/>
							</Fragment>
						)}
					</div>

					<Switch>
						<Route path="/" exact />
					</Switch>
					{/* TODO: install feather react from npm */}
				</Router>
			</div>
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
