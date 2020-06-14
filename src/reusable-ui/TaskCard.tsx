import React, {
	ChangeEvent,
	ComponentProps,
	FunctionComponent,
	useRef,
	useState,
} from "react";
import { Edit2 } from "react-feather";
import { Textarea } from "theme-ui";

import { Task } from "../types";
import { Button } from "./Button";

const TaskCardContainer = (props: ComponentProps<"div">) => (
	<div
		className="bg-gray-300 rounded-lg max-w-6xl w-full text-lg h-64 p-3 mt-2"
		{...props}
	/>
);

interface TaskReadyIndicatorProps {
	isReady: boolean;
}
const TaskReadyIndicator = ({ isReady }: TaskReadyIndicatorProps) => {
	const color = isReady ? "bg-green-600" : "bg-red-600";
	return (
		<div className={`rounded-full m-1 w-4 h-4 self-center p-3 ${color}`} />
	);
};

export type UpdateFunction = (taskId: string, description: string) => void;

type TaskCardProps = {
	task: Task;
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
	const [isEditing, setEditing] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [descriptionState, setDescription] = useState(
		task.description ? task.description : ""
	);
	const [nameState, setName] = useState<string>(task.name!);

	const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};
	const handleDescriptionChange = (
		event: ChangeEvent<HTMLTextAreaElement>
	) => {
		setDescription(event.target.value);
	};
	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLElement>,
		type: string
	) => {
		const { key } = event;
		if (
			type === "textarea"
				? key === "Escape"
				: ["Escape", "Enter"].includes(key)
		) {
			setEditing(false);
		}
	};

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	return (
		<TaskCardContainer
			onBlur={(evt) => {
				console.log("blured");
				evt.preventDefault();
				//updateName(task.frontEndId!, nameState);
				//updateDescription(task.frontEndId!, descriptionState);
			}}
		>
			<header className="flex flex-row mt-1 justify-center border-b border-gray-900 py-1">
				<div className="self-start text-xl mr-5 overflow-auto h-full w-full">
					<div>
						{isEditing ? (
							<input
								// eslint-disable-next-line jsx-a11y/no-autofocus
								ref={inputRef}
								type="text"
								placeholder={nameState}
								value={nameState}
								onChange={handleNameChange}
								onKeyDown={(e) => handleKeyDown(e, "input")}
								onBlur={() => {
									console.log("blurred");
									return task.name !== nameState
										? updateName(task.frontEndId, nameState)
										: undefined;
								}}
							/>
						) : (
							<div>
								<button onClick={() => setEditing(true)}>
									{task.name}
									<Edit2 className=" h-4 w-4" />
								</button>
								<Button
									onClick={() => setEditing(true)}
									icon={<Edit2 />}
								/>
								<span>{task.name || "Editable content"}</span>
							</div>
						)}
					</div>
				</div>
				<TaskReadyIndicator isReady={task.isReady} />
			</header>
			<div>
				{isEditing ? (
					<textarea
						// eslint-disable-next-line jsx-a11y/no-autofocus
						onKeyDown={(e) => handleKeyDown(e, "textarea")}
						className="w-full h-full bg-gray-200 text-base p-3 mt-1"
						ref={textareaRef}
						value={descriptionState}
						onChange={handleDescriptionChange}
						onBlur={(evt) =>
							task.description !== descriptionState
								? updateDescription(task.frontEndId, descriptionState)
								: undefined
						}
					/>
				) : (
					<div>
						<span>{task.description || "Editable content"}</span>
						<Button
							onClick={() => {
								textareaRef.current?.blur();
								setEditing(true);
							}}
							icon={<Edit2 />}
						/>
					</div>
				)}
			</div>
		</TaskCardContainer>
	);
};
