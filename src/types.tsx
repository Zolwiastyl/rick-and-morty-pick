import { Icon } from "react-feather";

export type TaskId = string;

export type Task = {
	name: string;
	status: string;
	frontEndId: TaskId;
	dependencyId: TaskId[];
	isReady: boolean;
	userId: string;
	ordinalNumber: number;
	dependOnThisTask: string[];
	description?: string;
};

export type TasksStateProps = {
	tasks: Array<Task>;
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

export type Status = {
	statusName: string;
	icon: Icon;
};

interface GroupTask extends Task {
	Task: Task[];
}

export type Source = Task;
export type Target = Task;
export type Edge = [Source, Target];
