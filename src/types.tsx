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
	description?: string | null;
};

export type TasksStateProps = {
	tasks: Array<Task>;
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

export type Status = {
	statusName: string;
	icon: React.ComponentClass<{}, any> | React.FunctionComponent<{}>;
};

export type GroupOfTasks = {
	groupId: String;
	groupName: String;
	ordinalNumber: Number;
	TasksIds: TaskId[];
	userId: string;
	status: string;
};
