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
export type GroupStateProps = {
	groups: Array<GroupOfTasks>;
	setGroups: React.Dispatch<React.SetStateAction<GroupOfTasks[]>>;
};

export type Status = {
	statusName: string;
	icon: React.ComponentClass<{}, any> | React.FunctionComponent<{}>;
};

export type GroupOfTasks = {
	groupId: string;
	groupName: string;
	ordinalNumber: number;
	TasksIds: TaskId[];
	userId: string;
	status: string;
};
