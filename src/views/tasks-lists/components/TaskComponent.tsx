import React, { FunctionComponent, useState, ReactNode, useRef } from "react";
import { Task } from "../../../types";
import { TaskCard } from "../../../reusable-ui/TaskCard";

import { renderIcon } from "../../../api/api";
import { ChevronsDown, ChevronsUp, ChevronDown } from "react-feather";

type TaskComponentProps = {
	task: Task;
	children: React.ReactNode;
	addDescription: (taskId: string, description: string) => void;
};

export const TaskComponent: FunctionComponent<TaskComponentProps> = ({
	children,
	task,
	addDescription,
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
					hideTaskCard={hideCard}
					task={task}
					updateDescription={addDescription}
				/>
			) : null}
		</div>
	);
};

/**	<Autocomplete
											className="add-dependency-box"
											id={task.frontEndId}
											options={tasks}
											getOptionLabel={(option: Task) => option.name}
											onChange={(
												event: ChangeEvent<{}>,
												value: Task | null
											) => {
												sendSourceAndTargetTasks(
													client,
													curriedSendNewTask,
													makeNewTasksWithDependencies(tasks, [
														value!.frontEndId,
														task.frontEndId,
													])
												);
											}}
											renderInput={(params) => (
												<TextField
													{...params}
													label="add dependency"
													variant="outlined"
												/>
											)}
										/> */
