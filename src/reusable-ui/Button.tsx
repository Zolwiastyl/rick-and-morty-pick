import React from "react";

export type ButtonProps = {
	label?: string;
	icon?: JSX.Element;
	onClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
	if (!props.icon) {
		return (
			<button
				className="bg-gray-400 text-lg w-16
				text-blue-700 hover:text-blue-400 rounded-full 
				p-2 mt-2 stroke-2 stroke-current 
				focus:outline-none focus:shadow-outline"
				onClick={props.onClick}
			>
				{props.label}
			</button>
		);
	} else {
		return (
			<button
				className="bg-gray-400 text-lg w-16
			text-blue-800 rounded-full 
			p-2 hover:text-blue-400 stroke-2 mr-2
			stroke-current mt-2
			focus:outline-none active:shadow-outline
			active:outline-none "
				onClick={props.onClick}
			>
				<svg className="h-12 w-12 bg-gray-400 p-2" viewBox="0 0 24 24">
					{props.icon}
				</svg>
				{props.label}
			</button>
		);
	}
};
