import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
} from "react";
import {
	Activity,
	AlertTriangle,
	CheckCircle,
	Clock,
	Layers,
} from "react-feather";

import { curriedMoveToAnotherGroup } from "../../api/moveToAnotherGroup";
import { curriedSendNewTask } from "../../api/sendNewTask";
import { ClientContext } from "../../components/ClientContext";
import { Status, Task, TaskId } from "../../types";
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
};

const statuses: Array<Status> = [
	{ statusName: "todo", icon: Layers },
	{ statusName: "working-on-it", icon: Activity },
	{ statusName: "waiting", icon: Clock },
	{ statusName: "stuck", icon: AlertTriangle },
	{ statusName: "done", icon: CheckCircle },
];

export function TasksLists({ tasks, setTasks }: TasksListsProps) {
	const clientAPI = useContext(ClientContext);
	const updateDescription = useCallback(
		(taskId: TaskId, description: string) => {
			const taskToSave: Task = {
				...(tasks.find((t) => t.frontEndId === taskId) as Task),
				description: description,
			};

			const addTaskToDatabase = clientAPI?.sendTask(taskToSave);
			if (addTaskToDatabase) {
				setTasks(
					tasks.filter((t) => t.frontEndId !== taskId).concat([taskToSave])
				);
			} else {
				console.error("couldn't send task");
			}
		},
		[tasks, clientAPI, setTasks]
	);
	const updateName = useCallback(
		(taskId: TaskId, name: string) => {
			const taskToSave: Task = {
				...(tasks.find((t) => t.frontEndId === taskId) as Task),
				name: name,
			};

			const addTaskToDatabase = clientAPI?.sendTask(taskToSave);
			if (addTaskToDatabase) {
				setTasks(
					tasks.filter((t) => t.frontEndId !== taskId).concat([taskToSave])
				);
			} else {
				console.error("couldn't send task");
			}
		},
		[tasks, clientAPI, setTasks]
	);
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
							clientAPI.callApi(curriedSendNewTask({ ...taskToSave }));
							setTasks(
								tasks
									.filter((t) => t.frontEndId !== taskId)
									.concat([taskToSave])
							);
						} else {
							return clientAPI.callApi(
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
											clientAPI,
											status
										);
									}}
								>
									<p className="p-1 flex-1">{task.name}</p>
									{DeleteButton(task, { tasks, setTasks })}
								</TaskLabel>
							);
						})}
				</TaskList>
			))}
		</div>
	);
}
