import React, { SetStateAction, Dispatch } from "react";
import { Task, Status } from "../../types";

import { callApi, renderIcon } from "../../api/api";

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
import { TaskComponent } from "./components/TaskComponent";
import { curriedSendNewTask } from "../../api/sendNewTask";
import { UpdateFunction } from "../../reusable-ui/TaskCard";

interface TaskButtonProps {
	onClick: () => void;
	children: React.ReactNode;
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
			className="bg-gray-300 max-h-screen h-full flex flex-col hover:bg-gray-200 lg:w-1/5 rounded-lg m-1"
			{...rest}
		>
			<header className="flex flex-col bg-blue-200 w-64">
				<svg viewBox="0 0 24 24" className=" h-12 p-2 max-h-sm">
					{renderIcon(StatusIcon)}
				</svg>
				<p className="self-center p-6">{statusName}</p>
			</header>
			<div className=" overflow-y-scroll max-h-full h-full w-full max-w-full flex flex-col">
				{children}
			</div>
		</div>
	);
};

type TasksListsProps = {
	tasks: Task[];
	setTasks: Dispatch<SetStateAction<Task[]>>;
	updateDescription: UpdateFunction;
	updateName: UpdateFunction;
};

export function TasksLists({
	tasks,
	setTasks,
	updateDescription,
	updateName,
}: TasksListsProps) {
	const statuses: Array<Status> = [
		{ statusName: "todo", StatusIcon: Layers },
		{ statusName: "working-on-it", StatusIcon: Activity },
		{ statusName: "waiting", StatusIcon: Clock },
		{ statusName: "stuck", StatusIcon: AlertTriangle },
		{ statusName: "done", StatusIcon: CheckCircle },
	];
	const { client } = useAuth0();

	return (
		<div className="flex flex-row mt-4 w-auto max-h-full h-full">
			{statuses.map((status) => (
				<TaskList
					// useDrop.ref
					status={status}
					onDragOver={(event) => {
						event.preventDefault();
					}}
					onDrop={(event) => {
						event.preventDefault();

						const taskId = event.dataTransfer.getData("text/plain");
						if (
							tasks.filter((t) => t.status === status.statusName)
								.length !== 0
						) {
							const taskInStatus: Task = tasks
								.filter((t) => t.status === status.statusName)
								.sort((x, y) => x.ordinalNumber - y.ordinalNumber)
								.slice(-1)[0];
							const taskToSave: Task = {
								...(tasks.find((t) => t.frontEndId === taskId) as Task),
								status: status.statusName,
								ordinalNumber: taskInStatus.ordinalNumber + 0.5,
							};

							callApi(
								client,
								curriedSendNewTask({
									...taskToSave,
								})
							);
							setTasks(
								tasks
									.filter((t) => t.frontEndId !== taskId)
									.concat([taskToSave])
							);
						} else {
							return callApi(
								client,
								curriedMoveToAnotherGroup({ tasks, setTasks })(
									status.statusName
								)(tasks.find((t) => t.frontEndId === taskId))
							);
						}
					}}
					onDragEnter={(event) => event.preventDefault()}
				>
					{tasks
						.sort((x, y) => x.ordinalNumber - y.ordinalNumber)
						.filter((task) => task.status === status.statusName)
						.map((task) => {
							return (
								<TaskComponent
									task={task}
									updateDescription={updateDescription}
									updateName={updateName}
								>
									<article
										id={task.frontEndId}
										className="flex flex-col bg-gray-100 m-2 max-h-full h-14 w-11/12 max-w-full min-w-full object-center"
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
										<div className="flex flex-row align-middle justify-between px-1">
											<p className="w-40">{task.name}</p>
											<div>
												{DeleteButton(
													task,
													{ tasks, setTasks },
													client
												)}
											</div>
										</div>
									</article>
								</TaskComponent>
							);
						})}
				</TaskList>
			))}
		</div>
	);
}
