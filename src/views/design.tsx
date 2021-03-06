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
		setTasks({ ...task1, description: descr });
	};
	useEffect(() => {}, []);

	return (
		<div className="flex md:flex-row flex-col w-screen">
			<NavigationBar>
				<Link className="nav-bar-btn" to="./app">
					<Trello
						className="h-12 w-12 p-2"
						size="24px"
						aria-label={Trello.displayName}
					/>
				</Link>
			</NavigationBar>
			<div className="flex justify-center w-full">
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
							<IconButton Icon={Plus} onClick={() => {}}></IconButton>{" "}
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
