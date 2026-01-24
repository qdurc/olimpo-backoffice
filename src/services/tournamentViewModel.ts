import { apiFetchJson } from "./http";

export async function getTournamentViewModel() {
	const res = await apiFetchJson("/api/Tournaments/GetViewModelTournament");

	if (!res || !(res as any).data) {
		return {
			facilities: [],
			estatus: [],
			categories: [],
			disciplines: [],
			encargados: [],
			users: [],
		};
	}

	return {
		facilities: (res as any).data.facilities ?? [],
		estatus: (res as any).data.estatus ?? [],
		categories: (res as any).data.categories ?? [],
		disciplines: (res as any).data.disciplines ?? [],
		encargados: (res as any).data.encargados ?? [],
		users: (res as any).data.users ?? [],
	};
}
