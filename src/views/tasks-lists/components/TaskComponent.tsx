import React, { FunctionComponent, useRef, useState } from "react";
import { ChevronsDown, ChevronsUp } from "react-feather";

import { TaskCard, UpdateFunction } from "../../../reusable-ui/TaskCard";
import { Task } from "../../../types";

type TaskComponentProps = {
	task: Task;
	children: React.ReactNode;
	updateDescription: UpdateFunction;
	updateName: UpdateFunction;
};

export const TaskComponent: FunctionComponent<TaskComponentProps> = ({
	children,
	task,
	updateDescription,
	updateName,
}) => {
	const [showTaskCard, toggleTaskCard] = useState<boolean>(false);
	const hideCard = () => toggleTaskCard(false);
	return (
		<div className="bg-gray-100 flex flex-col p-1 m-1 cursor-move align-middle min-w-full">
			<div className="flex flex-row w-10/12 content-around items-center">
				{children}
				<button
					className="focus:outline-none on-task-btn"
					onClick={() => toggleTaskCard(!showTaskCard)}
				>
					{showTaskCard ? (
						<ChevronsUp />
					) : (
						<ChevronsDown className="on-task-btn" />
					)}
				</button>
			</div>

			{showTaskCard ? (
				<TaskCard
					updateName={updateName}
					hideTaskCard={hideCard}
					task={task}
					updateDescription={updateDescription}
				/>
			) : null}
		</div>
	);
};
