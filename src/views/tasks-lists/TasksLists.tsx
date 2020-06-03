import React, { ChangeEvent } from "react";
import { Task, TasksStateProps, Status } from "../../types";

import { callApi, renderIcon } from "../../api/api";

import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

import {
	Layers,
	AlertTriangle,
	CheckCircle,
	Clock,
	Activity,
} from "react-feather";
import { useAuth0 } from "../../react-auth0-spa";
import { curriedMoveToAnotherGroup } from "../../api/moveToAnotherGroup";
import { DeleteButton } from "./components/DeleteButton";
import { handleDrop } from "./dragAndDrop";
import {
	sendSourceAndTargetTasks,
	makeNewTasksWithDependencies,
} from "../../api/addDependencies";
import { curriedSendNewTask } from "../../api/sendNewTask";

interface TaskButtonProps {
	onClick: () => void;
	children: React.ReactNode;
}
function TaskButton({ children, onClick }: TaskButtonProps) {
	return (
		<button className={`move-to-button`} onClick={onClick}>
			{children}
		</button>
	);
}

interface TaskListProps extends React.ComponentProps<"div"> {
	status: Status;
}
const TaskList: React.FC<TaskListProps> = ({
	status: { statusName, StatusIcon },
	children,
	...rest
}) => {
	return (
		<div
			className="bg-gray-200 h-screen ml-4 hover:bg-gray-100 w-1/5 rounded-lg"
			{...rest}
		>
			<header className="flex flex-col bg-blue-100">
				<svg viewBox="0 0 24 24" className=" h-12 p-2 max-h-sm">
					{renderIcon(StatusIcon)}
				</svg>
				<p className="self-center p-6">{statusName}</p>
			</header>

			{children}
		</div>
	);
};

const ButtonsGroup: React.FC = ({ children }) => {
	return <div className="buttons-group">move to: {children}</div>;
};

export function TasksLists({ tasks, setTasks }: TasksStateProps) {
	const statuses: Array<Status> = [
		{ statusName: "todo", StatusIcon: Layers },
		{ statusName: "working-on-it", StatusIcon: Activity },
		{ statusName: "waiting", StatusIcon: Clock },
		{ statusName: "stuck", StatusIcon: AlertTriangle },
		{ statusName: "done", StatusIcon: CheckCircle },
	];
	const { client } = useAuth0();

	const Dependencies = (task: Task) => {
		task.dependencyId?.map((id) => (
			<div>
				dependencies: {tasks.filter((t) => t.frontEndId === id)[0].name}
			</div>
		));
	};

	return (
		<div className="flex flex-row p-4 ml-4 mt-4">
			{statuses.map((status) => (
				<TaskList
					// useDrop.ref
					status={status}
					onDragOver={(event) => {
						event.preventDefault();
					}}
					onDrop={(event) => {
						event.preventDefault();
						console.log(
							tasks.filter((t) => t.status == status.statusName)
						);
						if (
							tasks.filter((t) => t.status == status.statusName)
								.length !== 0
						) {
							console.log("it's not empty empty");
							return;
						} else {
							console.log("it's empty");
							const taskId = event.dataTransfer.getData("text/plain");
							return callApi(
								client,
								curriedMoveToAnotherGroup({ tasks, setTasks })(
									status.statusName
								)(tasks.find((t) => t.frontEndId == taskId))
							);
						}
					}}
					onDragEnter={(event) => event.preventDefault()}
				>
					{tasks
						.sort((x, y) => x.ordinalNumber - y.ordinalNumber)
						.filter((task) => task.status == status.statusName)
						.map((task) => (
							<article
								id={task.frontEndId}
								className="flex flex-col bg-gray-100 m-2"
								draggable="true"
								onDragStart={(event) => {
									event.dataTransfer.setData(
										"text/plain",
										task.frontEndId
									);
								}}
								onDrop={(event) => {
									handleDrop(
										event,
										{ tasks, setTasks },
										client,
										status
									);
								}}
							>
								<div className="upper-part-of-task-element">
									<p className="task-name">
										{task.name}
										<br />
										<br /> here display if its ready:
										{task.isReady.toString()}
									</p>
									<ButtonsGroup>
										{statuses
											.filter(
												(currentStatus) =>
													currentStatus.statusName != task.status
											)
											.map((status) => (
												<TaskButton
													onClick={() => {
														callApi(
															client,
															curriedMoveToAnotherGroup({
																tasks,
																setTasks,
															})(status.statusName)(task)
														);
													}}
												>
													{renderIcon(status.StatusIcon)}
												</TaskButton>
											))}
										{DeleteButton(task, { tasks, setTasks }, client)}
									</ButtonsGroup>
								</div>
								<Autocomplete
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
								/>
							</article>
						))}
				</TaskList>
			))}
		</div>
	);
}
