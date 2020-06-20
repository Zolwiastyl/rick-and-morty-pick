import React, {
	ChangeEvent,
	ComponentProps,
	FunctionComponent,
	useEffect,
	useRef,
	useState,
} from "react";
import { Edit2 } from "react-feather";

import { Task } from "../types";

const TaskCardContainer = (props: ComponentProps<"div">) => (
	<div
		className="bg-gray-300 rounded-lg max-w-6xl w-full text-lg h-64 p-3 mt-2 space-y-1"
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
	const [clicked, setClicked] = useState<
		React.RefObject<HTMLInputElement | HTMLTextAreaElement>
	>(inputRef);
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
			textareaRef.current?.blur();
			setEditing(false);
		}
	};
	useEffect(() => {
		clicked.current?.focus();
	}, [isEditing, clicked]);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	return (
		<TaskCardContainer
			onBlur={(evt) => {
				evt.preventDefault();
				//updateName(task.frontEndId!, nameState);
				//updateDescription(task.frontEndId!, descriptionState);
			}}
		>
			<header className="flex flex-row mt-1 justify-center border-b border-gray-900 py-1">
				<div className="text-xl h-full w-full">
					{isEditing ? (
						<input
							// eslint-disable-next-line jsx-a11y/no-autofocus
							ref={inputRef}
							type="text"
							placeholder={nameState}
							className="bg-gray-100 py-2 px-4 w-64 rounded inline-flex items-center min-w-full"
							value={nameState}
							onChange={handleNameChange}
							onKeyDown={(e) => handleKeyDown(e, "input")}
							onBlur={() => {
								return task.name !== nameState
									? updateName(task.frontEndId, nameState)
									: undefined;
							}}
						/>
					) : (
						<button
							onClick={() => {
								setEditing(true);
								setClicked(inputRef);
							}}
							className="text-gray-800 py-2 px-4 w-64 rounded inline-flex items-center 
							min-w-full
							border border-dashed hover:border-gray-700 focus:outline-none focus:border-gray-700"
						>
							<span className="overflow-hidden whitespace-no-wrap h-10">
								{task.name}
							</span>
							<Edit2
								className="text-gray-300 hover:text-gray-800"
								viewBox="-10 -4 54 24"
							/>
						</button>
					)}
				</div>
				<TaskReadyIndicator isReady={task.isReady} />
			</header>
			<div>
				{isEditing ? (
					<textarea
						// eslint-disable-next-line jsx-a11y/no-autofocus
						onKeyDown={(e) => handleKeyDown(e, "textarea")}
						className="h-40 w-64 min-w-full bg-gray-100 text-base p-3 mt-1 rounded"
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
						<button
							onClick={(e) => {
								e.preventDefault();
								setEditing(true);
								setClicked(textareaRef);
							}}
							className=" inline-flex hover:text-gray-700 p-3
							border border-dashed hover:border-gray-700 focus:outline-none focus:border-gray-700
							 h-40 w-full "
						>
							<span className="min-w-full w-54 h-full">
								{" "}
								{task.description}
							</span>
							<Edit2
								className="text-gray-300 hover:text-gray-800"
								viewBox="-10 -4 54 24"
							/>
						</button>
					</div>
				)}
			</div>
		</TaskCardContainer>
	);
};
