import React from "react";

import { generateId } from "../../../api/generateId";
export function TaskForm({
	onSubmit,
}: {
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
	generateId();

	return (
		<div className="opacity-75 rounded-r-lg p-3 bg-gray-500  ml-1 h-16 border-gray-900 flex flex-row flex-no-wrap fixed">
			<form onSubmit={onSubmit}>
				<label className="h-14 text-lg w-full">
					<input
						// eslint-disable-next-line jsx-a11y/no-autofocus
						autoFocus
						name="taskName"
						className="w-64"
						type="text"
						placeholder="task name"
						minLength={1}
					/>
					<i data-feather="align-center"></i>
				</label>
			</form>
		</div>
	);
}
