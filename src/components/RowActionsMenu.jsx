import React, { useState } from "react";
import { IconButton, Tooltip, Menu, MenuItem } from "@mui/material";
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded";

export default function RowActionsMenu({ onEdit, onDelete }) {
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

	const hasEdit = Boolean(onEdit);
	const hasDelete = Boolean(onDelete);

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
				{!hasEdit && !hasDelete && (
					<MenuItem disabled>No hay acciones</MenuItem>
				)}
			</Menu>
		</>
	);
}
