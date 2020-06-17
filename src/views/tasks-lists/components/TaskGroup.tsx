import React, { FC, useState } from "react";
import { ChevronsDown, ChevronsUp } from "react-feather";

import { GroupOfTasks } from "./../../../types";

interface TaskGroupProps extends React.ComponentProps<"div"> {
	group: GroupOfTasks;
}

export const TaskGroup: FC<TaskGroupProps> = ({
	group,
	children,
	...rest
}: TaskGroupProps) => {
	const [showGroup, toggleGroup] = useState<boolean>(true);
	const [isDropSpotVisible, toggleDropSpot] = useState<boolean>(false);
	const showDropSpot = () => toggleDropSpot(true);
	const hideDropSpot = () => toggleDropSpot(false);

	return (
		<div
			className="bg-gray-300 p-1 task-column space-x-1 space-y-2"
			draggable="true"
			onDragOver={(evt) => {
				evt.preventDefault();

				showDropSpot();
			}}
			onDrop={(evt) => {
				console.log("dropped on group label");
				evt.preventDefault();
				hideDropSpot();
			}}
		>
			<div
				className="flex flex-row align-middle items-center justify-between px-1"
				onDrop={(evt) => {
					console.log("dropped on some div");

					hideDropSpot();
				}}
			>
				<header>{group.groupName}</header>
				<button
					className="on-task-btn"
					onClick={() => toggleGroup(!showGroup)}
				>
					{showGroup ? <ChevronsUp /> : <ChevronsDown />}
				</button>
			</div>
			{isDropSpotVisible ? (
				<div
					onDrop={(evt) => {
						console.log("dropped on dropspot");
						evt.preventDefault();
						hideDropSpot();
					}}
					className="font-extrabold text-lg h-20 bg-green-600"
				>
					DROP SPOT
				</div>
			) : null}
			{showGroup ? children : null}
		</div>
	);
};

type DragSpotProps = {
	onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
};
