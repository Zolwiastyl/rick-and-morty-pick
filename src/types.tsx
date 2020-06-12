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
	icon: React.ComponentClass<{}, any> | React.FunctionComponent<{}>;
};

interface GroupTask extends Task {
	Task: Task[];
}
