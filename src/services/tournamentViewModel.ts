import { apiFetchJson } from "./http";

export async function getTournamentViewModel() {
	const res = await apiFetchJson("/api/Tournaments/GetViewModelTournament?id=0");

	if (!res || !res.data) return {
		facilities: [],
		estatus: [],
		categories: [],
		disciplines: [],
		encargados: [],
	};

	return {
		facilities: res.data.facilities ?? [],
		estatus: res.data.estatus ?? [],
		categories: res.data.categories ?? [],
		disciplines: res.data.disciplines ?? [],
		encargados: res.data.encargados ?? [],
	};
}
