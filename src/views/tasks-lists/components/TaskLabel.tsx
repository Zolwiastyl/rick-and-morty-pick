import React, { ComponentProps, FunctionComponent, useState } from "react";
import { ChevronsDown, ChevronsUp } from "react-feather";

import { TaskCard, UpdateFunction } from "../../../reusable-ui/TaskCard";
import { Task } from "../../../types";

interface TaskLabelProps extends ComponentProps<"div"> {
	task: Task;
	children: React.ReactNode;
	updateDescription: UpdateFunction;
	updateName: UpdateFunction;
}

export const TaskLabel: FunctionComponent<TaskLabelProps> = ({
	children,
	task,
	updateDescription,
	updateName,
	...props
}) => {
	const [showTaskCard, toggleTaskCard] = useState<boolean>(false);
	const hideCard = () => toggleTaskCard(false);
	return (
		<div
			className="bg-gray-100 flex flex-col p-2 cursor-move align-middle"
			{...props}
		>
			<div className="flex flex-row content-around items-center">
				{children}
				<button
					data-testid={task.frontEndId + "-toggle"}
					className="on-task-btn"
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
