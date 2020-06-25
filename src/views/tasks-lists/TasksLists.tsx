import { Auth0Client } from "@auth0/auth0-spa-js";
import React, { Dispatch, SetStateAction, useContext } from "react";
import {
	Activity,
	AlertTriangle,
	CheckCircle,
	Clock,
	Layers,
} from "react-feather";

import { callApi } from "../../api/api";
import { curriedMoveToAnotherGroup } from "../../api/moveToAnotherGroup";
import { curriedSendNewTask } from "../../api/sendNewTask";
import { UpdateFunction } from "../../reusable-ui/TaskCard";
import { ClientAPI, Status, Task } from "../../types";
import { DeleteButton } from "./components/DeleteButton";
import { TaskLabel } from "./components/TaskComponent";
import { handleDrop } from "./dragAndDrop";

interface TaskButtonProps {
	onClick: () => void;
	children: React.ReactNode;
}

interface TaskListProps extends React.ComponentProps<"div"> {
	status: Status;
}
const TaskList: React.FC<TaskListProps> = ({
	status: { statusName, icon: StatusIcon },
	children,
	...rest
}) => {
	return (
		<div
			className="bg-gray-100 max-h-screen h-full flex flex-col hover:bg-gray-200 lg:w-1/5 rounded-lg p-1"
			{...rest}
		>
			<header className="flex flex-row items-center justify-center w-full">
				<StatusIcon className="p-2 max-h-sm" size="2.5rem" />
				<p className="self-center p-4">{statusName}</p>
			</header>
			<div className=" overflow-y-auto max-h-full h-full w-full max-w-full flex flex-col space-y-1">
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
	client: Auth0Client | undefined;
	clientAPI: ClientAPI;
};

const statuses: Array<Status> = [
	{ statusName: "todo", icon: Layers },
	{ statusName: "working-on-it", icon: Activity },
	{ statusName: "waiting", icon: Clock },
	{ statusName: "stuck", icon: AlertTriangle },
	{ statusName: "done", icon: CheckCircle },
];

export function TasksLists({
	tasks,
	setTasks,
	updateDescription,
	updateName,
	client,
}: TasksListsProps) {
	return (
		<div className="flex flex-row p-4 w-auto max-h-full h-full space-x-2">
			{statuses.map((status) => (
				<TaskList
					// useDrop.ref
					key={status.statusName + "-column"}
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
								<TaskLabel
									key={task.frontEndId}
									task={task}
									updateDescription={updateDescription}
									updateName={updateName}
									id={task.frontEndId}
									data-testid={task.frontEndId}
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
									<p className="p-1 flex-1">{task.name}</p>
									{DeleteButton(task, { tasks, setTasks }, client)}
								</TaskLabel>
							);
						})}
				</TaskList>
			))}
		</div>
	);
}
