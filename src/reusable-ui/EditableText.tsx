import React, { useState, HTMLAttributes } from "react";

type PropstForEditableText = {
	text: string | undefined;
	type: string;
	placeholder: string;
	children: React.ReactElement;
	propsForDiv?: HTMLAttributes<HTMLDivElement> & HTMLDivElement;
	childRef:
		| React.RefObject<HTMLInputElement>
		| React.RefObject<HTMLTextAreaElement>;
};

export const EditableText: React.FC<PropstForEditableText> = ({
	text,
	type,
	children,
	placeholder,
	childRef,
	...propsForDiv
}) => {
	const [isEditing, setEditing] = useState<boolean>(false);
	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLDivElement>,
		type: string
	) => {
		const { key } = event;
		const keys = ["Escape"];
		const enterKey = "Enter";
		const allKeys = [...keys, enterKey]; // All keys array

		/* 
    - For textarea, check only Escape and Tab key and set the state to false
    - For everything else, all three keys will set the state to false
  */
		if (
			(type === "textarea" && keys.indexOf(key) !== -1) ||
			(type !== "textarea" && allKeys.indexOf(key) !== -1)
		) {
			setEditing(false);
			childRef.current!.blur();
		}
	};

	return (
		<div {...propsForDiv}>
			{isEditing ? (
				<div
					onBlur={() => setEditing(false)}
					onKeyDown={(e) => handleKeyDown(e, type)}
				>
					{children}
				</div>
			) : (
				<div onClick={() => setEditing(true)}>
					<span>{text || placeholder || "Editable content"}</span>
				</div>
			)}
		</div>
	);
};
