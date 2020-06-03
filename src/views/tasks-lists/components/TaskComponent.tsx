import React, { FunctionComponent, useState, ReactNode } from "react";
import { Task } from "../../../types";
import { TaskCard } from "../../../reusable-ui/TaskCard";

type TaskComponentProps = {
	task: Task;
	children: React.ReactNode;
};

export const TaskComponent: FunctionComponent<TaskComponentProps> = ({
	children,
	task,
}) => {
	const [showTaskCard, toggleTaskCard] = useState<boolean>(false);
	console.log(task.frontEndId);
	return (
		<div
			onClick={() => {
				toggleTaskCard(!showTaskCard);
			}}
		>
			{children}
			{showTaskCard ? <TaskCard task={task} /> : null}
		</div>
	);
};
