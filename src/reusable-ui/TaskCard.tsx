import React, { FunctionComponent, ChangeEvent, useState, useRef } from "react";
import { Task } from "../types";
import { Upload } from "react-feather";
import { Button } from "./Button";
import { EditableText } from "./EditableText";

export type UpdateFunction = (taskId: string, description: string) => void;

type TaskCardProps = {
	task: Partial<Task>;
	updateDescription: UpdateFunction;
	updateName: UpdateFunction;
	hideTaskCard: () => void;
};

export const TaskCard: FunctionComponent<TaskCardProps> = ({
	task,
	updateDescription,
	hideTaskCard,
	updateName,
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [descriptionState, setDescription] = useState(
		task.description ? task.description : ""
	);
	const [nameState, setName] = useState<string>(task.name!);

	const handleTextareaChange = (
		event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setDescription(event.target.value);
	};
	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	return (
		<div
			className="bg-gray-300 rounded-lg max-w-6xl w-full text-lg h-64 p-3 mt-2
	 x-"
		>
			<header className="flex flex-row mt-1 justify-center border-b border-gray-900 py-1">
				<div className="self-start text-xl  mr-5 overflow-auto h-full w-full">
					<EditableText
						type="input"
						text={task.name}
						placeholder="placeholder"
						childRef={inputRef}
					>
						<input
							autoFocus
							ref={inputRef}
							type="text"
							placeholder={nameState}
							value={nameState}
							onChange={handleInputChange}
							onBlur={(evt) => {
								evt.preventDefault();
								updateName(task.frontEndId!, nameState);
							}}
						/>
					</EditableText>
				</div>
				<div
					className={
						task.isReady
							? "rounded-full m-1 w-4 h-4 self-center p-3 bg-green-600"
							: "rounded-full m-1 w-4 h-4 self-center p-3 bg-red-600"
					}
				></div>
			</header>
			<div>
				<form
					onSubmit={(evt) => {
						evt.preventDefault();
						updateDescription(task.frontEndId!, descriptionState!);
						hideTaskCard();
					}}
				>
					<label>
						<textarea
							className="w-full h-full bg-gray-200 text-base p-3 mt-1"
							value={descriptionState}
							onChange={handleTextareaChange}
						></textarea>
						<div className="flex justify-center">
							<Button onClick={() => {}} icon={<Upload />} />
						</div>
					</label>
				</form>
				<div></div>
			</div>
		</div>
	);
};
