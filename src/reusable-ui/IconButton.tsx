import React, { ComponentProps } from "react";
import { Icon } from "react-feather";

export type IconButtonProps = {
	label?: string;
	Icon?: Icon;
} & ComponentProps<"button">;

export const IconButton: React.FC<IconButtonProps> = ({
	label,
	Icon,
	onClick,
	...rest
}: IconButtonProps) => {
	if (!Icon) {
		return (
			<button className="nav-bar-btn" onClick={onClick}>
				<span className="h-12 w-12 p-2">{label}</span>
			</button>
		);
	} else {
		return (
			<button
				className="nav-bar-btn"
				onClick={onClick}
				title={Icon.displayName}
				data-testid={Icon.displayName}
			>
				<Icon
					className="h-12 w-12 p-2"
					size="24px"
					aria-label={Icon.displayName}
				/>

				{label}
			</button>
		);
	}
};
