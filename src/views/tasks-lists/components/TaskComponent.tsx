import React, { FunctionComponent, useState } from "react";
import { Task } from "../../../types";
import { TaskCard, UpdateFunction } from "../../../reusable-ui/TaskCard";
import { ChevronsDown, ChevronsUp } from "react-feather";

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
		<div className="bg-gray-100 flex flex-col p-1 m-1 cursor-move align-middle">
			<div className="flex flex-row w-10/12 content-around">
				{children}
				<button
					className="bg-gray-100 focus:outline-none"
					onClick={() => toggleTaskCard(!showTaskCard)}
				>
					{showTaskCard ? <ChevronsUp /> : <ChevronsDown />}
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
