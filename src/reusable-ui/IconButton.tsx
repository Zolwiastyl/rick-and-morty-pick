import React from "react";
import { Icon } from "react-feather";

export type IconButtonProps = {
	label?: string;
	icon?: Icon;
	onClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const IconButton: React.FC<IconButtonProps> = (
	props: IconButtonProps
) => {
	if (!props.icon) {
		return (
			<button className="nav-bar-btn" onClick={props.onClick}>
				{props.label}
			</button>
		);
	} else {
		return (
			<button
				className="nav-bar-btn"
				onClick={props.onClick}
				cy-dataid={props.icon.displayName}
			>
				<props.icon className="h-12 w-12 p-2" size="24px" />

				{props.label}
			</button>
		);
	}
};
