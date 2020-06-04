import React, { FunctionComponent, useState, ReactNode } from "react";
import { Task } from "../../../types";
import { TaskCard } from "../../../reusable-ui/TaskCard";

import { renderIcon } from "../../../api/api";
import { ChevronsDown } from "react-feather";

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
	return (
		<div className="bg-gray-100 flex flex-col p-1 m-1 cursor-move">
			<div className="flex flex-row w-10/12">
				{children}
				<button
					className="bg-gray-100"
					onClick={() => toggleTaskCard(!showTaskCard)}
				>
					{renderIcon(ChevronsDown)}
				</button>
			</div>

			{showTaskCard ? (
				<TaskCard task={task} updateDescription={addDescription} />
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
