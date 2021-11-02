import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import auth from "../auth/auth-helper";
import { remove } from "./api-expense";

export default function DeleteExpense(props) {
  const [open, setOpen] = useState(false);

  const jwt = auth.isAuthenticated();

  const clickButton = () => {
    setOpen(true);
  };

  const deleteExpense = () => {
    remove({ expenseId: props.expense._id }, { t: jwt.token }).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOpen(false);
        props.onRemove(props.expense);
      }
    });
  };

  const handleRequestClose = () => {
    setOpen(false);
  };

  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton}>
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Delete " + props.expense.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your expense record {props.expense.title}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={deleteExpense}
            color="secondary"
            autoFocus="autoFocus"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}

DeleteExpense.propTypes = {
  expense: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};
