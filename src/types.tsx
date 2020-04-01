import { Dispatch, SetStateAction } from "react";

export type Task = {
  name: string;
  status: string;
  frontEndId: string;
  dependencyId?: string[];
  isReady: boolean;
  userId: string;
};

export type TasksStateProps = {
  tasks: Array<Task>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

export type DragAndDropProps = {
  drag: React.DragEvent<HTMLDivElement>;
  dragStart: React.DragEvent<HTMLDivElement>;
  dragEnd: React.DragEvent<HTMLDivElement>;
  dragOver: React.DragEvent<HTMLDivElement>;
  dragEnter: React.DragEvent<HTMLDivElement>;
  dragLeave: React.DragEvent<HTMLDivElement>;
  drop: React.DragEvent<HTMLDivElement>;
};
