import React from "react";
import { NavigationBar } from "../reusable-ui/NavigationBar";
import { TaskCard } from "../reusable-ui/TaskCard";
import { Task } from "../types";
import { Link } from "react-router-dom";
import { renderIcon } from "../api/api";
import { Trello } from "react-feather";

export const DesignLook = () => {
	return (
		<div className="flex flex-row w-screen">
			<NavigationBar>
				<TaskCard task={task} />
				<Link
					className="bg-gray-400 text-lg w-16 text-blue-600 rounded-full p-2 hover:text-blue-400 stroke-2 stroke-current mt-2"
					to="./"
				>
					<svg
						className="h-12 w-12 bg-gray-400 rounded-full p-2"
						viewBox="0 0 24 24"
					>
						{renderIcon(Trello)}
					</svg>
				</Link>
			</NavigationBar>
			second route
		</div>
	);
};

const task: Partial<Task> = {
	name: "name of task",
};
