import { Dispatch, SetStateAction } from "react";

export type Task = {
  name: string;
  status: string;
};
export type TaskProps = {
  tasks: Array<Task>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};
