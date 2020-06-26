import React from "react";

import { ClientAPI, Task } from "../types";

const defaultClient: ClientAPI = {
	callApi: async (
		partialCallback: (token: string) => Promise<Response | boolean>
	) => {
		return await true;
	},
	fetchTasks: async (
		callback: React.Dispatch<React.SetStateAction<Task[]>>
	) => {},
	sendTask: async (task: Task) => {},
};

export const ClientContext = React.createContext<ClientAPI>(defaultClient);
