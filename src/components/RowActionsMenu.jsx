import React, { useState } from "react";
import { IconButton, Tooltip, Menu, MenuItem } from "@mui/material";
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded";

export default function RowActionsMenu({ onEdit, onDelete, onHistory }) {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleEditClick = () => {
		if (onEdit) onEdit();
		handleClose();
	};

	const handleDeleteClick = () => {
		if (onDelete) onDelete();
		handleClose();
	};

	const handleHistoryClick = () => {
		if (onHistory) onHistory();
		handleClose();
	};

	const hasEdit = Boolean(onEdit);
	const hasDelete = Boolean(onDelete);
	const hasHistory = Boolean(onHistory);

	return (
		<>
			<Tooltip title="Acciones">
				<IconButton size="small" onClick={handleOpen}>
					<MoreHorizRounded />
				</IconButton>
			</Tooltip>

			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				{hasEdit && <MenuItem onClick={handleEditClick}>Editar</MenuItem>}
				{hasDelete && <MenuItem onClick={handleDeleteClick}>Eliminar</MenuItem>}
				{hasHistory && <MenuItem onClick={handleHistoryClick}>Historial de participación</MenuItem>}
				{!hasEdit && !hasDelete && !hasHistory && (
					<MenuItem disabled>No hay acciones</MenuItem>
				)}
			</Menu>
		</>
	);
}
