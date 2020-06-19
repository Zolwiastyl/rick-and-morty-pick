import React, { useCallback, useEffect, useState } from "react";
import { Fragment } from "react";
import {
	ChevronsDown,
	ChevronsLeft,
	ChevronsRight,
	ChevronsUp,
	GitMerge,
	Image,
	List,
	RefreshCcw,
	Trash2,
} from "react-feather";
import { Link, Route, Router, Switch } from "react-router-dom";

import {
	makeNewTasksRemovingDependencies,
	makeNewTasksWithDependencies,
	sendSourceAndTargetTasks,
} from "./api/addDependencies";
import { callApi, fetchDataFromServer, removeAllData } from "./api/api";
import { generateIdForTask } from "./api/generateIdForTask";
import { curriedSendNewTask, sendNewTask } from "./api/sendNewTask";
import { Auth0NavBar } from "./components/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import { IconButton } from "./reusable-ui/IconButton";
import { NavigationBar } from "./reusable-ui/NavigationBar";
import { Task, TaskId } from "./types";
import history from "./utils/history";
import { TasksGraph } from "./views/tasks-graph/BruteGraph";
import { TasksLists } from "./views/tasks-lists/TasksLists";

const tasksArray: Array<Task> = [];

export function App() {
	// secondary boring state
	const { loading, client, user } = useAuth0();

	// ui state -- this can be replaced with url match or sth like that / router
	const [showGraph, toggleGraph] = useState<boolean>(false);

	// core domain state
	const [tasks, setTasks] = useState<Task[]>(tasksArray);
	const [showNewTaskForm, toggleNewTaskForm] = useState<boolean>(false);

	const callApiToSendTask = useCallback(
		async (task: Task) => {
			try {
				const token = await client?.getTokenSilently();
				const response = async () => await sendNewTask(task, token);
				response();
			} catch (error) {
				console.error(error);
			}
		},
		[client]
	);

	const updateDescription = useCallback(
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
		[tasks, callApiToSendTask]
	);
	const updateName = useCallback(
		(taskId: TaskId, name: string) => {
			const taskToSave: Task = {
				...(tasks.find((t) => t.frontEndId === taskId) as Task),
				name: name,
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
		[tasks, callApiToSendTask]
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
		[tasks, client]
	);

	const callApiToFetchData = useCallback(
		async (setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
			if (!client) {
				throw Error("no client from auth0");
			}
			const token = await client.getTokenSilently();
			await fetchDataFromServer(setTasks, token);
		},
		[client]
	);

	useEffect(() => {
		if (client) {
			callApiToFetchData(setTasks);
		}
	}, [loading, user, client, callApiToFetchData]);

	const onSubmit: (
		event: React.FormEvent<HTMLFormElement>
	) => Promise<void> = async (event) => {
		event.preventDefault();
		const { name } = readFormValues(event.currentTarget);
		event.currentTarget.reset();
		const ArrayWithTasksToSave = tasks.slice();
		function generateOrdinalForNewTask(tasks: Task[]) {
			const tasksToDo = tasks.filter((t) => t.status === "todo");
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
		return <div>///loading</div>;
	}

	return (
		<Fragment>
			<div className="md:flex md:flex-row w-full max-w-screen flex flex-col lg:overflow-hidden h-screen max-h-screen">
				<NavigationBar>
					<div className="flex flex-col md:flex md:flex-row md:fixed opacity-75 md:z-10 z-10 relative ">
						<div className="hidden md:block ">
							<IconButton
								onClick={() => toggleNewTaskForm(!showNewTaskForm)}
								icon={showNewTaskForm ? ChevronsLeft : ChevronsRight}
							/>
						</div>
						<div className="block md:hidden">
							<IconButton
								onClick={() => toggleNewTaskForm(!showNewTaskForm)}
								icon={showNewTaskForm ? ChevronsUp : ChevronsDown}
							/>
						</div>
						<div>
							{showNewTaskForm ? <TaskForm onSubmit={onSubmit} /> : null}
						</div>
					</div>
					<div className="md:h-20 h-10"></div>
					<IconButton
						onClick={(evt) => {
							callApiToFetchData(setTasks);
						}}
						icon={RefreshCcw}
					/>
					<IconButton
						onClick={(evt) => {
							toggleGraph(true);
						}}
						icon={GitMerge}
					/>
					<IconButton
						onClick={(evt) => {
							toggleGraph(false);
						}}
						icon={List}
					/>
					<IconButton
						icon={Trash2}
						onClick={(evt) => {
							removeAllData();
						}}
					/>

					<Link className="nav-bar-btn" to="./design">
						<Image className="h-12 w-12 p-2" viewBox="0 0 24 24" />
					</Link>
					<div className="flex-1" />
					<Auth0NavBar />
				</NavigationBar>
				<div className="w-full mr-2">
					<div className=" min-w-full max-w-full max-h-screen h-full">
						<Router history={history}>
							{!showGraph && (
								<TasksLists
									setTasks={setTasks}
									tasks={tasks}
									updateDescription={updateDescription}
									updateName={updateName}
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
		<div className="opacity-75 rounded-r-lg p-3 bg-gray-500  ml-1 h-16 border-gray-900 flex flex-row flex-no-wrap fixed">
			<form onSubmit={onSubmit}>
				<label className="h-14 text-lg w-full">
					<input
						// eslint-disable-next-line jsx-a11y/no-autofocus
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
