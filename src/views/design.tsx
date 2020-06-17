import React, { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Trello } from "react-feather";
import { Link } from "react-router-dom";

import { Button } from "../reusable-ui/Button";
import { NavigationBar } from "../reusable-ui/NavigationBar";
import { TaskCard, UpdateFunction } from "../reusable-ui/TaskCard";
import { GroupOfTasks, Task } from "../types";
import { TaskGroup } from "../views/tasks-lists/components/TaskGroup";
import { TaskComponent } from "./tasks-lists/components/TaskComponent";

export const DesignLook = () => {
	const [tasks, setTasks] = useState<Task[]>([task, task2]);

	const updateLocal: UpdateFunction = useCallback(
		(id: string, descr: string) => {
			console.log("desc updated");
			setTasks(
				tasks
					.filter((t) => t.frontEndId !== id)
					.concat([
						{
							...tasks.filter((t) => t.frontEndId === id)[0],
							description: descr,
						},
					])
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);
	const updateLocalName: UpdateFunction = useCallback(
		(id: string, name: string) => {
			console.log("name updated");
			setTasks(
				tasks
					.filter((t) => t.frontEndId !== id)
					.concat([
						{
							...tasks.filter((t) => t.frontEndId === id)[0],
							name: name,
						},
					])
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);
	useEffect(() => {}, []);

	return (
		<div className="flex flex-row w-screen">
			<NavigationBar>
				<Link
					className="bg-gray-400 text-lg w-16 text-blue-600 rounded-full p-2 hover:text-blue-400 stroke-2 stroke-current mt-2"
					to="./app"
				>
					<svg
						className="h-12 w-12 bg-gray-400 rounded-full p-2"
						viewBox="0 0 24 24"
					>
						{<Trello />}
					</svg>
				</Link>
			</NavigationBar>
			<div className="flex justify-center w-screen">
				<div className="flex p-10 bg-gray-100 justify-center w-3/4">
					<div className="flex flex-col justify-center task-column p-4 space-y-4">
						{tasks
							.sort((x, y) => x.ordinalNumber - y.ordinalNumber)
							.map((t) => (
								<TaskCard
									task={t}
									updateDescription={updateLocal}
									hideTaskCard={() => {}}
									updateName={updateLocalName}
								/>
							))}
						<TaskGroup group={group}>
							{tasks
								.sort((x, y) => x.ordinalNumber - y.ordinalNumber)
								.map((task) => (
									<TaskComponent
										task={task}
										updateDescription={updateLocal}
										updateName={updateLocalName}
									>
										<article
											id={task.frontEndId}
											className="flex flex-col bg-gray-100 p-2 task-column object-center"
											draggable="true"
											onDragStart={(event) => {
												event.dataTransfer.setData(
													"text/plain",
													task.frontEndId
												);
											}}
											onDrop={(event) => {}}
										>
											<div className="flex flex-row align-middle items-center justify-between px-1">
												<p className="w-54 overflow-x-hidden">
													{task.name}
												</p>
												<button className="on-task-btn">
													<Trash2 />
												</button>
											</div>
										</article>
									</TaskComponent>
								))}
						</TaskGroup>
						<div className="flex flex-row justify-center p-4">
							<Button icon={<Plus />} onClick={() => {}}></Button>{" "}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const task: Task = {
	name: "name of task",
	status: "todo",
	frontEndId: "1",
	dependencyId: [],
	isReady: true,
	userId: "userId",
	ordinalNumber: 2,
	dependOnThisTask: [],
	description: "description of the task",
};

const task2: Task = {
	name: "really long name of task that could be shorter",
	status: "todo",
	frontEndId: "2",
	dependencyId: [],
	isReady: false,
	userId: "userId",
	ordinalNumber: 1,
	dependOnThisTask: [],
};

const group: GroupOfTasks = {
	groupId: "1",
	groupName: "Sample group",
	TasksIds: ["1", "2"],
	ordinalNumber: 1,
	userId: "github|45352717",
	status: "to-do",
};
