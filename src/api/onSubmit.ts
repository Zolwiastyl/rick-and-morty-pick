import { AuthContextValue } from "../react-auth0-spa";
import { Task, TasksStateProps } from "../types";
import { callApi } from "./api";
import { generateId } from "./generateId";
import { curriedSendNewTask } from "./sendNewTask";

export const onSubmit: (
	event: React.FormEvent<HTMLFormElement>,
	{ tasks, setTasks, ...rest }: TasksStateProps,
	{ user, client }: Partial<AuthContextValue>
) => Promise<void> = async (event, { tasks, setTasks }, { user, client }) => {
	event.preventDefault();
	const { name } = readFormValues(event.currentTarget);
	event.currentTarget.reset();

	const ArrayWithTasksToSave = tasks.slice();
	function generateOrdinalForNewTask(tasks: Task[]) {
		const tasksToDo = tasks.filter((t) => t.status === "todo");
		if (tasksToDo.length === 0) {
			return 2.1;
		} else {
			return tasksToDo.sort((x, y) => x.ordinalNumber - y.ordinalNumber)[0]
				.ordinalNumber;
		}
	}
	const newOrdinal = (0 + generateOrdinalForNewTask(tasks)) / 2;

	const newTask: Task = {
		name: name,
		status: "todo",
		frontEndId: generateId(),
		dependencyId: [],
		isReady: false,
		userId: user.sub,
		ordinalNumber: newOrdinal,
		dependOnThisTask: [],
	};
	ArrayWithTasksToSave.unshift(newTask);
	setTasks(ArrayWithTasksToSave);
	if (!(await callApi(client, curriedSendNewTask(newTask)))) {
		setTasks(tasks.filter((t) => t.frontEndId !== newTask.frontEndId));
		console.log("couldn't send task");
	} else {
		console.log("sent task");
	}
};

function readFormValues(form: HTMLFormElement) {
	const { taskName } = (form.elements as any) as Record<
		string,
		HTMLInputElement | undefined
	>;
	if (!taskName) {
		throw new Error("something is missing");
	}
	return { name: taskName.value };
}
