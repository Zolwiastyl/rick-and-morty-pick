import { Dispatch, SetStateAction } from "react";

export type Task = {
  name: string;
  status: string;
  frontEndId: string;
  dependencyId: string[];
  isReady: boolean;
  userId: string;
  ordinalNumber: number;
  dependOnThisTask: string[];
};

export type TasksStateProps = {
  tasks: Array<Task>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};
