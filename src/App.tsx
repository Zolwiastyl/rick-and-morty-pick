import React, { useState, useEffect, useCallback, useRef } from "react";
import { Fragment } from "react";

import "./index.css";

import { Task, TaskId } from "./types";
import { TasksLists } from "./views/tasks-lists/TasksLists";

import {
	fetchDataFromServer,
	removeAllData,
	callApi,
	renderIcon,
} from "./api/api";
import { generateIdForTask } from "./api/generateIdForTask";
import {
	GitMerge,
	RefreshCcw,
	Image,
	List,
	Trash2,
	ChevronsRight,
	ChevronsLeft,
} from "react-feather";
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
	const [showNewTaskForm, toggleNewTaskForm] = useState<boolean>(false);

	const callApiToSendTask = async (task: Task) => {
		try {
			const token = await client?.getTokenSilently();
			const response = async () => await sendNewTask(task, token);
			response();
		} catch (error) {
			console.error(error);
		}
	};

	const addDescription = useCallback(
		(taskId: TaskId, description: string) => {
			const taskToSave: Task = {
				...(tasks.find((t) => t.frontEndId === taskId) as Task),
				description: description,
			};

			const addTaskToDatabase = callApiToSendTask(taskToSave);
			if (addTaskToDatabase) {
				setTasks(
					tasks.filter((t) => t.frontEndId !== taskId).concat([taskToSave])
				);
			} else {
				console.error("couldn't send task");
			}
		},
		[tasks, setTasks, client]
	);

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
								t.frontEndId !== sourceTaskToSave.frontEndId &&
								t.frontEndId !== targetTaskToSave.frontEndId
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

	const onSubmit: (
		event: React.FormEvent<HTMLFormElement>
	) => Promise<void> = async (event) => {
		event.preventDefault();
		const { name } = readFormValues(event.currentTarget);
		event.currentTarget.reset();
		const ArrayWithTasksToSave = tasks.slice();
		function generateOrdinalForNewTask(tasks: Task[]) {
			const tasksToDo = tasks.filter((t) => t.status == "todo");
			if (tasksToDo.length === 0) {
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
	//RELACJONALNA DAZA BANYCH
	//RELATYWNA BAZA DANYCH
	//ABSOLUTYSTYCZNA BAZA DANYCH
	return (
		<Fragment>
			<div className="flex flex-row w-screen max-w-screen p-1 overflow-hidden h-screen max-h-screen">
				<NavigationBar>
					<div className="flex flex-row w-2/5 fixed opacity-75">
						<Button
							onClick={() => toggleNewTaskForm(!showNewTaskForm)}
							icon={
								showNewTaskForm ? <ChevronsLeft /> : <ChevronsRight />
							}
						/>
						<div>
							{showNewTaskForm ? <TaskForm onSubmit={onSubmit} /> : null}
						</div>
					</div>
					<div className="h-20"></div>
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
						icon={renderIcon(List)}
					/>
					<Button
						icon={renderIcon(Trash2)}
						onClick={(evt) => {
							removeAllData();
						}}
					/>
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
				<div className="w-full min-w-full max-w-full max-h-screen h-full">
					<Router history={history}>
						{!showGraph && (
							<TasksLists
								setTasks={setTasks}
								tasks={tasks}
								addDescription={addDescription}
							/>
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

						<Switch>
							<Route path="/" exact />
						</Switch>
					</Router>
				</div>
			</div>
		</Fragment>
	);
}

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
		<div className=" w-full opacity-75 rounded-r-lg p-3 bg-gray-500  ml-1 h-16 border-gray-900 flex flex-row flex-no-wrap">
			<form onSubmit={onSubmit}>
				<label className="h-14 text-lg w-full">
					<input
						autoFocus
						name="taskName"
						className="w-64"
						type="text"
						placeholder="task name"
						minLength={1}
					/>
					<i data-feather="align-center"></i>
				</label>
			</form>
		</div>
	);
}
