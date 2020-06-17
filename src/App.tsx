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
import {
	fetchGroupsFromServer,
	fetchTasksFromServer,
	removeAllData,
} from "./api/api";
import { onSubmit } from "./api/onSubmit";
import { curriedSendNewTask, sendNewTask } from "./api/sendNewTask";
import { Auth0NavBar } from "./components/NavBar";
import { PrivateRoute } from "./components/PrivateRoute";
import { Profile } from "./components/Profile";
import { useAuth0 } from "./react-auth0-spa";
import { Button } from "./reusable-ui/Button";
import { NavigationBar } from "./reusable-ui/NavigationBar";
import { GroupOfTasks, Task, TaskId } from "./types";
import history from "./utils/history";
import { TasksGraph } from "./views/tasks-graph/BruteGraph";
import { TaskForm } from "./views/tasks-lists/components/TaskFrom";
import { TasksLists } from "./views/tasks-lists/TasksLists";

const tasksArray: Array<Task> = [];
const groupsArray: Array<GroupOfTasks> = [];
export function App() {
	// secondary boring state
	const { loading, client, user } = useAuth0();

	// ui state -- this can be replaced with url match or sth like that / router
	const [showGraph, toggleGraph] = useState<boolean>(false);

	// core domain state
	const [tasks, setTasks] = useState<Task[]>(tasksArray);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [groups, setGroups] = useState<GroupOfTasks[]>(groupsArray);
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
		async (
			setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
			setGroups: React.Dispatch<React.SetStateAction<GroupOfTasks[]>>
		) => {
			if (!client) {
				throw Error("no client from auth0");
			}
			const token = await client.getTokenSilently();
			await fetchGroupsFromServer({ setState: setGroups, token: token });
			await fetchTasksFromServer({ setState: setTasks, token: token });
		},
		[client]
	);

	useEffect(() => {
		if (client) {
			callApiToFetchData(setTasks, setGroups);
		}
	}, [callApiToFetchData, client]);
	if (loading) {
		return <div>///loading</div>;
	}

	return (
		<Fragment>
			<div className="md:flex md:flex-row w-full max-w-screen flex flex-col lg:overflow-hidden h-screen max-h-screen">
				<NavigationBar>
					<div className="flex flex-col md:flex md:flex-row md:w-2/5 md:fixed opacity-75 md:z-10 z-10">
						<div className="hidden md:block">
							<Button
								onClick={() => toggleNewTaskForm(!showNewTaskForm)}
								icon={
									showNewTaskForm ? (
										<ChevronsLeft />
									) : (
										<ChevronsRight />
									)
								}
							/>
						</div>
						<div className="block md:hidden">
							<Button
								onClick={() => toggleNewTaskForm(!showNewTaskForm)}
								icon={
									showNewTaskForm ? <ChevronsUp /> : <ChevronsDown />
								}
							/>
						</div>
						<div>
							{showNewTaskForm ? (
								<TaskForm
									onSubmit={(evt) =>
										onSubmit(
											evt,
											{ tasks, setTasks },
											{ user, client }
										)
									}
								/>
							) : null}
						</div>
					</div>
					<div className="md:h-20 h-10"></div>
					<Button
						onClick={(evt) => {
							callApiToFetchData(setTasks, setGroups);
						}}
						icon={<RefreshCcw />}
					/>
					<Button
						onClick={(evt) => {
							toggleGraph(true);
						}}
						icon={<GitMerge />}
					/>
					<Button
						onClick={(evt) => {
							toggleGraph(false);
						}}
						icon={<List />}
					/>
					<Button
						icon={<Trash2 />}
						onClick={(evt) => {
							removeAllData();
						}}
					/>

					<Router history={history}>
						<PrivateRoute path="/profile" component={Profile} />
						<Auth0NavBar />
					</Router>

					<Link
						className="bg-gray-400 text-lg w-16 
						text-blue-700 rounded-full 
						p-2 hover:text-blue-400 stroke-2
						stroke-current mt-2 mr-2"
						to="./design"
					>
						<svg
							className="h-12 w-12 bg-gray-400 p-2"
							viewBox="0 0 24 24"
						>
							{<Image />}
						</svg>
					</Link>
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
