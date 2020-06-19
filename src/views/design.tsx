import React, { useEffect, useState } from "react";
import { Plus, Trello } from "react-feather";
import { Link } from "react-router-dom";

import { IconButton } from "../reusable-ui/IconButton";
import { NavigationBar } from "../reusable-ui/NavigationBar";
import { TaskCard, UpdateFunction } from "../reusable-ui/TaskCard";
import { Task } from "../types";

export const DesignLook = () => {
	const [task1, setTasks] = useState<Task>(task);

	const updateLocal: UpdateFunction = (id: string, descr: string) => {
		console.log("desc updated");
		setTasks({ ...task1, description: descr });
	};
	useEffect(() => {}, []);

	return (
		<div className="flex flex-row w-screen">
			<NavigationBar>
				<Link
					className="bg-gray-400 text-lg w-16 text-primary-600 rounded-full p-2 hover:text-primary-400 stroke-2 stroke-current mt-2"
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
				<div className="flex p-10 bg-gray-100 justify-center">
					<div className="flex flex-col p-2">
						<TaskCard
							task={task1}
							updateDescription={updateLocal}
							hideTaskCard={() => {}}
							updateName={() => {}}
						/>
						<TaskCard
							task={task2}
							updateDescription={() => {}}
							updateName={() => {
								setTasks({ ...task });
							}}
							hideTaskCard={() => {}}
						/>
						<div className="flex flex-row justify-center p-4">
							<IconButton icon={Plus} onClick={() => {}}></IconButton>{" "}
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
	ordinalNumber: 1,
	dependOnThisTask: [],
	description: "description of the task",
};

const task2: Task = {
	name: "really long name of task that could be shorter",
	status: "todo",
	frontEndId: "1",
	dependencyId: [],
	isReady: false,
	userId: "userId",
	ordinalNumber: 1,
	dependOnThisTask: [],
};
